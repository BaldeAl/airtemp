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
      // Get all messages where user is sender or receiver
      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: { select: { user_id: true, name: true, avatar: true } },
          receiver: { select: { user_id: true, name: true, avatar: true } },
          place: { select: { place_id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      // Group into conversations by the other user
      const conversationsMap = new Map<
        number,
        {
          otherUser: { user_id: number; name: string; avatar: string | null };
          lastMessage: (typeof messages)[0];
          unreadCount: number;
          place?: { place_id: number; name: string; image: string } | null;
        }
      >();

      for (const msg of messages) {
        const otherUserId =
          msg.senderId === userId ? msg.receiverId : msg.senderId;
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            otherUser,
            lastMessage: msg,
            unreadCount: 0,
            place: msg.place,
          });
        }

        const conv = conversationsMap.get(otherUserId)!;
        if (!msg.read && msg.receiverId === userId) {
          conv.unreadCount++;
        }
      }

      const conversations = Array.from(conversationsMap.values()).sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime(),
      );

      return res.status(200).json({ conversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { receiverId, content, placeId } = req.body;

    if (!receiverId || !content?.trim()) {
      return res
        .status(400)
        .json({ message: "receiverId and content are required" });
    }

    if (receiverId === userId) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself" });
    }

    try {
      const maxMsg = await prisma.message.findFirst({
        orderBy: { message_id: "desc" },
        select: { message_id: true },
      });
      const nextId = (maxMsg?.message_id ?? 0) + 1;

      const message = await prisma.message.create({
        data: {
          message_id: nextId,
          content: content.trim(),
          sender: { connect: { user_id: userId } },
          receiver: { connect: { user_id: receiverId } },
          ...(placeId ? { place: { connect: { place_id: placeId } } } : {}),
        },
        include: {
          sender: { select: { user_id: true, name: true, avatar: true } },
          receiver: { select: { user_id: true, name: true, avatar: true } },
        },
      });

      return res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
