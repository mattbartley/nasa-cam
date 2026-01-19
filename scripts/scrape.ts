/**
 * Incremental scraper for Perseverance rover images.
 * Fetches new sols from NASA RSS feed and stores them in the database.
 * Designed to run as a cron job.
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

async function getMaxSolFromDB(): Promise<number> {
  const result = await prisma.photo.aggregate({
    _max: { sol: true },
  });
  return result._max.sol ?? -1;
}

async function scrapeSol(
  sol: number,
  cameraMap: Map<string, number>
): Promise<number> {
  console.log(`Scraping sol ${sol}...`);

  const response = await fetch(NASA_SOL_URL(sol));
  const data = (await response.json()) as NASASolResponse;

  if (!data.images || data.images.length === 0) {
    console.log(`  No images found for sol ${sol}`);
    return 0;
  }

  let insertedCount = 0;

  for (const image of data.images) {
    // Only process full-size images
    if (image.sample_type !== "Full") {
      continue;
    }

    const cameraName = image.camera?.instrument;
    if (!cameraName) {
      continue;
    }

    // Get or create camera
    let cameraId = cameraMap.get(cameraName);
    if (!cameraId) {
      // Camera not in our predefined list - create it
      const newCamera = await prisma.camera.upsert({
        where: { name: cameraName },
        update: {},
        create: { name: cameraName, fullName: cameraName },
      });
      cameraId = newCamera.id;
      cameraMap.set(cameraName, cameraId);
      console.log(`  Created new camera: ${cameraName}`);
    }

    const imgSrc = image.image_files?.full_res;
    if (!imgSrc) {
      continue;
    }

    const earthDate = new Date(image.date_taken_utc);

    try {
      await prisma.photo.create({
        data: {
          imgSrc,
          sol,
          earthDate,
          cameraId,
        },
      });
      insertedCount++;
    } catch (error: any) {
      // Ignore duplicate key errors (photo already exists)
      if (error.code !== "P2002") {
        console.error(`  Error inserting photo: ${error.message}`);
      }
    }
  }

  console.log(`  Inserted ${insertedCount} photos for sol ${sol}`);
  return insertedCount;
}

async function main() {
  console.log("Starting incremental scrape...");

  const cameraMap = await ensureCamerasExist();
  console.log(`Ensured ${cameraMap.size} cameras exist`);

  const latestSolNASA = await getLatestSolFromNASA();
  const maxSolDB = await getMaxSolFromDB();

  console.log(`Latest sol from NASA: ${latestSolNASA}`);
  console.log(`Max sol in database: ${maxSolDB}`);

  if (maxSolDB >= latestSolNASA) {
    console.log("Database is up to date. Nothing to scrape.");
    return;
  }

  const startSol = maxSolDB + 1;
  let totalInserted = 0;

  for (let sol = startSol; sol <= latestSolNASA; sol++) {
    const inserted = await scrapeSol(sol, cameraMap);
    totalInserted += inserted;

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\nScrape complete. Total photos inserted: ${totalInserted}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
