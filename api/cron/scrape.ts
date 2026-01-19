/**
 * Cron endpoint for incremental scraping.
 * Called daily by Vercel Cron to fetch new Perseverance images.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import { PERSEVERANCE_CAMERAS } from "../../lib/cameras";
import type { NASALatestResponse, NASASolResponse } from "../../lib/types";

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

async function scrapeSol(
  sol: number,
  cameraMap: Map<string, number>
): Promise<number> {
  const response = await fetch(NASA_SOL_URL(sol));
  const data = (await response.json()) as NASASolResponse;

  if (!data.images || data.images.length === 0) {
    return 0;
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
    return result.count;
  }

  return 0;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify this is called by Vercel Cron
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // In development, allow without auth
    if (process.env.NODE_ENV === "production") {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const cameraMap = await ensureCamerasExist();

    // Get latest sol from NASA
    const nasaResponse = await fetch(NASA_LATEST_URL);
    const nasaData = (await nasaResponse.json()) as NASALatestResponse;
    const latestSolNASA = nasaData.latest_sol;

    // Get max sol from DB
    const dbResult = await prisma.photo.aggregate({
      _max: { sol: true },
    });
    const maxSolDB = dbResult._max.sol ?? -1;

    if (maxSolDB >= latestSolNASA) {
      return res.status(200).json({
        message: "Database is up to date",
        latestSol: latestSolNASA,
        photosInserted: 0,
      });
    }

    // Scrape new sols
    let totalInserted = 0;
    for (let sol = maxSolDB + 1; sol <= latestSolNASA; sol++) {
      const inserted = await scrapeSol(sol, cameraMap);
      totalInserted += inserted;
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return res.status(200).json({
      message: "Scrape complete",
      solsScraped: latestSolNASA - maxSolDB,
      photosInserted: totalInserted,
    });
  } catch (error) {
    console.error("Cron scrape error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
