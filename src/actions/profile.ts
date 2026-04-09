"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(80),
  bio: z.string().max(500).optional(),
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,/i, "Profile photo must be PNG, JPG, or WEBP.")
    .max(1_500_000, "Profile photo is too large.")
    .optional(),
});

export async function updateProfile(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Check your profile fields." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      image: parsed.data.imageDataUrl ?? undefined,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true as const };
}
