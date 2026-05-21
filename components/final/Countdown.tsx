'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'milaknight:countdown-end';
const HOURS = 24;

function getOrInitEnd(): number {
  if (typeof window === 'undefined') return Date.now();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const ts = Number(raw);
    if (!Number.isNaN(ts) && ts > Date.now()) return ts;
  }
  const end = Date.now() + HOURS * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, String(end));
  return end;
}

export function Countdown() {
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setEnd(getOrInitEnd());
    const i = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(i);
  }, []);

  if (!end) {
    return (
      <div className="font-mono text-3xl md:text-5xl tracking-[0.15em] text-gradient-red">
        --:--:--
      </div>
    );
  }

  const remaining = Math.max(0, end - now);
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const fmt = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Cell label="ساعة" value={fmt(h)} />
      <Sep />
      <Cell label="دقيقة" value={fmt(m)} />
      <Sep />
      <Cell label="ثانية" value={fmt(s)} />
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="surface-elevated rounded-xl px-3 py-2 md:px-5 md:py-3 surface-glow">
        <div className="font-mono text-2xl md:text-4xl font-bold text-gradient">
          {value}
        </div>
      </div>
      <div className="text-[10px] text-ink-dim mt-1 tracking-widest font-mono">
        {label}
      </div>
    </div>
  );
}

function Sep() {
  return <div className="text-2xl md:text-3xl text-accent-red animate-pulse-soft">:</div>;
}
