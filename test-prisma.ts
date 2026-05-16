import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const places = await prisma.place.findMany({ take: 1 });
    console.log('SUCCESS:', places.length);
  } catch (e: any) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
