import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  if (req.method === "GET") {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        place: {
          include: {
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(bookings);
  }

  if (req.method === "POST") {
    const { placeId, checkIn, checkOut, guests, totalPrice } = req.body;

    const allBookings = await prisma.booking.findMany();
    const booking = await prisma.booking.create({
      data: {
        booking_id: allBookings.length + 1,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice,
        status: "confirmed",
        user: { connect: { user_id: userId } },
        place: { connect: { place_id: placeId } },
      },
      include: {
        place: {
          include: { city: true },
        },
      },
    });

    return res.status(201).json(booking);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
