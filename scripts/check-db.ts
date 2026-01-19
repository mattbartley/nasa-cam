import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const photoCount = await prisma.photo.count();
  const cameraCount = await prisma.camera.count();

  console.log(`Total photos: ${photoCount}`);
  console.log(`Total cameras: ${cameraCount}`);

  const solStats = await prisma.photo.groupBy({
    by: ["sol"],
    _count: { id: true },
    orderBy: { sol: "asc" },
    take: 20,
  });

  console.log("\nPhotos per sol:");
  for (const stat of solStats) {
    console.log(`  Sol ${stat.sol}: ${stat._count.id} photos`);
  }

  // Sample photo
  const sample = await prisma.photo.findFirst({
    include: { camera: true },
  });

  if (sample) {
    console.log("\nSample photo:");
    console.log(`  ID: ${sample.id}`);
    console.log(`  Sol: ${sample.sol}`);
    console.log(`  Camera: ${sample.camera.name}`);
    console.log(`  Image: ${sample.imgSrc.substring(0, 80)}...`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
