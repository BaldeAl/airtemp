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

  try {
    const { user_id: userId } = verify(
      token,
      process.env.JWT_SECRET as string
    ) as { user_id: number };

    const { reviewId, reply } = req.body;

    if (!reviewId || !reply || !reply.trim()) {
      return res.status(400).json({ message: "reviewId and reply are required" });
    }

    // Find the review and verify the caller is the host of the place
    const review = await prisma.review.findUnique({
      where: { review_id: reviewId },
      include: {
        place: { select: { hostId: true } },
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.place.hostId !== userId) {
      return res.status(403).json({ message: "Only the host of this place can reply" });
    }

    const updatedReview = await prisma.review.update({
      where: { review_id: reviewId },
      data: {
        hostReply: reply.trim(),
        hostReplyAt: new Date(),
      },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    return res.status(200).json(updatedReview);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
