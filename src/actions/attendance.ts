"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  podId: z.string(),
  weekIndex: z.number().int().min(0).max(6),
  status: z.enum(["ATTENDING", "NOT_ATTENDING"]),
});

export async function setAttendance(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input." };

  const member = await prisma.podMembership.findFirst({
    where: { userId: session.user.id, podId: parsed.data.podId },
  });
  if (!member) return { ok: false as const, error: "Not in this pod." };

  await prisma.attendance.upsert({
    where: {
      userId_podId_weekIndex: {
        userId: session.user.id,
        podId: parsed.data.podId,
        weekIndex: parsed.data.weekIndex,
      },
    },
    create: {
      userId: session.user.id,
      podId: parsed.data.podId,
      weekIndex: parsed.data.weekIndex,
      status: parsed.data.status,
    },
    update: { status: parsed.data.status },
  });

  revalidatePath(`/pod/${parsed.data.podId}`);
  return { ok: true as const };
}
