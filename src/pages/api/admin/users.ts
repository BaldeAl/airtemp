import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
      role?: string;
    };

    const callingUser = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!callingUser || callingUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          user_id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              Booking: true,
              Place: true,
            },
          },
        },
      });
      return res.status(200).json(users);
    }

    if (req.method === "PUT") {
      const { targetUserId, newRole } = req.body;
      if (!targetUserId || !newRole) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const updated = await prisma.user.update({
        where: { user_id: Number(targetUserId) },
        data: { role: newRole },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in admin users API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
