import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

// GET /api/places/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const place = await prisma.place.findUnique({
    where: {
      id: Number(req.query?.id),
    },
    include: {
      city: true,
      host: true,
    },
  });
  res.json(place);
}
