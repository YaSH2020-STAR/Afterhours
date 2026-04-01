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

function prismaFailureMessage(e: Prisma.PrismaClientKnownRequestError): string | null {
  switch (e.code) {
    case "P2002":
      return "An account with this email already exists. Sign in instead.";
    case "P2021":
    case "P2022":
      return "Database is missing the latest schema. Run prisma migrate deploy on production.";
    case "P1001":
      return "Cannot reach the database. Check DATABASE_URL on the server.";
    default:
      return null;
  }
}

/** Shared by server action and POST /api/auth/register */
export async function registerUserWithPassword(input: unknown): Promise<RegisterResult> {
  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return { ok: false, error: "Server misconfiguration: DATABASE_URL is not set." };
    }

    const parsed = baseSchema.safeParse(input);
    if (!parsed.success) {
      const err = parsed.error.flatten().fieldErrors;
      const first = err.name?.[0] ?? err.email?.[0] ?? err.password?.[0] ?? "Invalid input.";
      return { ok: false, error: first };
    }

    const { name, email, password } = parsed.data;
    let passwordHash: string;
    try {
      passwordHash = await bcrypt.hash(password, 12);
    } catch (e) {
      console.error("[register] bcrypt", e);
      return { ok: false, error: "Could not process password. Try again." };
    }

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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const mapped = prismaFailureMessage(e);
        if (mapped) return { ok: false, error: mapped };
      }
      console.error("[register] prisma", e);
      return { ok: false, error: "Could not create your account. Try again." };
    }
  } catch (e) {
    console.error("[register] unexpected", e);
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }
}

/** For API route when confirmPassword is required */
export async function registerUserWithPasswordAndConfirm(input: unknown): Promise<RegisterResult> {
  try {
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
  } catch (e) {
    console.error("[register] confirm unexpected", e);
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }
}
