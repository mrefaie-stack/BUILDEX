'use client';

import { motion } from 'framer-motion';
import type { Weapon } from '@/lib/types';
import { WeaponIcon } from './WeaponIcon';
import { useArsenalStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Props {
  weapon: Weapon;
  index: number;
  onOpen: () => void;
}

const accentMap: Record<NonNullable<Weapon['accent']>, string> = {
  cyan: 'from-accent/30 to-transparent text-accent',
  blue: 'from-sky-400/30 to-transparent text-sky-300',
  gold: 'from-accent-gold/30 to-transparent text-accent-gold',
  red: 'from-accent-red/30 to-transparent text-accent-red',
  green: 'from-accent-green/30 to-transparent text-accent-green',
  orange: 'from-accent-orange/30 to-transparent text-accent-orange'
};

export function WeaponCard({ weapon, index, onOpen }: Props) {
  const selected = useArsenalStore((s) =>
    s.selectedWeapons.includes(weapon.id)
  );
  const accent = weapon.accent ?? 'cyan';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="group relative text-right surface rounded-2xl p-6 overflow-hidden transition"
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-bl',
          accentMap[accent]
        )}
      />
      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            'grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-bg-card transition',
            'group-hover:shadow-glow',
            accentMap[accent].split(' ')[2]
          )}
        >
          <WeaponIcon name={weapon.icon} className="h-6 w-6" />
        </div>
        <div className="font-mono text-[10px] tracking-widest text-ink-dim">
          W_{index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>
      </div>

      <div className="relative mt-6">
        <div className="text-lg font-bold text-ink">{weapon.weaponTitle}</div>
        <div className="mt-1 text-sm text-ink-muted leading-relaxed">
          {weapon.shortLine}
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between text-sm">
        <span className="text-ink-muted">{weapon.duration}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold transition',
            selected ? 'text-accent-gold' : accentMap[accent].split(' ')[2]
          )}
        >
          {selected ? '✓ في الترسانة' : 'عرض التفاصيل ←'}
        </span>
      </div>
    </motion.button>
  );
}
