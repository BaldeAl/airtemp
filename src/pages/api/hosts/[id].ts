import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const hostId = Number(id);

  if (isNaN(hostId)) {
    return res.status(400).json({ message: "Invalid host ID" });
  }

  try {
    const host = await prisma.user.findUnique({
      where: { user_id: hostId },
      select: {
        id: true,
        user_id: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        Place: {
          orderBy: { createdAt: "desc" },
          include: {
            city: true,
            Review: {
              select: { rating: true },
            },
          },
        },
      },
    });

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    return res.status(200).json(host);
  } catch (error) {
    console.error("Error fetching public host details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
