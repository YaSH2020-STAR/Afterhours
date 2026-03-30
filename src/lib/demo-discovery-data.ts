import type { PrismaClient } from "@prisma/client";
import { DISCOVERY_CITY } from "@/lib/discovery-constants";

/** Stable IDs so we can upsert without wiping user RSVPs / joins */
export const DEMO_OPEN_TABLE_IDS = {
  groundwork: "demo_ot_groundwork",
  copperBean: "demo_ot_copper_bean",
  desertBookhouse: "demo_ot_desert_bookhouse",
  valleyWine: "demo_ot_valley_wine",
  boardGameBarn: "demo_ot_board_game_barn",
} as const;

export const DEMO_GROUP_IDS = {
  hiking: "demo_grp_hiking",
  pickleball: "demo_grp_pickleball",
  movie: "demo_grp_movie",
  coffee: "demo_grp_coffee",
  brunch: "demo_grp_brunch",
  run: "demo_grp_run",
} as const;

const DEMO_DOMAIN = "demo.afterhours.local";

function atDaysFromNow(days: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function chatUntil(starts: Date): Date {
  return new Date(starts.getTime() + 4 * 60 * 60 * 1000);
}

const VENUES: Array<{
  id: string;
  name: string;
  neighborhood: string | null;
  address: string;
  scheduleLabel: string;
  seatTotal: number;
  reservedCount: number;
  checkedInCount: number;
  vibesJson: string;
  hostLabel: string;
  /** Approximate WGS84 — used with the viewer’s saved location for real distance (not a static label). */
  latitude: number;
  longitude: number;
}> = [
  {
    id: DEMO_OPEN_TABLE_IDS.groundwork,
    name: "Groundwork Coffee",
    neighborhood: "Roosevelt Row",
    address: "123 N 3rd St",
    scheduleLabel: "Tue & Thu · 6–8 PM",
    seatTotal: 8,
    reservedCount: 3,
    checkedInCount: 5,
    vibesJson: JSON.stringify(["casual chat", "coffee"]),
    hostLabel: "Open Table partner",
    latitude: 33.4484,
    longitude: -112.0738,
  },
  {
    id: DEMO_OPEN_TABLE_IDS.copperBean,
    name: "Copper Bean Cowork",
    neighborhood: "Scottsdale Quarter",
    address: "4566 N 75th St",
    scheduleLabel: "Wed · 7–9 PM",
    seatTotal: 10,
    reservedCount: 6,
    checkedInCount: 4,
    vibesJson: JSON.stringify(["coworking", "networking-lite"]),
    hostLabel: "Community hours",
    latitude: 33.5792,
    longitude: -111.922,
  },
  {
    id: DEMO_OPEN_TABLE_IDS.desertBookhouse,
    name: "Desert Bookhouse",
    neighborhood: "Arcadia",
    address: "3920 E Camelback Rd",
    scheduleLabel: "Fri · 6–8 PM",
    seatTotal: 6,
    reservedCount: 3,
    checkedInCount: 3,
    vibesJson: JSON.stringify(["books", "quiet social"]),
    hostLabel: "Local favorite",
    latitude: 33.4954,
    longitude: -111.9893,
  },
  {
    id: DEMO_OPEN_TABLE_IDS.valleyWine,
    name: "Valley Wine Garden",
    neighborhood: "Old Town Scottsdale",
    address: "7118 E 5th Ave",
    scheduleLabel: "Fri & Sat · 5–9 PM",
    seatTotal: 12,
    reservedCount: 5,
    checkedInCount: 4,
    vibesJson: JSON.stringify(["wine", "conversation", "low-key"]),
    hostLabel: "Partner patio",
    latitude: 33.4942,
    longitude: -111.9261,
  },
  {
    id: DEMO_OPEN_TABLE_IDS.boardGameBarn,
    name: "Board Game Barn",
    neighborhood: "Chandler",
    address: "290 S Arizona Ave",
    scheduleLabel: "Sun · 2–6 PM",
    seatTotal: 14,
    reservedCount: 7,
    checkedInCount: 5,
    vibesJson: JSON.stringify(["board games", "snacks", "beginners welcome"]),
    hostLabel: "Table host on-site",
    latitude: 33.3062,
    longitude: -111.8414,
  },
];

type GroupSeed = {
  id: string;
  title: string;
  category: string;
  neighborhood: string | null;
  locationLabel: string;
  daysFromNow: number;
  hour: number;
  minute: number;
  minPeople: number;
  maxPeople: number;
  joinedCount: number;
  waitlistCount: number;
  vibe: string;
  intensity: string;
  description: string;
};

const GROUPS: GroupSeed[] = [
  {
    id: DEMO_GROUP_IDS.hiking,
    title: "Hiking at Camelback",
    category: "hiking",
    neighborhood: "Paradise Valley",
    locationLabel: "Echo Canyon Trailhead",
    daysFromNow: 2,
    hour: 7,
    minute: 0,
    minPeople: 3,
    maxPeople: 6,
    joinedCount: 4,
    waitlistCount: 0,
    vibe: "active",
    intensity: "active",
    description: "Early summit, coffee after if we’re feeling it. Steady pace, no sprinting the stairs.",
  },
  {
    id: DEMO_GROUP_IDS.pickleball,
    title: "Pickleball After Work",
    category: "sports",
    neighborhood: "Tempe",
    locationLabel: "Kiwanis Recreation Center",
    daysFromNow: 1,
    hour: 18,
    minute: 30,
    minPeople: 2,
    maxPeople: 8,
    joinedCount: 5,
    waitlistCount: 0,
    vibe: "social",
    intensity: "active",
    description: "Bring water—we’ll rotate courts and keep it friendly-competitive.",
  },
  {
    id: DEMO_GROUP_IDS.movie,
    title: "Movie Night Friday",
    category: "movies",
    neighborhood: "Central Phoenix",
    locationLabel: "AMC Esplanade 14",
    daysFromNow: 3,
    hour: 20,
    minute: 0,
    minPeople: 2,
    maxPeople: 8,
    joinedCount: 6,
    waitlistCount: 0,
    vibe: "casual",
    intensity: "casual",
    description: "Vote on showtime in chat—something new + debrief after nearby.",
  },
  {
    id: DEMO_GROUP_IDS.coffee,
    title: "Coffee + Startup Talk",
    category: "coffee",
    neighborhood: "Downtown",
    locationLabel: "Cartel Roasting Co.",
    daysFromNow: 1,
    hour: 19,
    minute: 0,
    minPeople: 2,
    maxPeople: 5,
    joinedCount: 3,
    waitlistCount: 0,
    vibe: "networking-lite",
    intensity: "social",
    description: "Small table, big ideas—no pitch decks, just honest shop talk.",
  },
  {
    id: DEMO_GROUP_IDS.brunch,
    title: "Sunday Patio Brunch",
    category: "food",
    neighborhood: "Arcadia",
    locationLabel: "The Henry · patio",
    daysFromNow: 4,
    hour: 10,
    minute: 30,
    minPeople: 4,
    maxPeople: 6,
    joinedCount: 6,
    waitlistCount: 2,
    vibe: "social",
    intensity: "casual",
    description: "Mimosas optional—mostly good food and easy conversation.",
  },
  {
    id: DEMO_GROUP_IDS.run,
    title: "Easy 5K Loop",
    category: "sports",
    neighborhood: "Tempe Town Lake",
    locationLabel: "North shore path · Mill Ave bridge",
    daysFromNow: 2,
    hour: 6,
    minute: 45,
    minPeople: 3,
    maxPeople: 10,
    joinedCount: 7,
    waitlistCount: 0,
    vibe: "active",
    intensity: "casual",
    description: "No pace shaming—walk breaks welcome. Headlamps if we start in the dark.",
  },
];

async function upsertVenues(prisma: PrismaClient) {
  for (const v of VENUES) {
    await prisma.openTableVenue.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        name: v.name,
        city: DISCOVERY_CITY,
        neighborhood: v.neighborhood,
        address: v.address,
        scheduleLabel: v.scheduleLabel,
        seatTotal: v.seatTotal,
        reservedCount: v.reservedCount,
        checkedInCount: v.checkedInCount,
        vibesJson: v.vibesJson,
        hostLabel: v.hostLabel,
        latitude: v.latitude,
        longitude: v.longitude,
        distanceLabel: null,
      },
      update: {
        latitude: v.latitude,
        longitude: v.longitude,
        distanceLabel: null,
      },
    });
  }
}

