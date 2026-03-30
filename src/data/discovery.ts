import type { Prisma } from "@prisma/client";
import { DISCOVERY_CITY } from "@/lib/discovery-constants";
import { ensureDiscoveryDemoData } from "@/lib/demo-discovery-data";
import { formatDistanceMiles, haversineMiles } from "@/lib/geo";
import { prisma } from "@/lib/prisma";

export { DISCOVERY_CITY };

export function parseVibes(vibesJson: string): string[] {
  try {
    const j = JSON.parse(vibesJson) as unknown;
    return Array.isArray(j) ? j.map(String) : [];
  } catch {
    return [];
  }
}

function parseInterests(json: string): string[] {
  try {
    const j = JSON.parse(json) as unknown;
    return Array.isArray(j) ? j.map(String) : [];
  } catch {
    return [];
  }
}

export type VenueForUi = {
  id: string;
  name: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  scheduleLabel: string;
  seatTotal: number;
  reservedCount: number;
  checkedInCount: number;
  vibes: string[];
  hostLabel: string | null;
  distanceLabel: string | null;
  seatsAvailable: number;
  userStatus: string | null;
};

export type GroupForUi = {
  id: string;
  title: string;
  category: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  locationLabel: string;
  startsAt: Date;
  endsAt: Date | null;
  minPeople: number;
  maxPeople: number;
  joinedCount: number;
  waitlistCount: number;
  vibe: string;
  intensity: string;
  description: string | null;
  isPublic: boolean;
  chatEnabled: boolean;
  chatExpiresAt: Date | null;
  spotsLeft: number;
  userStatus: string | null;
  creatorUserId: string | null;
  groupStatus: string;
  /** FIFO position when viewer is on waitlist (1 = next). Set on My Plans / detail when applicable. */
  yourWaitlistPosition?: number | null;
};

function mapGroupRow(
  g: {
    id: string;
    title: string;
    category: string;
    city: string;
    neighborhood: string | null;
    address: string | null;
    locationLabel: string;
    startsAt: Date;
    endsAt: Date | null;
    minPeople: number;
    maxPeople: number;
    joinedCount: number;
    waitlistCount: number;
    vibe: string;
    intensity: string;
    description: string | null;
    isPublic: boolean;
    chatEnabled: boolean;
    chatExpiresAt: Date | null;
    creatorUserId: string | null;
    groupStatus: string;
  },
  groupMap: Record<string, string>,
): GroupForUi {
  return {
    id: g.id,
    title: g.title,
    category: g.category,
    city: g.city,
    neighborhood: g.neighborhood,
    address: g.address,
    locationLabel: g.locationLabel,
    startsAt: g.startsAt,
    endsAt: g.endsAt,
    minPeople: g.minPeople,
    maxPeople: g.maxPeople,
    joinedCount: g.joinedCount,
    waitlistCount: g.waitlistCount,
    vibe: g.vibe,
    intensity: g.intensity,
    description: g.description,
    isPublic: g.isPublic,
    chatEnabled: g.chatEnabled,
    chatExpiresAt: g.chatExpiresAt,
    spotsLeft: Math.max(0, g.maxPeople - g.joinedCount),
    userStatus: groupMap[g.id] ?? null,
    creatorUserId: g.creatorUserId,
    groupStatus: g.groupStatus,
  };
}

/** 1-based FIFO position on the waitlist (matches promotion order). */
export async function waitlistFifoPosition(groupId: string, joinedAt: Date): Promise<number> {
  const earlier = await prisma.groupJoin.count({
    where: {
      groupId,
      status: "WAITLIST",
      joinedAt: { lt: joinedAt },
    },
  });
  return earlier + 1;
}

/** Local calendar day — used for “tonight” sections */
export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type DiscoveryUserWithPrefs = Prisma.UserGetPayload<{ include: { preferences: true } }>;

/** Saved device coordinates — distances use these with venue lat/lng via haversine. */
export type DiscoveryViewerLocation = { lat: number; lng: number };

export type DiscoveryContextData = {
  user: DiscoveryUserWithPrefs;
  displayCity: string;
  viewerLocation: DiscoveryViewerLocation | null;
  venues: VenueForUi[];
  groups: GroupForUi[];
  interests: string[];
  happeningTonight: GroupForUi[];
  joinedPlans: GroupForUi[];
  createdPlans: GroupForUi[];
};

