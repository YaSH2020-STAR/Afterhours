import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { waitlistPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json({ ok: false, message, details }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = waitlistPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const first =
      flat.fieldErrors.email?.[0] ??
      flat.fieldErrors.consent?.[0] ??
      flat.formErrors[0] ??
      "Check your answers and try again.";
    return jsonError(first, 422, flat);
  }

  const data = parsed.data;

  // Honeypot — leave empty for humans
  if (data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const emptyToNull = (s: string | undefined) => (s && s.trim() !== "" ? s.trim() : null);

  try {
    await prisma.waitlistSubmission.create({
      data: {
        email: data.email.toLowerCase(),
        city: emptyToNull(data.city),
        timezone: emptyToNull(data.timezone),
        situationsJson: JSON.stringify(data.situations),
        availabilityJson: JSON.stringify(data.availability),
        affinityJson: JSON.stringify(data.affinity),
        comfortNotes: emptyToNull(data.comfortNotes),
        podVibe: data.podVibe ?? null,
        consentAt: new Date(),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({
        ok: true,
        message: "You’re already on the list — we’ll only email you when there’s real news.",
      });
    }
    console.error(e);
    return jsonError("Could not save right now. Try again in a few minutes.", 500);
  }

  return NextResponse.json({
    ok: true,
    message: "You’re on the list. We’ll reach out when your city opens with small pods.",
  });
}
