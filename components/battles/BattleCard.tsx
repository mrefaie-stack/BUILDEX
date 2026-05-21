'use client';

import { motion } from 'framer-motion';
import type { Battle } from '@/lib/types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { cn } from '@/lib/utils';

interface Props {
  battle: Battle;
  active: boolean;
  onSelect: () => void;
  index: number;
}

export function BattleCard({ battle, active, onSelect, index }: Props) {
  return (
    <motion.button
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={cn(
        'group text-right surface rounded-2xl p-5 transition border w-full',
        active
          ? 'border-accent/60 shadow-glow surface-glow'
          : 'border-white/8 hover:border-white/20'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn('chip', active && 'chip-gold')}>{battle.code}</span>
        <div className="font-mono text-[10px] tracking-widest text-ink-dim">
          {battle.city}
        </div>
      </div>
      <div className="text-lg font-bold text-ink">{battle.title}</div>
      <div className="text-sm text-ink-muted mt-1">{battle.client}</div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {battle.results.map((r) => (
          <div key={r.label} className="surface rounded-lg p-3 text-center">
            <div
              className={cn(
                'font-display text-xl',
                r.direction === 'up'
                  ? 'text-accent-green'
                  : r.direction === 'down'
                    ? 'text-accent-red'
                    : 'text-ink'
              )}
            >
              {r.value}
            </div>
            <div className="text-[10px] text-ink-dim mt-1">{r.label}</div>
          </div>
        ))}
      </div>

      {active && battle.before && battle.after && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <BeforeAfterSlider before={battle.before} after={battle.after} />
          <div className="grid gap-3 mt-4 text-sm">
            <Block label="التحدي" value={battle.challenge} />
            <Block label="الخطة" value={battle.approach} />
            <Block label="النتيجة" value={battle.outcome} />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest text-accent uppercase mb-1">
        {label}
      </div>
      <div className="text-sm text-ink leading-relaxed">{value}</div>
    </div>
  );
}
