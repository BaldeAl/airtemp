import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { verify } from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: number;
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
    };
    userId = decoded.user_id;

    const callingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!callingUser || (callingUser.role !== "HOST" && callingUser.role !== "ADMIN")) {
      return res.status(403).json({ message: "Forbidden: Hosts only" });
    }
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const placeId = Number(req.query.id);
  if (!placeId && placeId !== 0) {
    return res.status(400).json({ message: "Invalid place ID" });
  }

  // Ensure the place exists and belongs to the host
  const existingPlace = await prisma.place.findUnique({
    where: { place_id: placeId },
  });

  if (!existingPlace) {
    return res.status(404).json({ message: "Place not found" });
  }

  if (existingPlace.hostId !== userId) {
    return res.status(403).json({ message: "Forbidden: You do not own this place" });
  }

  if (req.method === "PUT") {
    try {
      const {
        name,
        description,
        image,
        images,
        amenities,
        category,
        numberOfRooms,
        numberOfBathrooms,
        maxGuests,
        priceByNight,
        totalUnits,
        cityName
      } = req.body;

      // Ensure city exists, or create it if missing
      const actualCityName = cityName || "Paris";
      let city = await prisma.city.findFirst({
        where: { name: actualCityName }
      });
      
      if (!city) {
        const maxCity = await prisma.city.findFirst({
          orderBy: { city_id: "desc" },
          select: { city_id: true }
        });
        const nextCityId = (maxCity?.city_id ?? 0) + 1;
        city = await prisma.city.create({
          data: {
            city_id: nextCityId,
            name: actualCityName
          }
        });
      }

      const updatedPlace = await prisma.place.update({
        where: { place_id: placeId },
        data: {
          name: name !== undefined ? name : existingPlace.name,
          description: description !== undefined ? description : existingPlace.description,
          image: image !== undefined ? image : existingPlace.image,
          images: images !== undefined ? images : existingPlace.images,
          amenities: amenities !== undefined ? amenities : existingPlace.amenities,
          category: category !== undefined ? category : existingPlace.category,
          numberOfRooms: numberOfRooms !== undefined ? Number(numberOfRooms) : existingPlace.numberOfRooms,
          numberOfBathrooms: numberOfBathrooms !== undefined ? Number(numberOfBathrooms) : existingPlace.numberOfBathrooms,
          maxGuests: maxGuests !== undefined ? Number(maxGuests) : existingPlace.maxGuests,
          priceByNight: priceByNight !== undefined ? Number(priceByNight) : existingPlace.priceByNight,
          totalUnits: totalUnits !== undefined ? Number(totalUnits) : existingPlace.totalUnits,
          city: { connect: { city_id: city.city_id } }
        },
      });

      return res.status(200).json(updatedPlace);
    } catch (error) {
      console.error("Error updating place:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.place.delete({
        where: { place_id: placeId },
      });
      return res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
      console.error("Error deleting place:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
