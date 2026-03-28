/**
 * Illustrative waitlist-style rows for Phoenix metro — for hackathon / judge demos only.
 * Fictional people; emails use @demo.afterhours.example so they never collide with real signups.
 */

export type PhoenixDemoSample = {
  /** Shown on demo page only (not stored in DB) */
  displayName: string;
  /** One-line context for judges */
  roleNote: string;
  email: string;
  city: string;
  timezone: string;
  situations: string[];
  availability: string[];
  affinity: string[];
  comfortNotes: string | null;
  podVibe: string | null;
  consentAtIso: string;
};

export const PHOENIX_METRO_NOTE =
  "Samples scoped to Greater Phoenix (Phoenix, Scottsdale, Tempe, Mesa, Chandler). Time zone: America/Phoenix (no DST).";

export const PHOENIX_DEMO_SAMPLES: PhoenixDemoSample[] = [
  {
    displayName: "Jordan M.",
    roleNote: "27 · product analyst · moved from Austin for a new role (6 mo ago)",
    email: "jordan.m@demo.afterhours.example",
    city: "Phoenix, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "remote_hybrid", "evenings_thin"],
    availability: ["weekday_evenings", "weekend_mornings"],
    affinity: ["introvert_friendly", "cultural_affinity"],
    comfortNotes: "Lives near Camelback East; prefers low-key first weeks, not loud bars.",
    podVibe: "quiet_parallel",
    consentAtIso: "2026-03-02T15:22:00.000Z",
  },
  {
    displayName: "Samira K.",
    roleNote: "29 · RN · relocated for partner’s job; new to AZ",
    email: "samira.k@demo.afterhours.example",
    city: "Scottsdale, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "refill_circle"],
    availability: ["weekday_lunch", "weekend_mornings"],
    affinity: ["sober_default", "faith_informed"],
    comfortNotes: "Rotating shifts; weekend mornings most reliable.",
    podVibe: "socially_light",
    consentAtIso: "2026-03-04T09:10:00.000Z",
  },
  {
    displayName: "Chris V.",
    roleNote: "24 · software engineer · first job out of college; Tempe",
    email: "chris.v@demo.afterhours.example",
    city: "Tempe, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "remote_hybrid"],
    availability: ["weekday_evenings", "weekend_afternoons"],
    affinity: ["regional_mix", "neurodivergent_pace"],
    comfortNotes: "Remote-first team; wants IRL rhythm that isn’t happy-hour networking.",
    podVibe: "no_preference",
    consentAtIso: "2026-03-05T18:45:00.000Z",
  },
  {
    displayName: "Alex R.",
    roleNote: "31 · finance · transferred office downtown Phoenix",
    email: "alex.r@demo.afterhours.example",
    city: "Phoenix, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "evenings_thin"],
    availability: ["weekday_evenings"],
    affinity: ["introvert_friendly"],
    comfortNotes: "Often works late; weekday evenings after 7pm ideal.",
    podVibe: "quiet_parallel",
    consentAtIso: "2026-03-06T11:30:00.000Z",
  },
  {
    displayName: "Taylor Nguyen",
    roleNote: "28 · marketing · moved from Portland; lives near Roosevelt Row",
    email: "taylor.n@demo.afterhours.example",
    city: "Phoenix, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "refill_circle"],
    availability: ["weekend_mornings", "weekend_afternoons"],
    affinity: ["regional_mix", "cultural_affinity"],
    comfortNotes: "Interested in food-forward low-stakes rituals (not forced small talk).",
    podVibe: "socially_light",
    consentAtIso: "2026-03-07T20:05:00.000Z",
  },
  {
    displayName: "Riley P.",
    roleNote: "26 · teacher (Mesa) · moved from Midwest last year",
    email: "riley.p@demo.afterhours.example",
    city: "Mesa, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "evenings_thin"],
    availability: ["weekend_mornings", "weekday_lunch"],
    affinity: ["introvert_friendly", "faith_informed"],
    comfortNotes: "School schedule; prefers Sat mornings.",
    podVibe: "quiet_parallel",
    consentAtIso: "2026-03-08T14:18:00.000Z",
  },
  {
    displayName: "Morgan Lee",
    roleNote: "30 · UX · hybrid; Chandler / office in Tempe",
    email: "morgan.l@demo.afterhours.example",
    city: "Chandler, AZ",
    timezone: "America/Phoenix",
    situations: ["remote_hybrid", "moved_new_city"],
    availability: ["weekday_evenings", "weekend_afternoons"],
    affinity: ["neurodivergent_pace", "regional_mix"],
    comfortNotes: "Sensory-friendly spaces appreciated.",
    podVibe: "no_preference",
    consentAtIso: "2026-03-09T16:40:00.000Z",
  },
  {
    displayName: "Devon S.",
    roleNote: "25 · grad hire · first apartment alone; North Phoenix",
    email: "devon.s@demo.afterhours.example",
    city: "Phoenix, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "evenings_thin", "refill_circle"],
    availability: ["weekday_evenings", "weekend_mornings"],
    affinity: ["sober_default", "introvert_friendly"],
    comfortNotes: "Sobriety — please no default alcohol-centric meetups.",
    podVibe: "quiet_parallel",
    consentAtIso: "2026-03-10T10:00:00.000Z",
  },
  {
    displayName: "Casey Ortiz",
    roleNote: "32 · ops manager · relocated for family; Glendale",
    email: "casey.o@demo.afterhours.example",
    city: "Glendale, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city"],
    availability: ["weekend_mornings", "weekend_afternoons"],
    affinity: ["cultural_affinity", "regional_mix"],
    comfortNotes: "Bilingual household; open to mixed backgrounds.",
    podVibe: "socially_light",
    consentAtIso: "2026-03-11T13:25:00.000Z",
  },
  {
    displayName: "Jamie H.",
    roleNote: "27 · solar project coordinator · moved from Denver",
    email: "jamie.h@demo.afterhours.example",
    city: "Phoenix, AZ",
    timezone: "America/Phoenix",
    situations: ["moved_new_city", "remote_hybrid"],
    availability: ["weekday_early", "weekday_lunch"],
    affinity: ["introvert_friendly"],
    comfortNotes: "Often in field; weekday lunch slots best when possible.",
    podVibe: "no_preference",
    consentAtIso: "2026-03-12T08:55:00.000Z",
  },
];

/** Prisma-ready rows (no displayName / roleNote) */
export function toPrismaSeedData(s: PhoenixDemoSample) {
  return {
    email: s.email,
    city: s.city,
    timezone: s.timezone,
    situationsJson: JSON.stringify(s.situations),
    availabilityJson: JSON.stringify(s.availability),
    affinityJson: JSON.stringify(s.affinity),
    comfortNotes: s.comfortNotes,
    podVibe: s.podVibe,
    consentAt: new Date(s.consentAtIso),
  };
}
