import { PrismaClient } from "@prisma/client";
import { PHOENIX_DEMO_SAMPLES, toPrismaSeedData } from "../src/data/phoenix-demo-samples";

const prisma = new PrismaClient();

async function main() {
  const demoDomain = "@demo.afterhours.example";
  await prisma.waitlistSubmission.deleteMany({
    where: { email: { endsWith: demoDomain } },
  });

  for (const sample of PHOENIX_DEMO_SAMPLES) {
    await prisma.waitlistSubmission.create({
      data: toPrismaSeedData(sample),
    });
  }

  console.log(`Seeded ${PHOENIX_DEMO_SAMPLES.length} Phoenix demo waitlist rows (${demoDomain}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
