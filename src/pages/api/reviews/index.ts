import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const placeId = Number(req.query.placeId);
    if (!placeId && placeId !== 0) {
      return res.status(400).json({ message: "placeId is required" });
    }
    const reviews = await prisma.review.findMany({
      where: { placeId },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(reviews);
  }

  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { user_id: userId } = verify(
        token,
        process.env.JWT_SECRET as string
      ) as { user_id: number };

      const { placeId, rating, comment } = req.body;

      const reviews = await prisma.review.findMany();
      const review = await prisma.review.create({
        data: {
          review_id: reviews.length + 1,
          rating,
          comment,
          user: { connect: { user_id: userId } },
          place: { connect: { place_id: placeId } },
        },
        include: {
          user: { select: { name: true, avatar: true } },
        },
      });

      return res.status(201).json(review);
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
