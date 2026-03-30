import { prisma } from "@/lib/prisma";
import { getSeasonWeekIndex, canDirectMessage, SEASON_WEEK_LABELS, weekPhaseDescription } from "@/lib/season-week";
import { pickRitualSuggestion, conversationStarters } from "@/lib/rituals";
import { podHealthPercent } from "@/lib/pod-health";

export async function getPodPageData(userId: string, podId: string) {
  const membership = await prisma.podMembership.findFirst({
    where: { userId, podId },
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
                  email: true,
                  bio: true,
                  image: true,
                  verified: true,
                  preferences: { select: { interestsJson: true, energyLevel: true, groupStyle: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!membership) return null;

  const pod = membership.pod;
  const season = pod.seasons[0] ?? null;
  const weekIndex = season ? getSeasonWeekIndex(season.startDate) : 0;
  const dmUnlocked = canDirectMessage(weekIndex);
  const ritual = season ? pickRitualSuggestion(pod.id, weekIndex) : null;

  const blocks = await prisma.block.findMany({
    where: {
      OR: [
        { blockerId: userId },
        { blockedId: userId },
      ],
    },
  });
  const blockedIds = new Set<string>();
  for (const b of blocks) {
    if (b.blockerId === userId) blockedIds.add(b.blockedId);
    if (b.blockedId === userId) blockedIds.add(b.blockerId);
  }

  const rawMessages = await prisma.message.findMany({
    where: { podId },
    orderBy: { createdAt: "asc" },
    take: 120,
    include: {
      sender: { select: { id: true, name: true, image: true } },
      recipient: { select: { id: true, name: true } },
    },
  });

  const messages = rawMessages.filter((msg) => {
    if (!msg.recipientId) return true;
    if (msg.senderId !== userId && msg.recipientId !== userId) return false;
    if (blockedIds.has(msg.senderId) || (msg.recipientId && blockedIds.has(msg.recipientId))) return false;
    return true;
  });

  const attendanceRows = season
    ? await prisma.attendance.findMany({
        where: { podId, weekIndex },
      })
    : [];
  const mine = attendanceRows.find((a) => a.userId === userId);
  const attending = attendanceRows.filter((a) => a.status === "ATTENDING").length;
  const total = pod.memberships.length || 1;
  const health = podHealthPercent(pod.healthScore, attending / total);

  const seasonEnd = season
    ? await prisma.seasonEndResponse.findUnique({
        where: { userId_seasonId: { userId, seasonId: season.id } },
      })
    : null;

  return {
    pod,
    season,
    weekIndex,
    weekLabel: SEASON_WEEK_LABELS[weekIndex] ?? SEASON_WEEK_LABELS[0],
    phaseCopy: weekPhaseDescription(weekIndex),
    dmUnlocked,
    ritual,
    starters: conversationStarters(),
    members: pod.memberships.map((m) => m.user),
    messages,
    attendance: { mine, attending, total, weekIndex },
    health,
    seasonEndChoice: seasonEnd?.choice ?? null,
  };
}
