'use client';

import { motion } from 'framer-motion';
import { Tilt } from '@/components/effects/Tilt';

interface Skill {
  label: string;
  level: number; // 0..100
  max?: boolean;
}

interface Props {
  initials: string;
  name: string;
  role: string;
  lvl: number;
  skills: Skill[];
  index: number;
}

export function CharacterCard({
  initials,
  name,
  role,
  lvl,
  skills,
  index
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
    >
      <Tilt max={10} scale={1.02} glare>
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1322] to-[#04080F] border border-accent-gold/15 overflow-hidden shadow-elevated">
          {/* corner ornament — top-left + top-right */}
          <CornerOrnament className="left-2 top-2" />
          <CornerOrnament className="right-2 top-2" flip />

          {/* LVL badge */}
          <div className="absolute right-3 top-3">
            <div className="flex items-center gap-1 rounded-md border border-accent-gold/40 bg-bg-deep/60 px-2 py-0.5 backdrop-blur">
              <span className="text-[9px] font-mono text-accent-gold tracking-widest">
                LVL
              </span>
              <span className="text-[12px] font-display text-accent-gold">{lvl}</span>
            </div>
          </div>

          {/* Avatar area */}
          <div className="relative h-44 grid place-items-center overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-deep to-transparent" />
            <div className="absolute inset-0 opacity-25"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 30%, rgba(0,209,255,0.45), transparent 60%)'
              }}
            />
            {/* hexagonal frame for initials */}
            <div className="relative">
              <svg width="120" height="130" viewBox="0 0 120 130" fill="none">
                <defs>
                  <linearGradient id={`hex-${name}`} x1="0" y1="0" x2="120" y2="130">
                    <stop offset="0" stopColor="#FFE9B0" />
                    <stop offset="1" stopColor="#8C5A12" />
                  </linearGradient>
                </defs>
                <polygon
                  points="60,8 110,38 110,92 60,122 10,92 10,38"
                  fill="rgba(255,255,255,0.02)"
                  stroke={`url(#hex-${name})`}
                  strokeWidth="1.2"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="font-display text-3xl text-gradient-gold">
                  {initials}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pb-5 pt-2">
            <div className="text-center mb-3 border-b border-accent-gold/15 pb-3">
              <div className="font-display text-lg text-ink">{name}</div>
              <div className="text-[11px] text-accent-gold/80 tracking-[0.2em] mt-0.5 font-mono">
                {role}
              </div>
            </div>
            <ul className="space-y-2">
              {skills.map((s) => (
                <li key={s.label} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono tracking-widest text-ink-muted text-[10px] uppercase">
                      ▸ {s.label}
                    </span>
                    {s.max && (
                      <span className="rounded px-1.5 py-0.5 text-[9px] font-mono tracking-widest bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                        MAX
                      </span>
                    )}
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-accent-gold to-accent-orange"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* corner ornament — bottom */}
          <CornerOrnament className="left-2 bottom-2" rotate />
          <CornerOrnament className="right-2 bottom-2" rotate flip />
        </div>
      </Tilt>
    </motion.div>
  );
}

function CornerOrnament({
  className,
  flip,
  rotate
}: {
  className?: string;
  flip?: boolean;
  rotate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute h-4 w-4 text-accent-gold/60 ${
        className ?? ''
      }`}
      style={{
        transform: `${flip ? 'scaleX(-1)' : ''} ${rotate ? 'rotate(180deg)' : ''}`
      }}
      fill="none"
      aria-hidden
    >
      <path d="M2 2 H10 M2 2 V10" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="2" cy="2" r="1" fill="currentColor" />
    </svg>
  );
}
