"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
});

export async function updateUserLocation(latitude: number, longitude: number) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = schema.safeParse({ latitude, longitude });
  if (!parsed.success) return { ok: false as const, error: "Invalid coordinates." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  revalidatePath("/groups");
  revalidatePath("/profile");
  return { ok: true as const };
}

export async function clearUserLocation() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { latitude: null, longitude: null },
  });

  revalidatePath("/dashboard");
  revalidatePath("/open-tables");
  revalidatePath("/groups");
  revalidatePath("/profile");
  return { ok: true as const };
}