function groupCreateData(g: GroupSeed, startsAt: Date) {
  return {
    id: g.id,
    title: g.title,
    category: g.category,
    city: DISCOVERY_CITY,
    neighborhood: g.neighborhood,
    locationLabel: g.locationLabel,
    startsAt,
    minPeople: g.minPeople,
    maxPeople: g.maxPeople,
    joinedCount: g.joinedCount,
    waitlistCount: g.waitlistCount,
    vibe: g.vibe,
    intensity: g.intensity,
    description: g.description,
    isPublic: true,
    chatEnabled: true,
    chatExpiresAt: chatUntil(startsAt),
  };
}

async function upsertGroups(prisma: PrismaClient) {
  for (const g of GROUPS) {
    const startsAt = atDaysFromNow(g.daysFromNow, g.hour, g.minute);
    await prisma.interestGroup.upsert({
      where: { id: g.id },
      create: groupCreateData(g, startsAt),
      update: {},
    });
  }
}

/** If no Phoenix groups are still upcoming, roll demo schedules forward (e.g. old fixed dates from a prior seed). */
async function refreshStaleGroupDates(prisma: PrismaClient) {
  const now = new Date();

  const anyFuture = await prisma.interestGroup.count({
    where: { city: DISCOVERY_CITY, startsAt: { gte: now } },
  });

  if (anyFuture > 0) return;

  for (const g of GROUPS) {
    const startsAt = atDaysFromNow(g.daysFromNow, g.hour, g.minute);
    await prisma.interestGroup.update({
      where: { id: g.id },
      data: {
        startsAt,
        chatExpiresAt: chatUntil(startsAt),
      },
    });
  }
}

