import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../lib/db";
import { PERSEVERANCE_LANDING_DATE } from "../../../lib/cameras";
import type { ManifestAPIResponse } from "../../../lib/types";

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
    // The manifest only powers the mission stats and the DatePicker's default
    // date, so it needs just three aggregates — total photos, latest sol, and
    // latest Earth date. A single aggregate (count + max) stays cheap and flat
    // as the mission history grows; per-day activity is served separately by
    // the /activity endpoint. The @@index([sol]) backs the _max lookups.
    const stats = await prisma.photo.aggregate({
      _count: true,
      _max: { sol: true, earthDate: true },
    });

    const totalPhotos = stats._count;
    const maxSol = stats._max.sol ?? 0;
    const maxDate = stats._max.earthDate
      ? stats._max.earthDate.toISOString().split("T")[0]
      : PERSEVERANCE_LANDING_DATE;

    const response: ManifestAPIResponse = {
      photo_manifest: {
        name: "Perseverance",
        landing_date: PERSEVERANCE_LANDING_DATE,
        max_date: maxDate,
        max_sol: maxSol,
        total_photos: totalPhotos,
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
