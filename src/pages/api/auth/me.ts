import type { NextApiRequest, NextApiResponse } from "next";
import { sign, verify } from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import { User } from "@prisma/client";

// PUT /api/auth/me
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unable to fetch user" });
    return;
  }

  try {
    const { user_id: userId } = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as {
      user_id: number;
    };

    if (!userId) {
      res.status(401).json({ message: "Unable to fetch user" });
      return;
    }

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: {
          user_id: userId,
        },
      });

      res.status(200).json({ user });
      return;
    } else if (req.method === "PUT") {
      const { name, email, password } = req.body;
      const user = await prisma.user.update({
        where: {
          user_id: userId,
        },
        data: {
          name,
          email,
          password,
        },
      });

      const userCopied = { ...user } as Partial<User>;
      delete userCopied.password;
      res.status(200).json({
        user,
        token: sign(userCopied, process.env.JWT_SECRET as string, {
          expiresIn: "1d",
        }),
      });
      return;
    } else {
      res.status(405).json({ message: "Method not allowed" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Unable to fetch user" });
    return;
  }
}
