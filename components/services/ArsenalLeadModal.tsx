'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Field, Select } from '@/components/ui/Field';
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox';
import { useArsenalStore } from '@/lib/store';
import { arsenalLeadSchema } from '@/lib/validation';
import { trackEvent } from '@/lib/tracking';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
  source?: string;
}

const COMPANY_TYPES = [
  { value: 'مقاولات', label: 'مقاولات' },
  { value: 'تشطيبات', label: 'تشطيبات' },
  { value: 'مكتب هندسي', label: 'مكتب هندسي' },
  { value: 'عقارات', label: 'عقارات' },
  { value: 'مواد بناء', label: 'مواد بناء' },
  { value: 'شركة تطوير عقاري', label: 'شركة تطوير عقاري' },
  { value: 'أخرى', label: 'أخرى' }
];

export function ArsenalLeadModal({
  open,
  onClose,
  title = 'ترسانتك بدأت تتشكل',
  body = 'اكتب بياناتك وسنرسل لك خطة المعركة المناسبة لشركتك.',
  source = 'arsenal-modal'
}: Props) {
  const lead = useArsenalStore((s) => s.leadData);
  const updateLead = useArsenalStore((s) => s.updateLeadData);
  const setSubmitted = useArsenalStore((s) => s.setHasSubmittedLead);
  const selectedWeapons = useArsenalStore((s) => s.selectedWeapons);
  const calc = useArsenalStore((s) => s.calculatorResult);
  const selectedPackage = useArsenalStore((s) => s.selectedPackage);

  const [form, setForm] = useState({
    name: lead.name ?? '',
    phone: lead.phone ?? '',
    city: lead.city ?? '',
    company_type: lead.company_type ?? '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const parsed = arsenalLeadSchema.safeParse(form);
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
    updateLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      city: parsed.data.city,
      company_type: parsed.data.company_type
    });
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          selected_services: selectedWeapons,
          selected_package: selectedPackage,
          calculator_result: calc,
          source
        })
      });
      trackEvent('submitted_partial_lead', {
        metadata: { source, weapons: selectedWeapons.length },
        force: true
      });
      setSubmitted(true);
      onClose();
    } finally {
      setBusy(false);
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
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-bg-deep/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-[120] mx-auto max-w-md surface-elevated rounded-2xl p-6 surface-glow"
          >
            <div className="flex items-start justify-between">
              <div className="chip">PARTIAL_LEAD_CAPTURE</div>
              <button
                onClick={onClose}
                className="h-7 w-7 rounded-full border border-white/10 grid place-items-center text-ink-muted hover:text-ink"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            <h3 className="font-display text-2xl text-gradient mt-3">
              {title}
            </h3>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              {body}
            </p>

            <div className="grid gap-3 mt-5">
              <Field
                label="الاسم"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                placeholder="اسمك الكامل"
              />
              <Field
                label="رقم الهاتف"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="+963 ..."
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="المدينة"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  error={errors.city}
                  placeholder="دمشق / حلب ..."
                />
                <Select
                  label="نوع الشركة"
                  value={form.company_type}
                  onChange={(v) => setForm({ ...form, company_type: v })}
                  options={COMPANY_TYPES}
                  placeholder="اختر"
                  error={errors.company_type}
                />
              </div>
              <ConsentCheckbox
                checked={form.consent}
                onChange={(b) => setForm({ ...form, consent: b })}
                error={errors.consent}
              />
              <button
                onClick={submit}
                disabled={busy}
                className="btn-primary w-full mt-2 disabled:opacity-60"
              >
                {busy ? '...' : 'احفظ خطتي'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
