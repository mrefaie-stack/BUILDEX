'use client';

import { useRef, useState } from 'react';

interface Props {
  before: { label: string; metric: string };
  after: { label: string; metric: string };
}

export function BeforeAfterSlider({ before, after }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // RTL: visual "before" is on the right, "after" on the left
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => dragging.current && handleMove(e.clientX)}
      onMouseDown={(e) => {
        dragging.current = true;
        handleMove(e.clientX);
      }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
      className="relative h-40 w-full rounded-xl overflow-hidden select-none cursor-ew-resize surface"
    >
      {/* AFTER (full) */}
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/15 to-bg-elevated">
        <div className="text-center">
          <div className="text-[10px] font-mono tracking-widest text-accent mb-1">
            AFTER
          </div>
          <div className="font-display text-2xl text-gradient-gold">
            {after.metric}
          </div>
          <div className="text-xs text-ink-muted mt-1">{after.label}</div>
        </div>
      </div>
      {/* BEFORE clip */}
      <div
        className="absolute inset-y-0 right-0 bg-gradient-to-bl from-accent-red/15 to-bg-elevated grid place-items-center"
        style={{ width: `${100 - pos}%` }}
      >
        <div className="text-center">
          <div className="text-[10px] font-mono tracking-widest text-accent-red mb-1">
            BEFORE
          </div>
          <div className="font-display text-2xl text-gradient-red">
            {before.metric}
          </div>
          <div className="text-xs text-ink-muted mt-1">{before.label}</div>
        </div>
      </div>
      {/* Divider */}
      <div
        className="absolute inset-y-0 w-[2px] bg-white/40 shadow-glow"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center h-8 w-8 rounded-full bg-bg-elevated border border-white/30">
          <span className="text-[10px] text-ink">⇆</span>
        </div>
      </div>
    </div>
  );
}
