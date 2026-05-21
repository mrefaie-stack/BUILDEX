'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import packages from '@/data/packages.json';
import type { BuilderService } from '@/lib/types';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { formatCurrency, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function PackageBuilder() {
  const router = useRouter();
  const setPackage = useArsenalStore((s) => s.setSelectedPackage);
  const services = packages.builderServices as BuilderService[];
  const [chosen, setChosen] = useState<string[]>([]);

  const total = useMemo(
    () =>
      chosen.reduce((sum, id) => {
        const svc = services.find((s) => s.id === id);
        return sum + (svc?.monthly ?? 0);
      }, 0),
    [chosen, services]
  );

  const toggle = (id: string) => {
    setChosen((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
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
            اختر الخدمات وستظهر التكلفة الشهرية التقريبية فورًا.
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
                  ? 'border-accent/60 bg-accent/8 shadow-glow'
                  : 'border-white/8 bg-bg-card hover:border-white/20'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-ink font-medium">{s.label}</div>
                  <div className="text-xs text-ink-muted mt-1">
                    {formatCurrency(s.monthly)} / شهر
                  </div>
                </div>
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-md border transition',
                    active
                      ? 'bg-accent border-accent text-bg-deep'
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
          <div className="text-xs text-ink-muted mb-1">السعر التقريبي</div>
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
