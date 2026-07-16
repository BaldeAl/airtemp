import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
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

  try {
    // Verify user is a HOST or ADMIN
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) {
      return res.status(403).json({ message: "Only hosts can manage bookings" });
    }

    const { bookingId, action } = req.body;

    if (!bookingId && bookingId !== 0) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" });
    }

    // Find the booking and verify it belongs to a place owned by this host
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: {
        place: { select: { hostId: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.place.hostId !== userId) {
      return res.status(403).json({ message: "You can only manage bookings for your own places" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be approved or rejected" });
    }

    const newStatus = action === "approve" ? "confirmed" : "cancelled";

    const updatedBooking = await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: newStatus },
      include: {
        place: {
          select: {
            place_id: true,
            name: true,
            image: true,
            city: { select: { name: true } },
          },
        },
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: action === "approve" ? "Booking approved" : "Booking rejected",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error managing booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
