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

  const otherUserId = Number(req.query.userId);
  if (!otherUserId) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (req.method === "GET") {
    try {
      // Get all messages between current user and other user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        include: {
          sender: { select: { user_id: true, name: true, avatar: true } },
          place: { select: { place_id: true, name: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          read: false,
        },
        data: { read: true },
      });

      // Get other user info
      const otherUser = await prisma.user.findUnique({
        where: { user_id: otherUserId },
        select: { user_id: true, name: true, avatar: true, role: true },
      });

      return res.status(200).json({ messages, otherUser });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
