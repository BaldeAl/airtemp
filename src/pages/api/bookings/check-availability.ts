import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { placeId, checkIn, checkOut } = req.body;

  if (!placeId || !checkIn || !checkOut) {
    return res
      .status(400)
      .json({ message: "placeId, checkIn, and checkOut are required" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    return res
      .status(400)
      .json({ message: "Check-out must be after check-in" });
  }

  try {
    // Get the place to know how many units are available
    const place = await prisma.place.findUnique({
      where: { place_id: placeId },
      select: { totalUnits: true },
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Count overlapping bookings that are confirmed or pending
    const overlappingCount = await prisma.booking.count({
      where: {
        placeId,
        status: { in: ["confirmed", "pending"] },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    const available = overlappingCount < place.totalUnits;

    return res.status(200).json({
      available,
      message: available
        ? "Dates are available!"
        : "These dates are not available. All units are booked for this period.",
      availableUnits: place.totalUnits - overlappingCount,
      totalUnits: place.totalUnits,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
