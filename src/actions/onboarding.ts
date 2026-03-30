"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  city: z.string().min(1).max(120),
  timezone: z.string().max(80).optional(),
  availability: z.array(z.string()).min(1),
  interests: z.array(z.string()).min(1).max(24),
  energyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  groupStyle: z.enum(["QUIET", "ACTIVITY", "MIXED"]),
  lifeStages: z.array(z.enum(["NEW_TO_CITY", "REMOTE_WORKER", "EARLY_CAREER"])).min(1),
  accessibilityNotes: z.string().max(2000).optional(),
  languagePreference: z.string().max(80).optional(),
});

export async function saveOnboarding(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "Not signed in." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().formErrors.join(" ") };
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      city: data.city,
      timezone: data.timezone || null,
      onboardingCompleted: true,
      preferences: {
        upsert: {
          create: {
            availabilityJson: JSON.stringify(data.availability),
            interestsJson: JSON.stringify(data.interests),
            energyLevel: data.energyLevel,
            groupStyle: data.groupStyle,
            lifeStagesJson: JSON.stringify(data.lifeStages),
            accessibilityNotes: data.accessibilityNotes || null,
            languagePreference: data.languagePreference || null,
          },
          update: {
            availabilityJson: JSON.stringify(data.availability),
            interestsJson: JSON.stringify(data.interests),
            energyLevel: data.energyLevel,
            groupStyle: data.groupStyle,
            lifeStagesJson: JSON.stringify(data.lifeStages),
            accessibilityNotes: data.accessibilityNotes || null,
            languagePreference: data.languagePreference || null,
          },
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { ok: true as const };
}
