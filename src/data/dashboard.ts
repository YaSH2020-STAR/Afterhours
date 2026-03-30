import { prisma } from "@/lib/prisma";
import { getSeasonWeekIndex } from "@/lib/season-week";
import { pickRitualSuggestion } from "@/lib/rituals";
import { podHealthPercent } from "@/lib/pod-health";

export async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          pod: {
            include: {
              seasons: { where: { status: "ACTIVE" }, orderBy: { startDate: "desc" }, take: 1 },
              memberships: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      bio: true,
                      image: true,
                      verified: true,
                      preferences: { select: { interestsJson: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const membership = user.memberships[0];
  if (!membership) {
    return {
      user,
      pod: null as null,
      season: null as null,
      weekIndex: 0,
      ritual: null as null,
      nextMeetingLabel: null as null,
    };
  }

  const pod = membership.pod;
  const season = pod.seasons[0] ?? null;
  const weekIndex = season ? getSeasonWeekIndex(season.startDate) : 0;
  const ritual = season ? pickRitualSuggestion(pod.id, weekIndex) : null;

  const attendanceRows = season
    ? await prisma.attendance.findMany({
        where: { podId: pod.id, weekIndex },
      })
    : [];

  const attending = attendanceRows.filter((a) => a.status === "ATTENDING").length;
  const total = pod.memberships.length || 1;
  const ratio = attending / total;
  const health = podHealthPercent(pod.healthScore, ratio);

  const endResponse = season
    ? await prisma.seasonEndResponse.findUnique({
        where: {
          userId_seasonId: { userId, seasonId: season.id },
        },
      })
    : null;

  return {
    user,
    pod,
    season,
    weekIndex,
    ritual,
    nextMeetingLabel: pod.weeklySlotLabel,
    podHealth: health,
    memberCount: pod.memberships.length,
    seasonEndChoice: endResponse?.choice ?? null,
  };
}
