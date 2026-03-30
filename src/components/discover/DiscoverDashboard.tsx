"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { DiscoveryViewerLocation, GroupForUi, VenueForUi } from "@/data/discovery";
import { DISCOVERY_CITY } from "@/lib/discovery-constants";
import { DISCOVERY_INTENSITIES, type DiscoveryIntensity } from "@/lib/discovery-query";
import { DiscoverLocationBanner } from "./DiscoverLocationBanner";
import { GroupCard } from "./GroupCard";
import { PodRhythmCard } from "./PodRhythmCard";
import { VenueCard } from "./VenueCard";

export type DiscoverTab = "discover" | "open" | "groups";

function pathForTab(t: DiscoverTab): string {
  if (t === "discover") return "/dashboard";
  if (t === "open") return "/open-tables";
  return "/groups";
}

function normalize(s: string) {
  return s.toLowerCase();
}

function scoreGroup(g: GroupForUi, interests: string[]): number {
  let s = 0;
  for (const i of interests) {
    const n = normalize(i);
    if (n.length < 2) continue;
    if (normalize(g.category).includes(n) || normalize(g.vibe).includes(n) || normalize(g.title).includes(n)) {
      s += 2;
    }
  }
  return s;
}

/** One list: match interests first, then soonest */
function sortGroupsForHome(groups: GroupForUi[], interests: string[]): GroupForUi[] {
  return [...groups].sort((a, b) => {
    const sa = scoreGroup(a, interests);
    const sb = scoreGroup(b, interests);
    if (sb !== sa) return sb - sa;
    return a.startsAt.getTime() - b.startsAt.getTime();
  });
}

