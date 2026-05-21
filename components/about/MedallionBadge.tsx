'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { burstAtElement } from '@/components/effects/Confetti';
import { playSound } from '@/lib/sound';

interface Props {
  icon: React.ReactNode;
  number: string;
  title: string;
  body: string;
  index: number;
}

/**
 * Gold circular achievement medallion with confetti burst on first reveal.
 */
export function MedallionBadge({ icon, number, title, body, index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!inView || burst) return;
    setBurst(true);
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      burstAtElement(el, { count: 40, spread: 110, power: 7 });
      playSound('tick');
    }, 250 + index * 200);
    return () => clearTimeout(t);
  }, [inView, burst, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: index * 0.15, type: 'spring', stiffness: 180, damping: 20 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Glow plate */}
      <div
        className="absolute -inset-6 rounded-full blur-2xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(230,180,80,0.45), transparent 60%)' }}
      />

      {/* Medallion */}
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 128 128" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id={`mg-${index}`} x1="0" y1="0" x2="128" y2="128">
              <stop offset="0" stopColor="#FFE9B0" />
              <stop offset="0.5" stopColor="#E6B450" />
              <stop offset="1" stopColor="#6E4612" />
            </linearGradient>
            <radialGradient id={`mgr-${index}`} cx="50%" cy="40%" r="60%">
              <stop offset="0" stopColor="#1A1207" />
              <stop offset="1" stopColor="#0A0703" />
            </radialGradient>
          </defs>
          {/* Outer ring */}
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke={`url(#mg-${index})`}
            strokeWidth="3"
          />
          {/* Mid ring */}
          <circle
            cx="64"
            cy="64"
            r="52"
            fill="none"
            stroke={`url(#mg-${index})`}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          {/* Inner plate */}
          <circle cx="64" cy="64" r="46" fill={`url(#mgr-${index})`} stroke={`url(#mg-${index})`} strokeWidth="1" />
          {/* Decorative spikes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const r1 = 58;
            const r2 = 64;
            return (
              <line
                key={i}
                x1={64 + Math.cos(a) * r1}
                y1={64 + Math.sin(a) * r1}
                x2={64 + Math.cos(a) * r2}
                y2={64 + Math.sin(a) * r2}
                stroke={`url(#mg-${index})`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-accent-gold text-3xl">{icon}</div>
        </div>
      </div>

      <div className="mt-5 font-mono text-[10px] tracking-[0.4em] text-accent-gold uppercase">
        Achievement_{number}
      </div>
      <div className="mt-2 font-display text-xl text-gradient-gold leading-tight">
        {title}
      </div>
      <div className="mt-1.5 text-sm text-ink-muted max-w-[230px] leading-relaxed">
        {body}
      </div>
    </motion.div>
  );
}
