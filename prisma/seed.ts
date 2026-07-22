import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const CATEGORIES = [
  "Beach",
  "Mountain",
  "City",
  "Countryside",
  "Luxury",
  "Tropical",
  "Lakefront",
  "Ski",
  "Desert",
  "Historic",
];

const ALL_AMENITIES = [
  "WiFi",
  "Kitchen",
  "Parking",
  "Pool",
  "Air conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "TV",
  "Iron",
  "Workspace",
  "Hot tub",
  "BBQ grill",
  "Gym",
  "Elevator",
  "Fireplace",
  "Garden",
  "Balcony",
  "Beach access",
  "Mountain view",
  "Lake view",
  "City view",
  "Pet friendly",
  "Smoke alarm",
  "First aid kit",
  "Fire extinguisher",
];

function randomAmenities(): string[] {
  const count = faker.number.int({ min: 4, max: 12 });
  const shuffled = [...ALL_AMENITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomImages(): string[] {
  return Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).map(() =>
    faker.image.url({ width: 800, height: 600 }),
  );
}

const userData: Prisma.UserCreateInput[] = Array.from({ length: 100 }).map(
  (_, id) => ({
    user_id: id,
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence({ min: 5, max: 15 }),
  }),
);

const cityData: Prisma.CityCreateInput[] = Array.from({ length: 100 }).map(
  (_, id) => ({
    city_id: id,
    name: faker.location.city(),
  }),
);

const placeData: Prisma.PlaceCreateInput[] = Array.from({ length: 100 }).map(
  (_, ide) => ({
    place_id: ide,
    name: `${faker.company.catchPhraseAdjective()} ${faker.company.catchPhraseNoun()}`,
    description: faker.lorem.paragraphs({ min: 2, max: 4 }),
    image: faker.image.url({ width: 800, height: 600 }),
    images: randomImages(),
    amenities: randomAmenities(),
    category:
      CATEGORIES[faker.number.int({ min: 0, max: CATEGORIES.length - 1 })],
    numberOfRooms: faker.number.int({ min: 1, max: 10 }),
    numberOfBathrooms: faker.number.int({ min: 1, max: 3 }),
    maxGuests: faker.number.int({ min: 1, max: 10 }),
    priceByNight: faker.number.int({ min: 50, max: 800 }),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
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
  }),
);

const REVIEW_COMMENTS = [
  "Amazing place! Exactly as described. Would definitely come back.",
  "Great location and very clean. The host was super responsive.",
  "Beautiful views and very comfortable beds. Highly recommend!",
  "Perfect for a weekend getaway. Everything was spotless.",
  "The kitchen was well-equipped and the neighborhood was quiet.",
  "Loved the decor and the attention to detail. 5 stars!",
  "Very spacious and modern. Close to restaurants and shops.",
  "The pool was a nice bonus. Kids loved it!",
  "Cozy and charming. Felt like home away from home.",
  "Good value for the price. Would stay again.",
  "Nice place but a bit noisy at night due to the street.",
  "The check-in process was seamless. Great communication.",
  "Stunning apartment with all the amenities you need.",
  "The balcony view was breathtaking. Unforgettable experience.",
  "Clean, comfortable, and well-located. What more could you ask for?",
  "The host went above and beyond to make our stay special.",
  "A hidden gem! Quiet area but close to everything.",
  "Modern design with a cozy feel. Loved every minute.",
  "Perfect for remote work. Fast WiFi and a great workspace.",
  "The garden was beautiful. We enjoyed morning coffee there.",
];

async function main() {
  console.log(`Start seeding ...`);

  await prisma.review.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.user.deleteMany({});

  for (const u of userData) {
    const user = await prisma.user.create({ data: u });
    console.log(`Created user with id: ${user.user_id}`);
  }

  for (const c of cityData) {
    const city = await prisma.city.create({ data: c });
    console.log(`Created city with id: ${city.city_id}`);
  }

  for (const p of placeData) {
    try {
      const place = await prisma.place.create({ data: p });
      console.log(`Created place with id: ${place.place_id}`);
    } catch {
      console.error("Fail to create place");
    }
  }

  let reviewId = 0;
  for (let placeId = 0; placeId < 100; placeId++) {
    const reviewCount = faker.number.int({ min: 2, max: 8 });
    for (let r = 0; r < reviewCount; r++) {
      try {
        await prisma.review.create({
          data: {
            review_id: reviewId++,
            rating: faker.number.int({ min: 3, max: 5 }),
            comment:
              REVIEW_COMMENTS[
                faker.number.int({ min: 0, max: REVIEW_COMMENTS.length - 1 })
              ],
            user: {
              connect: { user_id: faker.number.int({ min: 1, max: 99 }) },
            },
            place: { connect: { place_id: placeId } },
          },
        });
      } catch {
        console.error(`Failed to create review for place ${placeId}`);
      }
    }
  }
  console.log(`Created ${reviewId} reviews`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  });
