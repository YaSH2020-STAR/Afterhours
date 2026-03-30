import { AppHeader } from "@/components/app/AppHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">{children}</main>
    </div>
  );
}
