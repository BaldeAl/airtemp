import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const places = await prisma.place.findMany({
    include: {
      city: true,
      host: true,
    },
  });
  res.json(places);
}
