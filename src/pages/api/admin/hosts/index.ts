import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
      role?: string;
    };

    // For testing/development: If there are no admins, allow the first user to access this
    // In production, strictly check `decoded.role === "ADMIN"`
    const callingUser = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!callingUser || callingUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const pendingHosts = await prisma.user.findMany({
      where: { role: "HOST_PENDING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        user_id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
      },
    });

    return res.status(200).json(pendingHosts);
  } catch (error) {
    console.error("Error fetching pending hosts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
