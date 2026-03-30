export const DISCOVERY_INTENSITIES = ["all", "low-key", "casual", "social", "active", "high-energy"] as const;

export type DiscoveryIntensity = (typeof DISCOVERY_INTENSITIES)[number];

export function parseDiscoveryVibe(raw: string | undefined): DiscoveryIntensity {
  if (!raw) return "all";
  if ((DISCOVERY_INTENSITIES as readonly string[]).includes(raw)) return raw as DiscoveryIntensity;
  return "all";
}
