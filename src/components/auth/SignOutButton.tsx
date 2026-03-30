"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg border-2 border-ah-border px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-bg-alt"
    >
      Sign out
    </button>
  );
}
