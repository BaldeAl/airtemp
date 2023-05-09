import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = Array.from({ length: 100 }).map(
  (_) => ({
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
  })
);

const cityData: Prisma.CityCreateInput[] = Array.from({ length: 100 }).map(
  (_) => ({
    name: faker.address.city(),
  })
);

const placeData: Prisma.PlaceCreateInput[] = Array.from({ length: 100 }).map(
  (_) => ({
    name: `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()}`,
    description: faker.lorem.paragraph(),
    image: faker.image.city(500, 500, true),
    numberOfRooms: faker.datatype.number({
      min: 1,
      max: 10,
    }),
    numberOfBathrooms: faker.datatype.number({
      min: 1,
      max: 3,
    }),
    maxGuests: faker.datatype.number({
      min: 1,
      max: 10,
    }),
    priceByNight: faker.datatype.number({
      min: 100,
      max: 1000,
    }),
    host: {
      connect: {
        id: faker.datatype.number({
          min: 1,
          max: 100,
        }),
      },
    },
    city: {
      connect: {
        id: faker.datatype.number({
          min: 1,
          max: 100,
        }),
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
    console.log(`Created user with id: ${user.id}`);
  }
  for (const c of cityData) {
    const city = await prisma.city.create({
      data: c,
    });
    console.log(`Created city with id: ${city.id}`);
  }
  for (const p of placeData) {
    const place = await prisma.place.create({
      data: p,
    });
    console.log(`Created place with id: ${place.id}`);
  }
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: "admin",
    },
  });
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