async function ensureDemoHikingMessage(prisma: PrismaClient) {
  const alex = await prisma.user.findFirst({
    where: { email: `alex@${DEMO_DOMAIN}` },
    select: { id: true },
  });
  if (!alex) return;

  const existing = await prisma.discoveryGroupMessage.findFirst({
    where: {
      groupId: DEMO_GROUP_IDS.hiking,
      senderId: alex.id,
    },
  });
  if (existing) return;

  await prisma.discoveryGroupMessage.create({
    data: {
      groupId: DEMO_GROUP_IDS.hiking,
      senderId: alex.id,
      body: "Bringing an extra water bottle if anyone forgets—see you at the trailhead.",
    },
  });
}

/**
 * When true (default in development), discovery requests may upsert demo venues/groups.
 * In production, default is false — run `npm run db:seed` or set AFTERHOURS_AUTO_SEED_DISCOVERY=true.
 */
export function shouldAutoSeedDiscovery(): boolean {
  const v = process.env.AFTERHOURS_AUTO_SEED_DISCOVERY?.trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return process.env.NODE_ENV !== "production";
}

/**
 * Idempotent: creates Phoenix Open Tables + Interest Groups when missing.
 * Refreshes group datetimes when nothing is upcoming (so the UI never looks “dead”).
 * Used by `npm run db:seed` and by optional auto-seed in non-production.
 *
 * Never throws: failures are logged so dashboard boot is not blocked by seed/demo logic.
 */
export async function seedDiscoveryDemoData(prisma: PrismaClient): Promise<void> {
  try {
    const ot = prisma.openTableVenue as { upsert?: unknown } | undefined;
    const ig = prisma.interestGroup as { upsert?: unknown } | undefined;
    if (typeof ot?.upsert !== "function" || typeof ig?.upsert !== "function") {
      console.warn(
        "[afterhours] Prisma client missing discovery delegates (openTableVenue / interestGroup). Run: npx prisma generate && npx prisma db push",
      );
      return;
    }
    await upsertVenues(prisma);
    await upsertGroups(prisma);
    await refreshStaleGroupDates(prisma);
    await ensureDemoHikingMessage(prisma);
  } catch (e) {
    console.error("[afterhours] seedDiscoveryDemoData failed:", e);
  }
}

/** Runs seed only when `shouldAutoSeedDiscovery()` allows (e.g. dev). Production uses DB from migrations/seed. */
export async function ensureDiscoveryDemoData(prisma: PrismaClient): Promise<void> {
  if (!shouldAutoSeedDiscovery()) return;
  await seedDiscoveryDemoData(prisma);
}
