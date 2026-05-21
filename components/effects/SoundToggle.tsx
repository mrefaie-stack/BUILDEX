'use client';

import { useEffect, useState } from 'react';
import {
  isSoundEnabled,
  playSound,
  setSoundEnabled,
  startAmbient,
  stopAmbient,
  unlockSound
} from '@/lib/sound';
import { cn } from '@/lib/utils';

export function SoundToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    unlockSound();
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) {
      playSound('click');
      startAmbient();
    } else {
      stopAmbient();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'كتم الصوت' : 'تشغيل الصوت'}
      title={enabled ? 'كتم الصوت' : 'تشغيل الصوت'}
      className={cn(
        'relative grid place-items-center h-9 w-9 rounded-full border transition',
        enabled
          ? 'border-accent/40 bg-accent/8 text-accent shadow-glow'
          : 'border-white/10 bg-bg-card text-ink-muted hover:border-white/30',
        className
      )}
    >
      {enabled ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10v4h4l5 4V6L7 10H3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M15 9c1.5 1 1.5 5 0 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M18 6c3 2.5 3 9.5 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10v4h4l5 4V6L7 10H3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M16 9l5 5M21 9l-5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
