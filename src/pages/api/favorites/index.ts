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
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          place: {
            include: {
              city: true,
              host: true,
              Review: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { placeId } = req.body;

    try {
      const existing = await prisma.favorite.findFirst({
        where: { userId, placeId },
      });

      if (existing) {
        await prisma.favorite.delete({ where: { id: existing.id } });
        return res.json({ action: "removed" });
      }

      // Generate a unique fav_id using max + 1 to avoid collisions
      const maxFav = await prisma.favorite.findFirst({
        orderBy: { fav_id: "desc" },
        select: { fav_id: true },
      });
      const nextFavId = (maxFav?.fav_id ?? 0) + 1;

      const fav = await prisma.favorite.create({
        data: {
          fav_id: nextFavId,
          user: { connect: { user_id: userId } },
          place: { connect: { place_id: placeId } },
        },
      });
      return res.status(201).json({ action: "added", favorite: fav });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
