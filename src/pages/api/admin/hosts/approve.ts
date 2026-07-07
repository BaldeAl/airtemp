import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
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
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
    };

    const callingUser = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!callingUser || callingUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: targetUserId },
      data: { role: "HOST" },
    });

    return res.status(200).json({ message: "Host approved", user: updatedUser });
  } catch (error) {
    console.error("Error approving host:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
