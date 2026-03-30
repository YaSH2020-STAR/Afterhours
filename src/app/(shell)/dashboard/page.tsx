import type { Metadata } from "next";
import { auth } from "@/auth";
import { DiscoverDashboard } from "@/components/discover/DiscoverDashboard";
import { getDashboardData } from "@/data/dashboard";
import { getDiscoveryContext } from "@/data/discovery";
import { greetingForHour } from "@/lib/greeting";
import { parseDiscoveryVibe } from "@/lib/discovery-query";

export const metadata: Metadata = {
  title: "Discover",
  description: "Partner tables and meetups near you.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; vibe?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sp = await searchParams;
  const tab: "discover" | "open" | "groups" =
    sp.tab === "open" ? "open" : sp.tab === "groups" ? "groups" : "discover";
  const q = typeof sp.q === "string" ? sp.q : "";
  const vibe = parseDiscoveryVibe(typeof sp.vibe === "string" ? sp.vibe : undefined);

  const [discovery, dash] = await Promise.all([
    getDiscoveryContext(session.user.id),
    getDashboardData(session.user.id),
  ]);
  if (!discovery) return null;

  const greeting = greetingForHour(new Date().getHours());

  const podSummary =
    dash?.pod && dash.season
      ? {
          podId: dash.pod.id,
          name: dash.pod.name,
          slotLabel: dash.pod.weeklySlotLabel,
        }
      : null;

  const firstName = discovery.user.name?.split(/\s+/)[0] ?? null;

  return (
    <DiscoverDashboard
      greeting={greeting}
      initialTab={tab}
      displayCity={discovery.displayCity}
      userFirstName={firstName}
      viewerId={session.user.id}
      viewerLocation={discovery.viewerLocation}
      venues={discovery.venues}
      groups={discovery.groups}
      interests={discovery.interests}
      podSummary={podSummary}
      happeningTonight={discovery.happeningTonight}
      joinedPlans={discovery.joinedPlans}
      createdPlans={discovery.createdPlans}
      initialSearch={q}
      initialIntensity={vibe}
    />
  );
}
