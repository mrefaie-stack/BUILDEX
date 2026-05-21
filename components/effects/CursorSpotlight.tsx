'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft cyan/gold radial spotlight that follows the cursor. Sits between the
 * background grid and content (z-index: 0). Disabled on coarse pointers
 * (touch) and prefers-reduced-motion.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mq.matches || reduce) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-screen"
    >
      <div
        ref={ref}
        className="absolute h-[600px] w-[600px] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,209,255,0.18) 0%, rgba(0,209,255,0.05) 35%, rgba(0,0,0,0) 70%)',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
