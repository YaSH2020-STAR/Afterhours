import { NextResponse } from "next/server";
import { registerUserWithPasswordAndConfirm } from "@/lib/register-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const result = await registerUserWithPasswordAndConfirm(body);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/auth/register]", e);
    return NextResponse.json(
      { ok: false, error: "Could not create account. Try again or contact support." },
      { status: 500 },
    );
  }
}
