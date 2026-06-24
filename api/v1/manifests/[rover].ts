import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../lib/db";
import { PERSEVERANCE_LANDING_DATE } from "../../../lib/cameras";
import type { ManifestAPIResponse, ManifestPhoto } from "../../../lib/types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rover } = req.query;
  const roverName = (rover as string).toLowerCase();

  if (roverName !== "perseverance") {
    return res.status(404).json({ error: "Rover not found. Only 'perseverance' is supported." });
  }

  try {
    // Get photo count per sol
    const solCounts = await prisma.photo.groupBy({
      by: ["sol"],
      _count: { id: true },
      _min: { earthDate: true },
      orderBy: { sol: "asc" },
    });

    // Get cameras per sol
    const camerasPerSol = await prisma.photo.findMany({
      select: {
        sol: true,
        camera: { select: { name: true } },
      },
      distinct: ["sol", "cameraId"],
      orderBy: { sol: "asc" },
    });

    // Build cameras lookup by sol
    const camerasBySol: Record<number, Set<string>> = {};
    for (const entry of camerasPerSol) {
      if (!camerasBySol[entry.sol]) {
        camerasBySol[entry.sol] = new Set();
      }
      camerasBySol[entry.sol].add(entry.camera.name);
    }

    // Build manifest photos array
    const photos: ManifestPhoto[] = solCounts.map((stat) => ({
      sol: stat.sol,
      earth_date: stat._min.earthDate?.toISOString().split("T")[0] || PERSEVERANCE_LANDING_DATE,
      total_photos: stat._count.id,
      cameras: Array.from(camerasBySol[stat.sol] || []),
    }));

    // Calculate totals
    const totalPhotos = await prisma.photo.count();
    const maxSol = solCounts.length > 0 ? solCounts[solCounts.length - 1].sol : 0;
    const maxDate = solCounts.length > 0 && solCounts[solCounts.length - 1]._min.earthDate
      ? solCounts[solCounts.length - 1]._min.earthDate!.toISOString().split("T")[0]
      : PERSEVERANCE_LANDING_DATE;

    const response: ManifestAPIResponse = {
      photo_manifest: {
        name: "Perseverance",
        landing_date: PERSEVERANCE_LANDING_DATE,
        max_date: maxDate,
        max_sol: maxSol,
        total_photos: totalPhotos,
        photos,
      },
    };

    // Cache for 1 hour
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(response);
  } catch (error) {
    console.error("Manifest error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
