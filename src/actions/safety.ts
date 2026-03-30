"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reportSchema = z.object({
  reportedUserId: z.string(),
  podId: z.string().optional(),
  reason: z.string().min(8).max(4000),
});

export async function submitReport(input: z.infer<typeof reportSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check your report." };

  if (parsed.data.reportedUserId === session.user.id) {
    return { ok: false as const, error: "Invalid report." };
  }

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      reportedUserId: parsed.data.reportedUserId,
      podId: parsed.data.podId,
      reason: parsed.data.reason,
    },
  });

  if (parsed.data.podId) revalidatePath(`/pod/${parsed.data.podId}`);
  return { ok: true as const };
}

const blockSchema = z.object({
  blockedUserId: z.string(),
});

export async function blockUser(input: z.infer<typeof blockSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = blockSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid." };

  if (parsed.data.blockedUserId === session.user.id) {
    return { ok: false as const, error: "Invalid." };
  }

  await prisma.block.upsert({
    where: {
      blockerId_blockedId: {
        blockerId: session.user.id,
        blockedId: parsed.data.blockedUserId,
      },
    },
    create: {
      blockerId: session.user.id,
      blockedId: parsed.data.blockedUserId,
    },
    update: {},
  });

  revalidatePath("/settings");
  return { ok: true as const };
}
