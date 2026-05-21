'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  role: string;
  power: string;
  bio: string;
  initials: string;
  accent?: string;
}

export function FlipCard({ name, role, power, bio, initials, accent = 'cyan' }: Props) {
  const [flipped, setFlipped] = useState(false);

  const gradient =
    accent === 'gold'
      ? 'from-accent-gold/30 via-accent-gold/10 to-transparent'
      : accent === 'red'
        ? 'from-accent-red/30 via-accent-red/10 to-transparent'
        : 'from-accent/30 via-accent/10 to-transparent';

  return (
    <div
      className="group [perspective:1200px] h-72 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d] transition-transform"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 surface-elevated rounded-2xl p-5 [backface-visibility:hidden] flex flex-col items-center justify-center text-center">
          <div
            className={`relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${gradient} mb-4`}
          >
            <div className="absolute inset-0 rounded-full bg-bg-elevated" />
            <div className="relative font-display text-2xl text-gradient">
              {initials}
            </div>
          </div>
          <div className="font-semibold text-ink text-lg">{name}</div>
          <div className="text-sm text-ink-muted mb-2">{role}</div>
          <div className="chip mt-2">⚔ {power}</div>
          <div className="mt-4 text-[10px] font-mono tracking-widest text-ink-dim">
            TAP_TO_REVEAL
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 surface-elevated rounded-2xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
          <div className="font-mono text-[10px] tracking-widest text-accent mb-2">
            CLASS_PROFILE
          </div>
          <div className="font-semibold text-ink mb-2">{name}</div>
          <p className="text-sm text-ink-muted leading-relaxed flex-1">
            {bio}
          </p>
          <div className="mt-3 text-[10px] font-mono tracking-widest text-ink-dim">
            TAP_TO_FLIP_BACK
          </div>
        </div>
      </motion.div>
    </div>
  );
}
