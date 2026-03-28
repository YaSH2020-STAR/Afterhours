export function PodDiagram() {
  return (
    <div className="rounded-xl border border-dashed border-ah-border bg-ah-card p-8 text-center">
      <div
        className="relative mx-auto mb-4 aspect-square w-[min(280px,100%)] rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,var(--bg))]"
        role="img"
        aria-label="You at the center with six people in a small circle around you"
      >
        <span className="absolute left-1/2 top-1/2 z-[2] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ah-accent bg-ah-accent text-xs font-bold text-white">
          You
        </span>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ah-accent bg-ah-card text-xs font-bold text-ah-accent"
            style={{ transform: `rotate(${deg}deg) translateY(-118px) rotate(-${deg}deg)` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <p className="m-0 text-sm text-ah-muted">Small circle, repeated contact—how trust actually forms.</p>
    </div>
  );
}
