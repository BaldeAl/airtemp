import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
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
      return res.status(403).json({ message: "Only hosts can access this" });
    }

    // Get all bookings for places owned by this host
    const bookings = await prisma.booking.findMany({
      where: {
        place: {
          hostId: userId,
        },
      },
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
      orderBy: { checkIn: "desc" },
    });

    // Calculate stats
    const totalRevenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((acc, b) => acc + b.totalPrice, 0);

    const now = new Date();
    const upcomingCount = bookings.filter(
      (b) => new Date(b.checkIn) >= now && b.status === "confirmed"
    ).length;

    return res.status(200).json({
      bookings,
      stats: {
        total: bookings.length,
        revenue: totalRevenue,
        upcoming: upcomingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
