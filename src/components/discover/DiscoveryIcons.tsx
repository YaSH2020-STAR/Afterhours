/** Small stroke icons for discovery cards — 20px default */

const base = "shrink-0";

export function IconMapPin({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

export function IconClock({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function IconCalendar({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
    </svg>
  );
}

export function IconBuilding({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-9 0H3.75A.75.75 0 013 20.25V5.25A.75.75 0 013.75 4.5h7.5a.75.75 0 01.75.75V21M9 10.5h.008v.008H9V10.5zm0 3h.008v.008H9V13.5zm0 3h.008v.008H9V16.5z" />
    </svg>
  );
}

export function IconUsers({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

/** Open seats / table capacity */
export function IconTable({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5v4.5H3.75v-4.5zm0 6h4.5v6h-4.5v-6zm6 0h4.5v6h-4.5v-6zm6 0h4.5v6h-4.5v-6z" />
    </svg>
  );
}

export function IconChatBubble({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9h7.5M8.25 12h4.5M5.25 6.75h13.5a1.5 1.5 0 011.5 1.5v5.25a1.5 1.5 0 01-1.5 1.5H9l-4.5 3v-9.75a1.5 1.5 0 011.5-1.5z" />
    </svg>
  );
}

export function IconArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export function IconCheckIn({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function IconBolt({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75v-4.5z" />
    </svg>
  );
}

export function IconTicket({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V21m-9-1.5h4.5A1.5 1.5 0 0013 18v-6.75a1.5 1.5 0 00-1.5-1.5v-.75a1.5 1.5 0 011.5-1.5zM9 3.75v.75A1.5 1.5 0 0110.5 6v.75m0 3v.75m0 3v.75m0 3V21m-9-1.5h4.5A1.5 1.5 0 0013 18v-6.75a1.5 1.5 0 00-1.5-1.5v-.75a1.5 1.5 0 011.5-1.5z" />
    </svg>
  );
}

export function IconList({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 4.5h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />
    </svg>
  );
}

export function IconSparkle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}
