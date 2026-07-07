import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { User } from "@prisma/client";
import { hashSync } from "bcryptjs";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name, isHost, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Generate a unique user_id using max + 1 to avoid collisions
    const maxUser = await prisma.user.findFirst({
      orderBy: { user_id: "desc" },
      select: { user_id: true },
    });
    const nextUserId = (maxUser?.user_id ?? 0) + 1;

    // Hash password with bcrypt
    const hashedPassword = hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        user_id: nextUserId,
        email,
        password: hashedPassword,
        name,
        role: isHost ? "HOST_PENDING" : "USER",
        address: isHost ? address : null,
      },
    });

    const userCopied = { ...user } as Partial<User>;
    delete userCopied.password;

    res.json({
      user: userCopied,
      token: sign(userCopied, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      }),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
