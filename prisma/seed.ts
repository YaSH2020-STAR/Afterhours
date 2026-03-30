import { PrismaClient } from "@prisma/client";
import { seedDiscoveryDemoData } from "../src/lib/demo-discovery-data";
import { PHOENIX_DEMO_SAMPLES, toPrismaSeedData } from "../src/data/phoenix-demo-samples";

const prisma = new PrismaClient();

const DEMO_DOMAIN = "demo.afterhours.local";

const DEMO_EMAILS = [
  `alex@${DEMO_DOMAIN}`,
  `sam@${DEMO_DOMAIN}`,
  `jordan@${DEMO_DOMAIN}`,
  `riley@${DEMO_DOMAIN}`,
  `casey@${DEMO_DOMAIN}`,
  `morgan@${DEMO_DOMAIN}`,
] as const;

async function removeDemoPodIfExists() {
  const pod = await prisma.pod.findFirst({
    where: { name: "North Loop · Wednesday", city: "Austin, TX" },
  });
  if (!pod) return;

  const seasons = await prisma.season.findMany({ where: { podId: pod.id }, select: { id: true } });
  const seasonIds = seasons.map((s) => s.id);

  if (seasonIds.length) {
    await prisma.seasonEndResponse.deleteMany({ where: { seasonId: { in: seasonIds } } });
  }

  await prisma.message.deleteMany({ where: { podId: pod.id } });
  await prisma.attendance.deleteMany({ where: { podId: pod.id } });
  await prisma.report.deleteMany({ where: { podId: pod.id } });
  await prisma.podMembership.deleteMany({ where: { podId: pod.id } });
  await prisma.season.deleteMany({ where: { podId: pod.id } });
  await prisma.pod.delete({ where: { id: pod.id } });
}

async function seedPods() {
  await removeDemoPodIfExists();

  await prisma.block.deleteMany({
    where: {
      OR: [
        { blocker: { email: { in: [...DEMO_EMAILS] } } },
        { blocked: { email: { in: [...DEMO_EMAILS] } } },
      ],
    },
  });

  await prisma.report.deleteMany({
    where: {
      OR: [
        { reporter: { email: { in: [...DEMO_EMAILS] } } },
        { reported: { email: { in: [...DEMO_EMAILS] } } },
      ],
    },
  });

  await prisma.account.deleteMany({ where: { user: { email: { in: [...DEMO_EMAILS] } } } });
  await prisma.session.deleteMany({ where: { user: { email: { in: [...DEMO_EMAILS] } } } });
  await prisma.user.deleteMany({ where: { email: { in: [...DEMO_EMAILS] } } });

  const bios = [
    "Product designer, learning Austin one coffee shop at a time.",
    "Remote SWE—trying to touch grass on weeknights.",
    "Marketing ops; recently moved from Chicago.",
    "Analyst; introvert-friendly energy.",
    "Nurse on rotating shifts—weekend mornings are sacred.",
    "Grad school + part-time; looking for low-key consistency.",
  ];

  const users = [];
  for (let i = 0; i < DEMO_EMAILS.length; i++) {
    const email = DEMO_EMAILS[i]!;
    const u = await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0]!.replace(/^\w/, (c) => c.toUpperCase()),
        bio: bios[i] ?? "New to town.",
        city: "Austin, TX",
        timezone: "America/Chicago",
        onboardingCompleted: true,
        verified: i === 0,
        preferences: {
          create: {
            availabilityJson: JSON.stringify(["weekday_evenings", "weekend_mornings"]),
            interestsJson: JSON.stringify(
              i % 2 === 0 ? ["reading", "hiking", "film"] : ["running", "cooking", "board games"],
            ),
            energyLevel: i % 3 === 0 ? "LOW" : i % 3 === 1 ? "MEDIUM" : "HIGH",
            groupStyle: "MIXED",
            lifeStagesJson: JSON.stringify(["NEW_TO_CITY", "EARLY_CAREER"]),
            accessibilityNotes: null,
            languagePreference: "English",
          },
        },
      },
    });
    users.push(u);
  }

  const pod = await prisma.pod.create({
    data: {
      name: "North Loop · Wednesday",
      city: "Austin, TX",
      weeklySlotLabel: "Wednesdays · 7:00–8:30 PM",
      timezone: "America/Chicago",
      healthScore: 0.88,
    },
  });

  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 14);
  start.setUTCHours(17, 0, 0, 0);

  const season = await prisma.season.create({
    data: {
      podId: pod.id,
      label: "Winter 2026",
      startDate: start,
      status: "ACTIVE",
    },
  });

  for (const u of users) {
    await prisma.podMembership.create({
      data: { userId: u.id, podId: pod.id },
    });
  }

  const intros = [
    "Hey all—glad we have a steady slot.",
    "Async intro: I’m Sam, remote SWE, usually free weeknights after 6.",
    "Jordan here—prefer walk-and-talks when the weather cooperates.",
  ];

  for (let i = 0; i < intros.length; i++) {
    await prisma.message.create({
      data: {
        podId: pod.id,
        senderId: users[i]!.id,
        body: intros[i]!,
      },
    });
  }

  const weekIndex = 2;
  for (let i = 0; i < users.length; i++) {
    await prisma.attendance.create({
      data: {
        userId: users[i]!.id,
        podId: pod.id,
        weekIndex,
        status: i === 5 ? "NOT_ATTENDING" : "ATTENDING",
      },
    });
  }

  console.log(`Seeded pod "${pod.name}" (${users.length} members), season ${season.id}, week ~${weekIndex}.`);
}

async function seedWaitlist() {
  const demoDomain = "@demo.afterhours.example";
  await prisma.waitlistSubmission.deleteMany({
    where: { email: { endsWith: demoDomain } },
  });

  for (const sample of PHOENIX_DEMO_SAMPLES) {
    await prisma.waitlistSubmission.create({
      data: toPrismaSeedData(sample),
    });
  }

  console.log(`Seeded ${PHOENIX_DEMO_SAMPLES.length} Phoenix waitlist rows (${demoDomain}).`);
}

async function main() {
  await seedPods();
  await seedWaitlist();
  await seedDiscoveryDemoData(prisma);
  console.log("Discovery demo data ensured (Open Tables + Interest Groups).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
