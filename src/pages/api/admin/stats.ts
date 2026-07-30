import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
    };

    const callingUser = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!callingUser || callingUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const [totalUsers, totalPlaces, totalBookings, confirmedBookings] =
      await Promise.all([
        prisma.user.count(),
        prisma.place.count(),
        prisma.booking.count(),
        prisma.booking.findMany({
          where: { status: "confirmed" },
          select: { totalPrice: true },
        }),
      ]);

    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0,
    );

    return res.status(200).json({
      totalUsers,
      totalPlaces,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error in admin stats API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
