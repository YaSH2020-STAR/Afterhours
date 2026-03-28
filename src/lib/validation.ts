import { z } from "zod";

/** Core audience: young working professionals (roughly 20–30) who recently relocated to a new city. */
export const SITUATION_OPTIONS = [
  { id: "moved_new_city", label: "Moved to a new city in the last ~18 months" },
  { id: "remote_hybrid", label: "Remote / hybrid job — few casual collisions" },
  { id: "refill_circle", label: "Circle shrank (friend left town, breakup, etc.)" },
  { id: "evenings_thin", label: "Work is fine; evenings feel thin or samey" },
] as const;

export const AVAILABILITY_OPTIONS = [
  { id: "weekday_early", label: "Weekday mornings (before typical work)" },
  { id: "weekday_lunch", label: "Weekday lunch breaks" },
  { id: "weekday_evenings", label: "Weekday evenings" },
  { id: "weekend_mornings", label: "Weekend mornings" },
  { id: "weekend_afternoons", label: "Weekend afternoons" },
] as const;

/**
 * Optional affinity signals — never required. Ethnicity/culture is never a gate; these help avoid misfit pods.
 * Labels align with landing copy in EthnicityInclusionPrinciples.
 */
export const AFFINITY_OPTIONS = [
  {
    id: "cultural_affinity",
    label:
      "Cultural / ethnic comfort — I’d like a pod where shared background can feel easier (holidays, food norms, etc.)",
  },
  {
    id: "regional_mix",
    label: "Mixed backgrounds — I’m open to a pod with varied ethnicities, regions, and lived experiences",
  },
  { id: "introvert_friendly", label: "Introvert-friendly / low-pressure first weeks" },
  { id: "sober_default", label: "Sober-by-default space" },
  { id: "neurodivergent_pace", label: "Neurodivergent-friendly pacing" },
  { id: "faith_informed", label: "Faith-informed comfort (non-proselytizing)" },
] as const;

const SITUATION_IDS = SITUATION_OPTIONS.map((s) => s.id);
const AVAILABILITY_IDS = AVAILABILITY_OPTIONS.map((a) => a.id);
const AFFINITY_IDS = AFFINITY_OPTIONS.map((a) => a.id);

const situationEnum = z.enum([SITUATION_IDS[0], ...SITUATION_IDS.slice(1)]);
const availabilityEnum = z.enum([AVAILABILITY_IDS[0], ...AVAILABILITY_IDS.slice(1)]);
const affinityEnum = z.enum([AFFINITY_IDS[0], ...AFFINITY_IDS.slice(1)]);

export const waitlistPayloadSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  timezone: z.string().trim().max(80).optional().or(z.literal("")),
  situations: z.array(situationEnum).max(8).default([]),
  availability: z.array(availabilityEnum).max(8).default([]),
  affinity: z.array(affinityEnum).max(12).default([]),
  comfortNotes: z.string().trim().max(4000).optional().or(z.literal("")),
  podVibe: z.enum(["quiet_parallel", "socially_light", "no_preference"]).optional(),
  consent: z.boolean().refine((v) => v === true, "Consent is required to join."),
  /** Honeypot — must stay empty */
  website: z.string().optional(),
});

export type WaitlistPayload = z.infer<typeof waitlistPayloadSchema>;
