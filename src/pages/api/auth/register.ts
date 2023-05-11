import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { sign } from "jsonwebtoken";
import { User } from "@prisma/client";

// POST /api/auth/register
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name } = req.body;

  //la gestion des erreurs au niveau de l'email unique
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  const userCopied = { ...user } as Partial<User>;
  delete userCopied.password;

  res.json({
    user,
    token: sign(userCopied, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    }),
  });
}
