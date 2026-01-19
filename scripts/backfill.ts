/**
 * Optimized backfill script for Perseverance rover images.
 * Uses parallel fetching for much faster data ingestion.
 *
 * Usage: npx ts-node scripts/backfill.ts [startSol] [endSol] [concurrency]
 *
 * Examples:
 *   npx ts-node scripts/backfill.ts              # Backfill all sols (10 concurrent)
 *   npx ts-node scripts/backfill.ts 0 500        # Backfill sols 0-500
 *   npx ts-node scripts/backfill.ts 0 1730 20    # Backfill with 20 concurrent requests
 */

import { PrismaClient } from "@prisma/client";
import { PERSEVERANCE_CAMERAS } from "../lib/cameras";
import type { NASALatestResponse, NASASolResponse } from "../lib/types";

const prisma = new PrismaClient();

const NASA_LATEST_URL =
  "https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&latest=true";

const NASA_SOL_URL = (sol: number) =>
  `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&sol=${sol}`;

async function ensureCamerasExist(): Promise<Map<string, number>> {
  const cameraMap = new Map<string, number>();

  for (const [name, fullName] of Object.entries(PERSEVERANCE_CAMERAS)) {
    const camera = await prisma.camera.upsert({
      where: { name },
      update: {},
      create: { name, fullName },
    });
    cameraMap.set(name, camera.id);
  }

  return cameraMap;
}

async function getLatestSolFromNASA(): Promise<number> {
  const response = await fetch(NASA_LATEST_URL);
  const data = (await response.json()) as NASALatestResponse;
  return data.latest_sol;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<NASASolResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url);

    // Check if we got HTML (rate limited) instead of JSON
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (attempt < retries) {
        const delay = attempt * 2000; // 2s, 4s, 6s backoff
        console.log(`\n  Rate limited on ${url}, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw new Error("Rate limited - received HTML instead of JSON");
    }

    return (await response.json()) as NASASolResponse;
  }
  throw new Error("Max retries exceeded");
}

async function scrapeSol(
  sol: number,
  cameraMap: Map<string, number>
): Promise<{ sol: number; count: number }> {
  try {
    const data = await fetchWithRetry(NASA_SOL_URL(sol));

    if (!data.images || data.images.length === 0) {
      return { sol, count: 0 };
    }

    const photosToInsert: Array<{
      imgSrc: string;
      sol: number;
      earthDate: Date;
      cameraId: number;
    }> = [];

    for (const image of data.images) {
      if (image.sample_type !== "Full") continue;

      const cameraName = image.camera?.instrument;
      if (!cameraName) continue;

      let cameraId = cameraMap.get(cameraName);
      if (!cameraId) {
        // Camera not in predefined list - add it dynamically
        const newCamera = await prisma.camera.upsert({
          where: { name: cameraName },
          update: {},
          create: { name: cameraName, fullName: cameraName },
        });
        cameraId = newCamera.id;
        cameraMap.set(cameraName, cameraId);
      }

      const imgSrc = image.image_files?.full_res;
      if (!imgSrc) continue;

      photosToInsert.push({
        imgSrc,
        sol,
        earthDate: new Date(image.date_taken_utc),
        cameraId,
      });
    }

    if (photosToInsert.length > 0) {
      const result = await prisma.photo.createMany({
        data: photosToInsert,
        skipDuplicates: true,
      });
      return { sol, count: result.count };
    }

    return { sol, count: 0 };
  } catch (error) {
    console.error(`Error scraping sol ${sol}:`, error);
    return { sol, count: 0 };
  }
}

async function processInBatches(
  sols: number[],
  cameraMap: Map<string, number>,
  concurrency: number,
  onProgress: (completed: number, total: number, inserted: number, currentSols: number[]) => void
): Promise<number> {
  let totalInserted = 0;
  let completed = 0;

  for (let i = 0; i < sols.length; i += concurrency) {
    const batch = sols.slice(i, i + concurrency);

    // Show which sols we're currently fetching
    onProgress(completed, sols.length, totalInserted, batch);

    const results = await Promise.all(
      batch.map((sol) => scrapeSol(sol, cameraMap))
    );

    for (const result of results) {
      totalInserted += result.count;
      completed++;
    }

    // Delay between batches to avoid rate limiting
    // NASA seems to allow ~30 req/min, so 2s delay with concurrency 1 = safe
    const delay = concurrency === 1 ? 2000 : 1000;
    await sleep(delay);
  }

  return totalInserted;
}

async function main() {
  const args = process.argv.slice(2);
  const startSol = args[0] ? parseInt(args[0], 10) : 0;
  const endSolArg = args[1] ? parseInt(args[1], 10) : null;
  const concurrency = args[2] ? parseInt(args[2], 10) : 1;

  console.log("=".repeat(60));
  console.log("NASA.cam Optimized Backfill");
  console.log("=".repeat(60));

  const cameraMap = await ensureCamerasExist();
  console.log(`Initialized ${cameraMap.size} cameras`);

  const latestSolNASA = await getLatestSolFromNASA();
  console.log(`Latest sol from NASA: ${latestSolNASA}`);

  const endSol = endSolArg ?? latestSolNASA;
  const sols = Array.from({ length: endSol - startSol + 1 }, (_, i) => startSol + i);

  console.log(`Backfilling sols ${startSol} to ${endSol} (${sols.length} sols)`);
  console.log(`Concurrency: ${concurrency} parallel requests`);
  console.log("=".repeat(60));

  const startTime = Date.now();

  const totalInserted = await processInBatches(
    sols,
    cameraMap,
    concurrency,
    (completed, total, inserted, currentSols) => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      // Log every batch (not throttled) so user sees real progress
      const rate = elapsed > 0 ? (completed / elapsed).toFixed(1) : "0";
      const eta = elapsed > 0 && completed > 0
        ? Math.round((total - completed) / (completed / elapsed))
        : "...";
      const progress = ((completed / total) * 100).toFixed(1);
      const solRange = currentSols.length > 1
        ? `${currentSols[0]}-${currentSols[currentSols.length - 1]}`
        : `${currentSols[0]}`;

      console.log(
        `Fetching sols ${solRange.padEnd(10)} | ` +
        `Done: ${completed}/${total} (${progress}%) | ` +
        `Photos: ${inserted} | ` +
        `${rate} sols/s | ` +
        `ETA: ${eta}s`
      );
    }
  );

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n" + "=".repeat(60));
  console.log("Backfill complete!");
  console.log(`Total photos inserted: ${totalInserted}`);
  console.log(`Total time: ${totalTime}s`);
  console.log(`Average rate: ${(sols.length / parseFloat(totalTime)).toFixed(1)} sols/second`);
  console.log("=".repeat(60));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