export function DiscoverDashboard({
  greeting,
  initialTab,
  displayCity,
  userFirstName,
  viewerId,
  viewerLocation,
  venues,
  groups,
  interests,
  podSummary,
  happeningTonight,
  joinedPlans,
  createdPlans,
  initialSearch,
  initialIntensity,
}: {
  greeting: string;
  initialTab: DiscoverTab;
  displayCity: string;
  userFirstName: string | null;
  viewerId: string;
  viewerLocation: DiscoveryViewerLocation | null;
  venues: VenueForUi[];
  groups: GroupForUi[];
  interests: string[];
  podSummary: { podId: string; name: string; slotLabel: string } | null;
  happeningTonight: GroupForUi[];
  joinedPlans: GroupForUi[];
  createdPlans: GroupForUi[];
  initialSearch: string;
  initialIntensity: DiscoveryIntensity;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<DiscoverTab>(initialTab);
  const [search, setSearch] = useState(initialSearch);
  const [intensity, setIntensity] = useState<DiscoveryIntensity>(initialIntensity);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setIntensity(initialIntensity);
  }, [initialIntensity]);

  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (search.trim()) p.set("q", search.trim());
      if (intensity !== "all") p.set("vibe", intensity);
      const qs = p.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      if (typeof window === "undefined") return;
      const cur = `${window.location.pathname}${window.location.search}`;
      if (next !== cur) router.replace(next, { scroll: false });
    }, 380);
    return () => clearTimeout(t);
  }, [search, intensity, pathname, router]);

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.vibes.some((x) => x.toLowerCase().includes(q)) ||
        (v.neighborhood?.toLowerCase().includes(q) ?? false);
      const matchI =
        intensity === "all" ||
        v.vibes.some((vi) => normalize(vi).includes(intensity)) ||
        (intensity === "casual" && v.vibes.some((x) => /chat|coffee|quiet/.test(x)));
      return matchQ && matchI;
    });
  }, [venues, search, intensity]);

  const matchesGroup = useMemo(() => {
    return (g: GroupForUi) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.locationLabel.toLowerCase().includes(q);
      const matchI =
        intensity === "all" || normalize(g.intensity) === intensity || normalize(g.vibe).includes(intensity);
      return matchQ && matchI;
    };
  }, [search, intensity]);

  const filteredGroups = useMemo(() => groups.filter(matchesGroup), [groups, matchesGroup]);

  const sortedGroups = useMemo(
    () => sortGroupsForHome(filteredGroups, interests),
    [filteredGroups, interests],
  );

  const filteredHappeningTonight = useMemo(
    () => happeningTonight.filter(matchesGroup),
    [happeningTonight, matchesGroup],
  );
  const filteredJoinedPlans = useMemo(() => joinedPlans.filter(matchesGroup), [joinedPlans, matchesGroup]);
  const filteredCreatedPlans = useMemo(() => createdPlans.filter(matchesGroup), [createdPlans, matchesGroup]);

  const cityLine = useMemo(() => {
    const home = displayCity.trim();
    const metro = DISCOVERY_CITY;
    const metroCity = metro.split(",")[0]?.trim().toLowerCase() ?? "";
    if (!home) return `Plans in ${metro}`;
    const h = home.toLowerCase();
    if (h === metro.toLowerCase() || h === metroCity || metro.toLowerCase().startsWith(h)) {
      return `Plans in ${metro}`;
    }
    return `${displayCity} · ${metro}`;
  }, [displayCity]);

  return (
    <div className="space-y-10 sm:space-y-12">
      <header className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--surface-elevated)] to-ah-bg-alt/40 px-5 py-6 shadow-[var(--shadow-card)] ring-1 ring-black/[0.06] sm:px-7 sm:py-7">
          <p className="text-xs font-medium text-ah-muted">
            {greeting}
            {userFirstName ? `, ${userFirstName}` : ""}
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ah-ink sm:text-3xl">
            Discover tonight
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-snug text-ah-muted">
            Partner tables and small meetups—pick a vibe, join what fits, or host something yourself.
          </p>
          <p className="mt-4 text-xs text-ah-muted">
            <span className="font-medium text-ah-ink">{cityLine}</span>
          </p>
          <div className="mt-4">
            <DiscoverLocationBanner hasSavedLocation={viewerLocation != null} />
          </div>
        </div>

        {podSummary && <PodRhythmCard {...podSummary} />}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-black/[0.04] p-1.5 ring-1 ring-black/[0.05]">
            {(
              [
                ["discover", "For you"],
                ["open", "Tables"],
                ["groups", "Meetups"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  const p = new URLSearchParams();
                  if (search.trim()) p.set("q", search.trim());
                  if (intensity !== "all") p.set("vibe", intensity);
                  const qs = p.toString();
                  router.push(`${pathForTab(id)}${qs ? `?${qs}` : ""}`);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === id
                    ? "bg-white text-ah-ink shadow-[0_2px_14px_-6px_rgba(20,24,22,0.2)] ring-1 ring-black/[0.06]"
                    : "text-ah-muted hover:text-ah-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-ah-warm to-[#c96a4a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(184,87,61,0.55)] transition hover:brightness-[1.03]"
          >
            Host a meetup
          </Link>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label className="relative block flex-1">
            <span className="sr-only">Search</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ah-muted/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues or meetups"
              className="focus-ring-consumer h-11 w-full rounded-full border-0 bg-white/85 py-2.5 pl-11 pr-4 text-sm text-ah-ink shadow-[0_4px_24px_-12px_rgba(20,24,22,0.12)] ring-1 ring-black/[0.06] backdrop-blur-sm placeholder:text-ah-muted/80 focus:ring-2 focus:ring-ah-accent/25"
            />
          </label>
          <label className="sm:w-44">
            <span className="sr-only">Vibe</span>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as DiscoveryIntensity)}
              className="focus-ring-consumer h-11 w-full cursor-pointer appearance-none rounded-full border-0 bg-white/85 bg-[length:1rem] bg-[right_0.875rem_center] bg-no-repeat py-2.5 pl-3 pr-9 text-sm text-ah-ink shadow-[0_4px_24px_-12px_rgba(20,24,22,0.12)] ring-1 ring-black/[0.06] backdrop-blur-sm focus:ring-2 focus:ring-ah-accent/25"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235c635e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
            >
              {DISCOVERY_INTENSITIES.map((i) => (
                <option key={i} value={i}>
                  {i === "all" ? "All vibes" : i}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {tab === "discover" && (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ah-ink">Tonight</h2>
              {filteredHappeningTonight.length > 0 && (
                <p className="text-xs text-ah-muted">Starting today in {DISCOVERY_CITY}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredHappeningTonight.map((g) => (
                <GroupCard key={`tonight-${g.id}`} group={g} viewerId={viewerId} />
              ))}
            </div>
            {filteredHappeningTonight.length === 0 && (
              <EmptyHint
                title="Nothing on for tonight yet"
                body="Check Meetups or host something for later this week."
                actionHref="/create"
                actionLabel="Host a meetup"
              />
            )}
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-ah-ink">Partner tables</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVenues.map((v) => (
                <div key={v.id} id={`venue-${v.id}`}>
                  <VenueCard venue={v} />
                </div>
              ))}
            </div>
            {filteredVenues.length === 0 && (
              <EmptyHint title="No tables match" body="Try another search or vibe filter." />
            )}
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-ah-ink">Meetups nearby</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedGroups.map((g) => (
                <GroupCard key={g.id} group={g} viewerId={viewerId} />
              ))}
            </div>
            {sortedGroups.length === 0 && (
              <EmptyHint
                title="No meetups match"
                body="Loosen filters or host your own."
                actionHref="/create"
                actionLabel="Host a meetup"
              />
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ah-ink">You&apos;re going</h2>
              <Link href="/plans" className="text-sm font-medium text-ah-accent hover:underline">
                All plans
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredJoinedPlans.map((g) => (
                <GroupCard key={`joined-${g.id}`} group={g} viewerId={viewerId} />
              ))}
            </div>
            {filteredJoinedPlans.length === 0 && (
              <EmptyHint
                title="No RSVPs yet"
                body="Join a meetup above or start one from Host."
                actionHref="/groups"
                actionLabel="Browse meetups"
              />
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ah-ink">You&apos;re hosting</h2>
              <Link href="/create" className="text-sm font-medium text-ah-accent hover:underline">
                New meetup
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCreatedPlans.map((g) => (
                <GroupCard key={`created-${g.id}`} group={g} viewerId={viewerId} />
              ))}
            </div>
            {filteredCreatedPlans.length === 0 && (
              <EmptyHint
                title="You haven&apos;t hosted yet"
                body="Post a small meetup with a clear size—people can join from Discover."
                actionHref="/create"
                actionLabel="Host a meetup"
              />
            )}
          </section>
        </>
      )}

      {tab === "open" && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-ah-ink">Partner tables</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((v) => (
              <div key={v.id} id={`venue-${v.id}`}>
                <VenueCard venue={v} />
              </div>
            ))}
          </div>
          {filteredVenues.length === 0 && (
            <EmptyHint title="No tables match" body="Clear search or pick another vibe." />
          )}
        </section>
      )}

      {tab === "groups" && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-ah-ink">Meetups near you</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedGroups.map((g) => (
              <GroupCard key={g.id} group={g} viewerId={viewerId} />
            ))}
          </div>
          {sortedGroups.length === 0 && (
            <EmptyHint
              title="No meetups match"
              body="Loosen filters or host your own."
              actionHref="/create"
              actionLabel="Host a meetup"
            />
          )}
        </section>
      )}
    </div>
  );
}

function EmptyHint({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-ah-border/50 bg-gradient-to-b from-white/70 to-ah-bg-alt/40 px-5 py-7 text-center shadow-[0_4px_24px_-16px_rgba(20,24,22,0.12)]">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ah-accent/10 ring-1 ring-ah-accent/15">
        <svg className="h-5 w-5 text-ah-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m6.366-.366l-2.12 2.12M21 12h-3m.366 6.366l-2.12-2.12M12 21v-3m-6.366.366l2.12-2.12M3 12h3m-.366-6.366l2.12 2.12M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-ah-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ah-muted">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-full bg-ah-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(45,90,74,0.45)] transition hover:bg-ah-accent-soft"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
