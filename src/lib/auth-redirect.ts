import { redirect } from "next/navigation";

/**
 * When middleware allowed the route but `session.user.id` is missing, or the DB user row is gone.
 */
export function redirectToSignIn(callbackPath: string): never {
  const path = callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`;
  redirect(`/auth/signin?callbackUrl=${encodeURIComponent(path)}`);
}
