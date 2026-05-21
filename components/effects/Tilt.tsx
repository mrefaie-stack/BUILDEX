'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  max?: number; // max rotation degrees
  scale?: number;
  glare?: boolean;
}

/**
 * 3D tilt-on-hover wrapper. Touch / reduced-motion safe.
 */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.015,
  glare = true
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${
          px * 100
        }% ${py * 100}%, rgba(255,255,255,0.16), transparent 55%)`;
        glareRef.current.style.opacity = '1';
      }
    };
    const onLeave = () => {
      el.style.transform = '';
      if (glareRef.current) glareRef.current.style.opacity = '0';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max, scale]);

  return (
    <div
      ref={ref}
      className={cn('relative transition-transform will-change-transform', className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-150"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
