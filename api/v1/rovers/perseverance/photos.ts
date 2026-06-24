import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../../lib/db";
import type { PhotosAPIResponse, PhotoResponse } from "../../../../lib/types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sol, earth_date, camera, page = "1", per_page = "25" } = req.query;

  // Require either sol or earth_date
  if (!sol && !earth_date) {
    return res.status(400).json({
      error: "Missing required parameter. Provide either 'sol' or 'earth_date'."
    });
  }

  try {
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(per_page as string, 10) || 25));
    const skip = (pageNum - 1) * perPage;

    // Build where clause
    const where: any = {};

    if (sol) {
      where.sol = parseInt(sol as string, 10);
    } else if (earth_date) {
      const date = new Date(earth_date as string);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid earth_date format. Use YYYY-MM-DD." });
      }
      // Match the entire day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      where.earthDate = { gte: startOfDay, lte: endOfDay };
    }

    // Filter by camera if provided
    if (camera) {
      const cameraRecord = await prisma.camera.findFirst({
        where: { name: (camera as string).toUpperCase() },
      });
      if (cameraRecord) {
        where.cameraId = cameraRecord.id;
      } else {
        // No matching camera, return empty
        return res.status(200).json({ photos: [] });
      }
    }

    // Fetch photos with camera data
    const photos = await prisma.photo.findMany({
      where,
      include: { camera: true },
      orderBy: { id: "asc" },
      skip,
      take: perPage,
    });

    // Transform to API response format
    const photoResponses: PhotoResponse[] = photos.map((photo) => ({
      id: photo.id,
      img_src: photo.imgSrc,
      sol: photo.sol,
      earth_date: photo.earthDate.toISOString().split("T")[0],
      camera: {
        id: photo.camera.id,
        name: photo.camera.name,
        full_name: photo.camera.fullName,
      },
      rover: {
        name: "Perseverance",
      },
    }));

    const response: PhotosAPIResponse = { photos: photoResponses };

    // Cache for 1 hour
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(response);
  } catch (error) {
    console.error("Photos error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
