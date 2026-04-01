import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const baseSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().email("Enter a valid email.").transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

const withConfirmSchema = baseSchema.extend({
  confirmPassword: z.string().min(1, "Confirm your password."),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type RegisterResult = { ok: true } | { ok: false; error: string };

/** Shared by server action and POST /api/auth/register */
export async function registerUserWithPassword(input: unknown): Promise<RegisterResult> {
  const parsed = baseSchema.safeParse(input);
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

/** For API route when confirmPassword is required */
export async function registerUserWithPasswordAndConfirm(input: unknown): Promise<RegisterResult> {
  const parsed = withConfirmSchema.safeParse(input);
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    const first =
      err.name?.[0] ??
      err.email?.[0] ??
      err.password?.[0] ??
      err.confirmPassword?.[0] ??
      parsed.error.flatten().formErrors[0] ??
      "Invalid input.";
    return { ok: false, error: first };
  }

  const { name, email, password } = parsed.data;
  return registerUserWithPassword({ name, email, password });
}
