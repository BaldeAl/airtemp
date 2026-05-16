import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = Array.from({ length: 100 }).map(
  (_, id) => ({
    user_id: id,
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
  })
);

const cityData: Prisma.CityCreateInput[] = Array.from({ length: 100 }).map(
  (_, id) => ({
    city_id: id,
    name: faker.location.city(),
  })
);

const placeData: Prisma.PlaceCreateInput[] = Array.from({ length: 100 }).map(
  (_, ide) => ({
    place_id: ide,
    name: `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()}`,
    description: faker.lorem.paragraph(),
    image: faker.image.url({ width: 500, height: 500 }),
    numberOfRooms: faker.number.int({ min: 1, max: 10 }),
    numberOfBathrooms: faker.number.int({ min: 1, max: 3 }),
    maxGuests: faker.number.int({ min: 1, max: 10 }),
    priceByNight: faker.number.int({ min: 100, max: 1000 }),
    host: {
      connect: {
        user_id: faker.number.int({ min: 1, max: 99 }),
      },
    },
    city: {
      connect: {
        city_id: faker.number.int({ min: 1, max: 99 }),
      },
    },
  })
);

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.user_id}`);
  }
  for (const c of cityData) {
    const city = await prisma.city.create({
      data: c,
    });
    console.log(`Created city with id: ${city.city_id}`);
  }
  for (const p of placeData) {
    try {
      const place = await prisma.place.create({
        data: p,
      });
      console.log(`Created place with id: ${place.place_id}`);
    } catch {
      console.error("Fail to create place");
    }
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });