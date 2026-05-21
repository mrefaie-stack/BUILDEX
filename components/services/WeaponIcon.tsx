'use client';

const PATHS: Record<string, string> = {
  website: 'M3 5h18v3H3zm0 5h18v9H3zm3 3h4v3H6z',
  social: 'M21 12c0 4.97-4.03 9-9 9-1.4 0-2.7-.3-3.9-.85L3 21l1.85-5.1A8.96 8.96 0 0 1 3 12C3 7.03 7.03 3 12 3s9 4.03 9 9z',
  ads: 'M3 11l9-5 9 5-9 5zM7 13v5l5 3 5-3v-5',
  video: 'M3 5h12v14H3zM17 9l4-2v10l-4-2z',
  seo: 'M11 4a7 7 0 0 1 5 12l5 5-2 2-5-5a7 7 0 1 1-3-14z',
  consulting: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'
};

export function WeaponIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d={PATHS[name] ?? PATHS.website}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
