import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const now = new Date();

  const places = await prisma.place.findMany({
    include: {
      city: true,
      host: true,
      Review: true,
      Booking: {
        where: {
          status: { in: ["confirmed", "pending"] },
          checkOut: { gt: now },
        },
      },
    },
  });

  // Filter out places where all units are occupied
  const availablePlaces = places.filter((place) => {
    // Count bookings that overlap with today/future
    const activeBookings = place.Booking.length;
    return activeBookings < place.totalUnits;
  });

  // Remove Booking data from response (not needed by frontend)
  const result = availablePlaces.map(({ Booking, ...rest }) => rest);

  res.json(result);
}
