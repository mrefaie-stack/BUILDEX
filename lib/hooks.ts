'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, upsertVisitor } from './tracking';
import { useArsenalStore } from './store';

export function useTrackPage(event: string, level?: string) {
  const fired = useRef(false);
  const setCurrentLevel = useArsenalStore((s) => s.setCurrentLevel);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (level) setCurrentLevel(level);
    trackEvent(event, { metadata: { level } });
    upsertVisitor(level);
  }, [event, level, setCurrentLevel]);
}

export function useTrackEvent() {
  return trackEvent;
}

export function useCountUp(value: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (value - from) * eased);
      el.textContent = current.toLocaleString('en-US');
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return ref;
}
