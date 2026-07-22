import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
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

    const { targetUserId, action } = req.body;

    if (!targetUserId || !action) {
      return res
        .status(400)
        .json({ message: "targetUserId and action are required" });
    }

    if (action !== "revoke" && action !== "grant") {
      return res
        .status(400)
        .json({ message: "action must be 'revoke' or 'grant'" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { user_id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Revoke: HOST → USER  |  Grant: USER → HOST
    const newRole = action === "revoke" ? "USER" : "HOST";

    const updatedUser = await prisma.user.update({
      where: { user_id: targetUserId },
      data: { role: newRole },
    });

    return res.status(200).json({
      message:
        action === "revoke" ? "Host rights revoked" : "Host rights granted",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error toggling host role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
