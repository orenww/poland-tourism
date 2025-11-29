import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        key: 'locations',
        icon: 'map-pin',
      },
    }),
    prisma.category.create({
      data: {
        key: 'attractions',
        icon: 'compass',
      },
    }),
    prisma.category.create({
      data: {
        key: 'routes',
        icon: 'route',
      },
    }),
  ]);

  console.log('Seeded categories:', categories);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