function emptyDiscoveryContext(user: DiscoveryUserWithPrefs): DiscoveryContextData {
  const interests = user.preferences ? parseInterests(user.preferences.interestsJson) : [];
  return {
    user,
    displayCity: user.city ?? DISCOVERY_CITY,
    viewerLocation:
      user.latitude != null && user.longitude != null
        ? { lat: user.latitude, lng: user.longitude }
        : null,
    venues: [] as VenueForUi[],
    groups: [] as GroupForUi[],
    interests,
    happeningTonight: [] as GroupForUi[],
    joinedPlans: [] as GroupForUi[],
    createdPlans: [] as GroupForUi[],
  };
}

function discoveryDelegatesReady(): boolean {
  return (
    typeof prisma.openTableVenue?.findMany === "function" &&
    typeof prisma.interestGroup?.findMany === "function"
  );
}

export async function getDiscoveryContext(userId: string): Promise<DiscoveryContextData | null> {
  await ensureDiscoveryDemoData(prisma);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });
  if (!user) return null;

  if (!discoveryDelegatesReady()) {
    console.warn(
      "[afterhours] Prisma client missing openTableVenue or interestGroup. Run: npx prisma generate && npx prisma db push",
    );
    return emptyDiscoveryContext(user);
  }

  try {
    const [venues, groups, venueRsvps, groupJoins] = await Promise.all([
      prisma.openTableVenue.findMany({
        where: { city: DISCOVERY_CITY, venueStatus: "active" },
        orderBy: { name: "asc" },
      }),
      prisma.interestGroup.findMany({
        where: {
          city: DISCOVERY_CITY,
          isPublic: true,
          groupStatus: { in: ["open", "full"] },
        },
        orderBy: { startsAt: "asc" },
      }),
      prisma.venueRSVP.findMany({ where: { userId } }),
      prisma.groupJoin.findMany({ where: { userId } }),
    ]);

    const venueMap = Object.fromEntries(venueRsvps.map((r) => [r.venueId, r.status]));
    const groupMap = Object.fromEntries(groupJoins.map((j) => [j.groupId, j.status]));

    const displayCity = user.city ?? DISCOVERY_CITY;

    const viewerLocation =
      user.latitude != null && user.longitude != null
        ? { lat: user.latitude, lng: user.longitude }
        : null;

    const venueRows = venues.map((v) => {
      const seatsAvailable = Math.max(0, v.seatTotal - v.reservedCount - v.checkedInCount);
      let miles: number | null = null;
      if (
        user.latitude != null &&
        user.longitude != null &&
        v.latitude != null &&
        v.longitude != null
      ) {
        miles = haversineMiles(user.latitude, user.longitude, v.latitude, v.longitude);
      }
      const distanceLabel = miles != null ? `${formatDistanceMiles(miles)} mi` : null;

      return {
        ui: {
          id: v.id,
          name: v.name,
          city: v.city,
          neighborhood: v.neighborhood,
          address: v.address,
          scheduleLabel: v.scheduleLabel,
          seatTotal: v.seatTotal,
          reservedCount: v.reservedCount,
          checkedInCount: v.checkedInCount,
          vibes: parseVibes(v.vibesJson),
          hostLabel: v.hostLabel,
          distanceLabel,
          seatsAvailable,
          userStatus: venueMap[v.id] ?? null,
        } satisfies VenueForUi,
        miles,
      };
    });

    venueRows.sort((a, b) => {
      if (a.miles != null && b.miles != null) return a.miles - b.miles;
      if (a.miles != null) return -1;
      if (b.miles != null) return 1;
      return a.ui.name.localeCompare(b.ui.name);
    });

    const venuesUi: VenueForUi[] = venueRows.map((r) => r.ui);

    const groupsUi: GroupForUi[] = groups.map((g) => mapGroupRow(g, groupMap));

    const interests = user.preferences ? parseInterests(user.preferences.interestsJson) : [];

    const now = new Date();
    const happeningTonight = groupsUi.filter((g) => isSameLocalDay(g.startsAt, now));
    const joinedPlans = groupsUi.filter((g) => {
      const s = groupMap[g.id];
      return Boolean(s);
    });
    const createdPlans = groupsUi.filter((g) => g.creatorUserId === userId);

    return {
      user,
      displayCity,
      viewerLocation,
      venues: venuesUi,
      groups: groupsUi,
      interests,
      happeningTonight,
      joinedPlans,
      createdPlans,
    };
  } catch (e) {
    console.error("[afterhours] getDiscoveryContext failed:", e);
    return emptyDiscoveryContext(user);
  }
}

