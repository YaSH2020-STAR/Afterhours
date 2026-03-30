export type RitualKind = "conversation" | "activity" | "cowork";

export interface RitualSuggestion {
  kind: RitualKind;
  title: string;
  detail: string;
}

const POOL: RitualSuggestion[] = [
  {
    kind: "conversation",
    title: "Two truths, one hope",
    detail: "Share two true things from your week and one hope for the next—no fixing, just listening.",
  },
  {
    kind: "conversation",
    title: "Rose / bud / soil",
    detail: "Rose: something good. Bud: something emerging. Soil: something heavy (optional share).",
  },
  {
    kind: "activity",
    title: "20-minute neighborhood loop",
    detail: "Walk together at conversation pace; silence is allowed.",
  },
  {
    kind: "activity",
    title: "Pantry snack swap",
    detail: "Everyone brings one shelf-stable snack; trade without ceremony.",
  },
  {
    kind: "cowork",
    title: "Parallel hour",
    detail: "Same table, headphones optional—light check-in at start and end only.",
  },
  {
    kind: "cowork",
    title: "Body-double focus",
    detail: "25/5 pomodoros with a soft “back in the room” bell.",
  },
];

export function pickRitualSuggestion(podId: string, weekIndex: number): RitualSuggestion {
  const seed = podId.length + weekIndex * 31;
  return POOL[seed % POOL.length]!;
}

export function conversationStarters(): string[] {
  return [
    "What’s a small win from work that nobody else would notice?",
    "What’s helping your week feel humane?",
    "If your city had a ‘third place’ button, what would it open?",
    "What are you reading or listening to on repeat?",
    "What boundary are you trying to keep right now?",
  ];
}
