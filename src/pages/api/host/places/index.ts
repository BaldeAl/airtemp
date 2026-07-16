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
  let callingUser: any;
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
    };
    userId = decoded.user_id;

    callingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!callingUser || (callingUser.role !== "HOST" && callingUser.role !== "HOST_PENDING" && callingUser.role !== "ADMIN")) {
      return res.status(403).json({ message: "Forbidden: Hosts only" });
    }
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const places = await prisma.place.findMany({
        where: { hostId: userId },
        include: {
          city: true,
          Review: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(places);
    } catch (error) {
      console.error("Error fetching places:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    if (callingUser?.role === "HOST_PENDING") {
      return res.status(403).json({ message: "Forbidden: Account pending validation" });
    }
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
        latitude,
        longitude,
        cityName
      } = req.body;

      // Ensure city exists, or create it if missing
      // For simplicity, if they type a city name, we find it or use a default one.
      const actualCityName = cityName || "Paris";
      let city = await prisma.city.findFirst({
        where: { name: actualCityName }
      });
      
      if (!city) {
        // Find highest city_id to avoid unique constraint issues
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

      // Generate a unique place_id
      const maxPlace = await prisma.place.findFirst({
        orderBy: { place_id: "desc" },
        select: { place_id: true },
      });
      const nextPlaceId = (maxPlace?.place_id ?? 0) + 1;

      const place = await prisma.place.create({
        data: {
          place_id: nextPlaceId,
          name,
          description,
          image,
          images: images || [],
          amenities: amenities || [],
          category: category || "City",
          numberOfRooms: Number(numberOfRooms) || 0,
          numberOfBathrooms: Number(numberOfBathrooms) || 0,
          maxGuests: Number(maxGuests) || 1,
          priceByNight: Number(priceByNight) || 0,
          totalUnits: Number(totalUnits) || 1,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          host: { connect: { user_id: userId } },
          city: { connect: { city_id: city.city_id } }
        },
      });

      return res.status(201).json(place);
    } catch (error) {
      console.error("Error creating place:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
