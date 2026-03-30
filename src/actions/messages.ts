"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canDirectMessage, getSeasonWeekIndex } from "@/lib/season-week";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  podId: z.string(),
  body: z.string().min(1).max(4000),
  recipientId: z.string().optional(),
});

export async function sendPodMessage(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid message." };

  const { podId, body, recipientId } = parsed.data;

  const membership = await prisma.podMembership.findFirst({
    where: { userId: session.user.id, podId },
  });
  if (!membership) return { ok: false as const, error: "Not in this pod." };

  const season = await prisma.season.findFirst({
    where: { podId, status: "ACTIVE" },
    orderBy: { startDate: "desc" },
  });
  if (!season) return { ok: false as const, error: "No active season." };

  const weekIndex = getSeasonWeekIndex(season.startDate);

  if (recipientId) {
    if (!canDirectMessage(weekIndex)) {
      return { ok: false as const, error: "1:1 chat unlocks after week 3." };
    }
    if (recipientId === session.user.id) {
      return { ok: false as const, error: "Pick someone else." };
    }
    const otherMember = await prisma.podMembership.findFirst({
      where: { podId, userId: recipientId },
    });
    if (!otherMember) return { ok: false as const, error: "Recipient not in pod." };

    const blocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: session.user.id, blockedId: recipientId },
          { blockerId: recipientId, blockedId: session.user.id },
        ],
      },
    });
    if (blocked) return { ok: false as const, error: "Messaging unavailable." };
  }

  await prisma.message.create({
    data: {
      podId,
      senderId: session.user.id,
      recipientId: recipientId ?? null,
      body,
    },
  });

  revalidatePath(`/pod/${podId}`);
  return { ok: true as const };
}
