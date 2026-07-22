import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const place = await prisma.place.findUnique({
    where: {
      place_id: Number(req.query?.id),
    },
    include: {
      city: true,
      host: {
        select: {
          user_id: true,
          name: true,
          avatar: true,
          bio: true,
          createdAt: true,
          Place: { select: { place_id: true } },
        },
      },
      Review: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  res.json(place);
}
