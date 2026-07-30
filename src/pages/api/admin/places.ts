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
    };

    const callingUser = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!callingUser || callingUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    if (req.method === "GET") {
      const places = await prisma.place.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          host: {
            select: {
              name: true,
              email: true,
            },
          },
          city: true,
        },
      });
      return res.status(200).json(places);
    }

    if (req.method === "DELETE") {
      const { placeId } = req.query;
      if (!placeId) {
        return res.status(400).json({ message: "Missing placeId" });
      }

      await prisma.place.delete({
        where: { place_id: Number(placeId) },
      });

      return res.status(200).json({ message: "Place deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in admin places API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
