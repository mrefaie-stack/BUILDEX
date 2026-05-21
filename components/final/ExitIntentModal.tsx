'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox';
import { finalLeadSchema } from '@/lib/validation';
import { trackEvent } from '@/lib/tracking';
import { useArsenalStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { playSound } from '@/lib/sound';

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const lead = useArsenalStore((s) => s.leadData);
  const updateLead = useArsenalStore((s) => s.updateLeadData);
  const hasSubmittedLead = useArsenalStore((s) => s.hasSubmittedLead);
  const selectedWeapons = useArsenalStore((s) => s.selectedWeapons);
  const selectedPackage = useArsenalStore((s) => s.selectedPackage);
  const calc = useArsenalStore((s) => s.calculatorResult);
  const router = useRouter();

  const [form, setForm] = useState({
    name: lead.name ?? '',
    phone: lead.phone ?? '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (shownOnce || hasSubmittedLead) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 4) {
        setOpen(true);
        setShownOnce(true);
        playSound('warn');
        trackEvent('exit_intent_shown');
        document.removeEventListener('mouseleave', onLeave);
      }
    };
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [shownOnce, hasSubmittedLead]);

  const submit = async () => {
    const parsed = finalLeadSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    updateLead({ name: parsed.data.name, phone: parsed.data.phone });
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          selected_services: selectedWeapons,
          selected_package: selectedPackage,
          calculator_result: calc,
          source: 'exit-intent'
        })
      });
      router.push('/booking');
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[110] bg-bg-deep/85 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-[120] max-w-md mx-auto surface-elevated rounded-2xl p-6 surface-glow"
          >
            <div className="chip chip-red mb-3">EXIT_INTENT</div>
            <h3 className="font-display text-2xl text-gradient-red mb-2">
              قبل أن تغادر المعركة
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              احجز جلسة تشخيص مجانية قبل أن تخسر فرصة هذا الشهر. اترك بياناتك
              وسنرسل لك عرضًا مناسبًا لحجم معركتك.
            </p>
            <div className="grid gap-3">
              <Field
                label="الاسم"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
              <Field
                label="رقم الهاتف"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="+963 ..."
              />
              <ConsentCheckbox
                checked={form.consent}
                onChange={(b) => setForm({ ...form, consent: b })}
                error={errors.consent}
              />
              <div className="grid sm:grid-cols-2 gap-2">
                <button onClick={submit} disabled={busy} className="btn-primary">
                  {busy ? '...' : 'احجز الجلسة'}
                </button>
                <button onClick={() => setOpen(false)} className="btn-ghost">
                  لاحقًا
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
