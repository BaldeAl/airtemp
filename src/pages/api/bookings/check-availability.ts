import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
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
    // Find any confirmed booking that overlaps with the requested dates
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        placeId,
        status: "confirmed",
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    return res.status(200).json({
      available: !conflictingBooking,
      message: conflictingBooking
        ? "These dates are not available. Another booking exists for this period."
        : "Dates are available!",
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
