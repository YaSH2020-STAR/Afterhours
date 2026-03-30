import { prisma } from "@/lib/prisma";

/** Ensures a demo user exists (seed optional). Idempotent. */
export async function ensureDemoUser(email: string) {
  const local = email.split("@")[0] ?? "demo";
  const name = local.length ? local[0]!.toUpperCase() + local.slice(1) : "Demo";

  try {
    return await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        onboardingCompleted: true,
        city: "Austin, TX",
        timezone: "America/Chicago",
        bio: "Demo — run npm run setup for seeded pod.",
        preferences: {
          create: {
            availabilityJson: JSON.stringify(["weekday_evenings"]),
            interestsJson: JSON.stringify(["demo"]),
            energyLevel: "MEDIUM",
            groupStyle: "MIXED",
            lifeStagesJson: JSON.stringify(["NEW_TO_CITY"]),
          },
        },
      },
      update: {},
    });
  } catch (e) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing;
    throw e;
  }
}
