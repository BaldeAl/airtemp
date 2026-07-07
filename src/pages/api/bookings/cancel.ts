import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: number;
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
    };
    userId = decoded.user_id;
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { bookingId } = req.body;

  if (!bookingId && bookingId !== 0) {
    return res.status(400).json({ message: "bookingId is required" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Only confirmed bookings can be cancelled" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: "cancelled" },
      include: {
        place: {
          include: { city: true },
        },
      },
    });

    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
