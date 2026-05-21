'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Weapon } from '@/lib/types';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { WeaponIcon } from './WeaponIcon';

interface Props {
  weapon: Weapon | null;
  onClose: () => void;
  onAdded?: () => void;
}

export function WeaponDetailDrawer({ weapon, onClose, onAdded }: Props) {
  const selected = useArsenalStore((s) =>
    weapon ? s.selectedWeapons.includes(weapon.id) : false
  );
  const addWeapon = useArsenalStore((s) => s.addWeapon);
  const removeWeapon = useArsenalStore((s) => s.removeWeapon);

  useEffect(() => {
    if (!weapon) return;
    trackEvent('opened_weapon_detail', { metadata: { id: weapon.id } });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [weapon]);

  return (
    <AnimatePresence>
      {weapon && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-bg-deep/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 bottom-0 right-0 z-[95] w-full sm:max-w-[480px] surface-elevated border-l border-white/10 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-bg-elevated/95 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-bg-card border border-white/10 text-accent">
                  <WeaponIcon name={weapon.icon} className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-ink-dim">
                    WEAPON_DETAIL
                  </div>
                  <div className="font-semibold text-ink">{weapon.name}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="h-8 w-8 grid place-items-center rounded-full border border-white/10 hover:border-white/30 text-ink-muted"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-display text-2xl text-gradient leading-snug">
                  {weapon.weaponTitle}
                </h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  {weapon.description}
                </p>
              </div>

              <div>
                <div className="text-xs font-mono tracking-widest text-accent uppercase mb-3">
                  المزايا
                </div>
                <ul className="space-y-2">
                  {weapon.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat label="المدة" value={weapon.duration} />
                <Stat label="السعر" value={weapon.priceRange} />
              </div>

              <div className="surface rounded-xl p-4">
                <div className="text-xs font-mono tracking-widest text-accent-gold uppercase mb-2">
                  النتيجة المتوقعة
                </div>
                <p className="text-sm text-ink leading-relaxed">
                  {weapon.expectedResult}
                </p>
              </div>

              {selected ? (
                <button
                  onClick={() => {
                    removeWeapon(weapon.id);
                    trackEvent('removed_weapon_from_arsenal', {
                      metadata: { id: weapon.id }
                    });
                  }}
                  className="btn-ghost w-full"
                >
                  إزالة من الترسانة
                </button>
              ) : (
                <button
                  onClick={() => {
                    addWeapon(weapon.id);
                    trackEvent('added_weapon_to_arsenal', {
                      metadata: { id: weapon.id }
                    });
                    onAdded?.();
                  }}
                  className="btn-primary w-full"
                >
                  أضف إلى ترسانتي
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface rounded-xl p-3">
      <div className="text-[11px] text-ink-dim mb-1">{label}</div>
      <div className="text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
