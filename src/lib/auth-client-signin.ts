"use client";

import { signIn } from "next-auth/react";

/**
 * Credentials sign-in must run in the browser so Set-Cookie from `/api/auth/*` applies to the client.
 * Server actions that call `signIn()` from `@/auth` often fail to attach the session cookie in production.
 */
export async function signInWithPasswordClient(input: {
  email: string;
  password: string;
  /** Absolute URL (same origin) or path starting with `/` */
  callbackUrl: string;
}): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  let result: Awaited<ReturnType<typeof signIn>>;
  try {
    result = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
      callbackUrl: input.callbackUrl,
    });
  } catch (e) {
    console.error("[signInWithPasswordClient] signIn threw", e);
    return { ok: false, error: "Sign in failed. Try again." };
  }

  if (!result) {
    return { ok: false, error: "Sign in failed. Try again." };
  }

  if (result.error) {
    if (result.error === "CredentialsSignin") {
      return { ok: false, error: "Wrong email or password." };
    }
    if (result.error === "Configuration") {
      return {
        ok: false,
        error:
          "Sign-in is misconfigured (check AUTH_URL and AUTH_SECRET on the server).",
      };
    }
    return { ok: false, error: `Sign in failed (${result.error}).` };
  }

  if (result.ok) {
    if (result.url) {
      try {
        return { ok: true, url: new URL(result.url, window.location.origin).href };
      } catch {
        return { ok: true, url: input.callbackUrl };
      }
    }
    return { ok: true, url: input.callbackUrl };
  }

  return { ok: false, error: "Sign in failed. Try again." };
}