export async function getGroupDetail(userId: string, groupId: string) {
  await ensureDiscoveryDemoData(prisma);

  if (typeof prisma.interestGroup?.findUnique !== "function") {
    console.warn("[afterhours] Prisma client missing interestGroup. Run: npx prisma generate && npx prisma db push");
    return null;
  }

  try {
    const group = await prisma.interestGroup.findUnique({
      where: { id: groupId },
    });
    if (!group) return null;

    const join = await prisma.groupJoin.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });

    const messages = await prisma.discoveryGroupMessage.findMany({
      where: { groupId },
      orderBy: { createdAt: "asc" },
      take: 80,
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    const now = new Date();
    const chatOpen = Boolean(
      group.chatEnabled &&
        join &&
        join.status !== "WAITLIST" &&
        (!group.chatExpiresAt || group.chatExpiresAt > now),
    );

    let waitlistPosition: number | null = null;
    if (join?.status === "WAITLIST") {
      waitlistPosition = await waitlistFifoPosition(groupId, join.joinedAt);
    }

    return {
      group: {
        ...group,
        spotsLeft: Math.max(0, group.maxPeople - group.joinedCount),
      },
      join,
      messages,
      chatOpen,
      waitlistPosition,
    };
  } catch (e) {
    console.error("[afterhours] getGroupDetail failed:", e);
    return null;
  }
}

/** All groups the user joined or created (includes cancelled for history). */
export async function getMyPlansContext(userId: string) {
  await ensureDiscoveryDemoData(prisma);

  if (typeof prisma.interestGroup?.findMany !== "function") {
    console.warn("[afterhours] Prisma client missing interestGroup. Run: npx prisma generate && npx prisma db push");
    return {
      joined: [] as GroupForUi[],
      created: [] as GroupForUi[],
      summary: {
        hostingCount: 0,
        goingCount: 0,
        waitlistCount: 0,
        interestedCount: 0,
      },
    };
  }

  try {
    const [joins, created] = await Promise.all([
      prisma.groupJoin.findMany({
        where: { userId },
        include: { group: true },
        orderBy: { joinedAt: "desc" },
      }),
      prisma.interestGroup.findMany({
        where: { creatorUserId: userId },
        orderBy: { startsAt: "asc" },
      }),
    ]);

    const statusByGroup: Record<string, string> = {};
    for (const j of joins) {
      statusByGroup[j.groupId] = j.status;
    }

    const waitlistPositions = await Promise.all(
      joins
        .filter((j) => j.status === "WAITLIST")
        .map(async (j) => {
          const pos = await waitlistFifoPosition(j.groupId, j.joinedAt);
          return [j.groupId, pos] as const;
        }),
    );
    const posByGroupId = Object.fromEntries(waitlistPositions) as Record<string, number>;

    const joinedUi: GroupForUi[] = joins.map((j) => {
      const base = mapGroupRow(j.group, statusByGroup);
      if (j.status === "WAITLIST") {
        return { ...base, yourWaitlistPosition: posByGroupId[j.groupId] ?? 1 };
      }
      return base;
    });
    const createdUi = created.map((g) => mapGroupRow(g, statusByGroup));

    const hostingCount = created.length;
    const goingCount = joins.filter(
      (j) =>
        ["JOINED", "HEADING", "CHECKED_IN"].includes(j.status) && j.group.creatorUserId !== userId,
    ).length;
    const waitlistCount = joins.filter((j) => j.status === "WAITLIST").length;
    const interestedCount = joins.filter((j) => j.status === "INTERESTED").length;

    return {
      joined: joinedUi,
      created: createdUi,
      summary: {
        hostingCount,
        goingCount,
        waitlistCount,
        interestedCount,
      },
    };
  } catch (e) {
    console.error("[afterhours] getMyPlansContext failed:", e);
    return {
      joined: [] as GroupForUi[],
      created: [] as GroupForUi[],
      summary: {
        hostingCount: 0,
        goingCount: 0,
        waitlistCount: 0,
        interestedCount: 0,
      },
    };
  }
}
