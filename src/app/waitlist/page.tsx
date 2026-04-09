import { permanentRedirect } from "next/navigation";

/** Legacy marketing URL — accounts are open; sign up directly. */
export default function WaitlistRedirectPage() {
  permanentRedirect("/auth/signup");
}
