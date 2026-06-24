import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../../lib/db";
import type { ActivityAPIResponse, ActivityDay } from "../../../../lib/types";

// Returns the Earth dates that have photos within an inclusive [from, to] range,
// with a per-day photo count. The frontend calls this one month at a time to
// drive the DatePicker, so the payload stays small and constant regardless of
// how large the mission history grows.
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const from = Array.isArray(req.query.from) ? req.query.from[0] : req.query.from;
  const to = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to;

  if (!from || !to) {
    return res.status(400).json({
      error: "Missing required parameters 'from' and 'to' (YYYY-MM-DD).",
    });
  }

  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T23:59:59.999Z`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: "Invalid date. Use YYYY-MM-DD." });
  }

  try {
    // Range scan on the @@index([earthDate]) — bounded to the requested window.
    const rows = await prisma.photo.groupBy({
      by: ["earthDate"],
      where: { earthDate: { gte: start, lte: end } },
      _count: { id: true },
      orderBy: { earthDate: "asc" },
    });

    // Collapse to one entry per calendar day (earthDate may carry a time).
    const byDay = new Map<string, number>();
    for (const row of rows) {
      const day = row.earthDate.toISOString().split("T")[0];
      byDay.set(day, (byDay.get(day) || 0) + row._count.id);
    }

    const activity: ActivityDay[] = Array.from(byDay, ([earth_date, total_photos]) => ({
      earth_date,
      total_photos,
    }));

    const response: ActivityAPIResponse = { activity };

    // Cache for 1 hour
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(response);
  } catch (error) {
    console.error("Activity error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
