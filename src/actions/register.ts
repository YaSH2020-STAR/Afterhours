"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().email("Enter a valid email.").transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerWithEmail(input: unknown): Promise<RegisterResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    const first = err.name?.[0] ?? err.email?.[0] ?? err.password?.[0] ?? "Invalid input.";
    return { ok: false, error: first };
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        onboardingCompleted: false,
      },
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "An account with this email already exists. Sign in instead." };
    }
    console.error("[register]", e);
    return { ok: false, error: "Could not create your account. Try again." };
  }
}
