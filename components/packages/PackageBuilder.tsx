'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import weapons from '@/data/weapons.json';
import { WeaponIcon } from '@/components/services/WeaponIcon';
import type { Weapon } from '@/lib/types';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { playSound } from '@/lib/sound';
import { formatCurrency, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function PackageBuilder() {
  const router = useRouter();
  const setPackage = useArsenalStore((s) => s.setSelectedPackage);
  const chosen = useArsenalStore((s) => s.selectedWeapons);
  const addWeapon = useArsenalStore((s) => s.addWeapon);
  const removeWeapon = useArsenalStore((s) => s.removeWeapon);
  const services = weapons as Weapon[];

  const total = useMemo(
    () =>
      chosen.reduce((sum, id) => {
        const svc = services.find((s) => s.id === id);
        return sum + (svc?.monthly ?? 0);
      }, 0),
    [chosen, services]
  );

  const toggle = (id: string) => {
    if (chosen.includes(id)) {
      removeWeapon(id);
      playSound('deny');
    } else {
      addWeapon(id);
      playSound('select');
    }
    trackEvent('used_package_builder', { metadata: { id } });
  };

  const proceed = () => {
    setPackage('custom');
    router.push(`/booking?package=custom&services=${chosen.join(',')}`);
  };

  return (
    <div className="surface-elevated rounded-2xl p-6 md:p-8 surface-glow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-mono text-[11px] tracking-widest text-accent uppercase mb-2">
            CUSTOM_BUILD
          </div>
          <h3 className="font-display text-2xl text-gradient">
            ابنِ ترسانتك الخاصة
          </h3>
          <p className="text-sm text-ink-muted mt-1">
            اختر الأسلحة التي تناسب معركتك وستظهر التكلفة الشهرية التقريبية فورًا.
          </p>
        </div>
        <div className="chip chip-gold !text-[11px]">⚙ MODULAR</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mt-5">
        {services.map((s) => {
          const active = chosen.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={cn(
                'group relative text-right rounded-xl border p-4 transition',
                active
                  ? 'border-accent/60 bg-accent/10 shadow-glow'
                  : 'border-white/8 bg-bg-card hover:border-white/20'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition',
                      active
                        ? 'border-accent/50 bg-accent/15 text-accent'
                        : 'border-white/10 bg-bg-elevated text-ink-muted'
                    )}
                  >
                    <WeaponIcon name={s.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-ink font-medium">{s.name}</div>
                    <div className="text-xs text-ink-muted mt-1">
                      {formatCurrency(s.monthly)} / شهر
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-md border transition',
                    active
                      ? 'bg-accent border-accent text-white'
                      : 'bg-bg-elevated border-white/15 text-ink-dim'
                  )}
                >
                  {active ? '✓' : '+'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 surface rounded-xl p-4">
        <div>
          <div className="text-xs text-ink-muted mb-1">
            السعر التقريبي {chosen.length > 0 && `(${chosen.length} أسلحة)`}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-display text-3xl text-gradient-gold"
            >
              {formatCurrency(total)} <span className="text-base text-ink-muted">/ شهر</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={proceed}
          disabled={chosen.length === 0}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          أكمل الحجز بهذه الترسانة ←
        </button>
      </div>
    </div>
  );
}
