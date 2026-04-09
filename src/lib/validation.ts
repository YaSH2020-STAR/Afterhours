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

