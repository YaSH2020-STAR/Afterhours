"use server";

import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

export type LoginResult = { ok: true; redirectUrl: string } | { ok: false; error: string };

export async function loginWithCredentials(input: {
  email: string;
  password: string;
  /** Absolute URL, e.g. https://your-domain.com/dashboard */
  redirectTo: string;
}): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password?.trim()) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password: input.password,
      redirectTo: input.redirectTo,
      redirect: false,
    });

    if (typeof result !== "string") {
      return { ok: false, error: "Sign in failed." };
    }

    if (result.includes("error=CredentialsSignin") || result.includes("error=Configuration")) {
      return { ok: false, error: "Wrong email or password." };
    }
    if (result.includes("error=")) {
      return { ok: false, error: "Sign in failed. Try again." };
    }

    return { ok: true, redirectUrl: result };
  } catch (e) {
    if (e instanceof CredentialsSignin) {
      return { ok: false, error: "Wrong email or password." };
    }
    console.error("[loginWithCredentials]", e);
    return { ok: false, error: "Could not sign in. Try again." };
  }
}
