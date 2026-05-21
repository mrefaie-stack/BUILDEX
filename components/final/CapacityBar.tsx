'use client';

import { motion } from 'framer-motion';

interface Props {
  name: string;
  filled: number; // 0..100
  remainingLabel: string;
  tone?: 'accent' | 'gold' | 'red';
}

export function CapacityBar({ name, filled, remainingLabel, tone = 'accent' }: Props) {
  const fillColor =
    tone === 'gold'
      ? 'from-accent-gold to-accent-orange'
      : tone === 'red'
        ? 'from-accent-red to-accent-orange'
        : 'from-accent to-sky-400';

  return (
    <div className="surface rounded-xl p-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <div className="font-medium text-ink">{name}</div>
        <div className="text-xs text-ink-muted">{remainingLabel}</div>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${filled}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${fillColor}`}
        />
      </div>
      <div className="mt-1.5 text-[11px] font-mono text-ink-dim text-left">
        {filled}% ممتلئة
      </div>
    </div>
  );
}
