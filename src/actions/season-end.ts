"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  seasonId: z.string(),
  choice: z.enum(["CONTINUE_SAME_POD", "NEW_POD", "BREAK"]),
});

export async function submitSeasonEndChoice(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid." };

  const season = await prisma.season.findUnique({
    where: { id: parsed.data.seasonId },
    include: { pod: { include: { memberships: true } } },
  });
  if (!season) return { ok: false as const, error: "Season not found." };

  const isMember = season.pod.memberships.some((m) => m.userId === session.user.id);
  if (!isMember) return { ok: false as const, error: "Not your season." };

  await prisma.seasonEndResponse.upsert({
    where: {
      userId_seasonId: {
        userId: session.user.id,
        seasonId: season.id,
      },
    },
    create: {
      userId: session.user.id,
      seasonId: season.id,
      choice: parsed.data.choice,
    },
    update: { choice: parsed.data.choice },
  });

  revalidatePath(`/pod/${season.podId}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}
