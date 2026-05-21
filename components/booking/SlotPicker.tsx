'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sound';
import type { SlotDay } from '@/lib/slots';

interface Props {
  value: string | null;
  onChange: (iso: string | null) => void;
  error?: string;
}

export function SlotPicker({ value, onChange, error }: Props) {
  const [days, setDays] = useState<SlotDay[] | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error ?? 'failed');
        setDays(j.days);
        if (j.days.length > 0) setActiveDate(j.days[0].date);
      })
      .catch((e) => setLoadErr(e.message ?? 'تعذّر تحميل المواعيد'));
  }, []);

  if (loadErr) {
    return (
      <div className="surface rounded-xl p-4 text-sm text-accent-red">
        تعذّر تحميل المواعيد: {loadErr}
      </div>
    );
  }

  if (!days) {
    return (
      <div className="surface rounded-xl p-6 text-center text-sm text-ink-muted">
        جاري تحميل المواعيد المتاحة...
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="surface rounded-xl p-6 text-center text-sm text-ink-muted">
        لا توجد مواعيد متاحة حاليًا — أرسل الطلب وسنتواصل معك لتحديد الموعد.
      </div>
    );
  }

  const active = days.find((d) => d.date === activeDate) ?? days[0];

  return (
    <div className="surface-elevated rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-accent uppercase mb-1">
            BOOKING_SLOTS
          </div>
          <div className="text-sm text-ink font-semibold">
            اختر موعدًا للجلسة (45 دقيقة)
          </div>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              playSound('tick');
            }}
            className="text-[11px] text-ink-muted hover:text-ink"
          >
            مسح الاختيار
          </button>
        )}
      </div>

      {/* Days strip */}
      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const isActive = d.date === active.date;
          const hasFree = d.slots.some((s) => s.available);
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => {
                setActiveDate(d.date);
                playSound('tick');
              }}
              className={cn(
                'shrink-0 rounded-xl border px-3 py-2 text-center transition min-w-[78px]',
                isActive
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-white/10 bg-bg-card text-ink-muted hover:border-white/25',
                !hasFree && 'opacity-40 cursor-not-allowed'
              )}
              disabled={!hasFree}
            >
              <div className="text-[10px] font-mono tracking-widest opacity-70">
                {d.weekdayLabel}
              </div>
              <div className="text-base font-bold mt-0.5">{d.label}</div>
            </button>
          );
        })}
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {active.slots.map((s) => {
          const selected = value === s.startIso;
          return (
            <motion.button
              key={s.startIso}
              type="button"
              whileHover={s.available ? { y: -2 } : {}}
              disabled={!s.available}
              onClick={() => {
                onChange(s.startIso);
                playSound('select');
              }}
              className={cn(
                'rounded-lg border py-2 text-sm transition font-mono',
                selected
                  ? 'border-accent bg-accent/15 text-accent shadow-glow'
                  : s.available
                    ? 'border-white/10 bg-bg-card text-ink hover:border-accent/40 hover:text-accent'
                    : 'border-white/5 bg-bg-card/50 text-ink-dim cursor-not-allowed line-through'
              )}
              title={s.available ? 'متاح' : 'محجوز'}
            >
              {s.label}
            </motion.button>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 text-xs text-accent-red">{error}</div>
      )}
      {value && (
        <div className="mt-4 surface rounded-lg p-3 text-sm">
          <span className="text-ink-muted">الموعد المختار: </span>
          <span className="text-accent font-medium">
            {active.slots.find((s) => s.startIso === value)?.label}
          </span>
          <span className="text-ink-muted">
            {' '}
            · {active.weekdayLabel} {active.label}
          </span>
        </div>
      )}
    </div>
  );
}
