'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Field, Select } from '@/components/ui/Field';
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { useArsenalStore } from '@/lib/store';
import { useTrackPage } from '@/lib/hooks';
import { trackEvent } from '@/lib/tracking';
import { calculatorLeadSchema } from '@/lib/validation';
import { formatCurrency } from '@/lib/utils';

const COMPANY_TYPES = [
  { value: 'مقاولات', label: 'مقاولات' },
  { value: 'تشطيبات', label: 'تشطيبات' },
  { value: 'مكتب هندسي', label: 'مكتب هندسي' },
  { value: 'عقارات', label: 'عقارات' },
  { value: 'مواد بناء', label: 'مواد بناء' },
  { value: 'شركة تطوير عقاري', label: 'شركة تطوير عقاري' },
  { value: 'أخرى', label: 'أخرى' }
];

export default function CalcLossPage() {
  useTrackPage('visited_calculator', 'calculator');
  const router = useRouter();
  const setResult = useArsenalStore((s) => s.setCalculatorResult);
  const updateLead = useArsenalStore((s) => s.updateLeadData);
  const setSubmitted = useArsenalStore((s) => s.setHasSubmittedLead);
  const leadData = useArsenalStore((s) => s.leadData);

  const [companyType, setCompanyType] = useState('');
  const [valuePerClient, setValuePerClient] = useState('');
  const [lostLeads, setLostLeads] = useState('');
  const [hasWebsite, setHasWebsite] = useState<'yes' | 'no' | ''>('');
  const [hasAds, setHasAds] = useState<'yes' | 'no' | ''>('');
  const [hasSocial, setHasSocial] = useState<'yes' | 'no' | ''>('');
  const [calc, setCalc] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: leadData.name ?? '',
    phone: leadData.phone ?? '',
    city: leadData.city ?? '',
    company_type: companyType,
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const canCalc =
    companyType && Number(valuePerClient) > 0 && Number(lostLeads) > 0;

  const compute = () => {
    if (!canCalc) return;
    let multiplier = 1;
    // Light penalties: missing pillars increase the loss estimate
    if (hasWebsite === 'no') multiplier *= 1.15;
    if (hasAds === 'no') multiplier *= 1.10;
    if (hasSocial === 'no') multiplier *= 1.10;
    const loss = Math.round(
      Number(valuePerClient) * Number(lostLeads) * multiplier
    );
    setCalc(loss);
    setResult(loss);
    trackEvent('calculator_computed', {
      metadata: { loss, companyType }
    });
  };

  const submit = async () => {
    const parsed = calculatorLeadSchema.safeParse({
      ...form,
      company_type: form.company_type || companyType
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
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
          calculator_result: calc,
          source: 'calculator-loss'
        })
      });
      trackEvent('completed_loss_calculator', {
        metadata: { result: calc },
        force: true
      });
      setSubmitted(true);
      router.push('/level-2');
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <LevelHeader
        level="حاسبة الخسارة"
        title="كم تخسر شركتك شهريًا بسبب ضعف حضورها الرقمي؟"
        subtitle="أجب على 6 أسئلة سريعة وسنحسب لك خسارتك التقريبية، ثم نرسل لك تشخيصًا مجانيًا."
        accent="red"
        back={{ href: '/', label: 'العودة للبوابة' }}
      />

      <section className="section">
        <div className="container-tight grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 surface-elevated p-6 md:p-8 rounded-2xl">
            <div className="grid gap-5">
              <Select
                label="1. نوع الشركة"
                value={companyType}
                onChange={(v) => {
                  setCompanyType(v);
                  setForm((f) => ({ ...f, company_type: v }));
                }}
                options={COMPANY_TYPES}
                placeholder="اختر نوع الشركة"
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="2. متوسط قيمة العميل ($)"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={valuePerClient}
                  onChange={(e) => setValuePerClient(e.target.value)}
                  placeholder="مثال: 1500"
                />
                <Field
                  label="3. العملاء المفقودون شهريًا"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={lostLeads}
                  onChange={(e) => setLostLeads(e.target.value)}
                  placeholder="مثال: 10"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <YesNo
                  label="4. هل لديك موقع؟"
                  value={hasWebsite}
                  onChange={setHasWebsite}
                />
                <YesNo
                  label="5. إعلانات ممولة؟"
                  value={hasAds}
                  onChange={setHasAds}
                />
                <YesNo
                  label="6. محتوى سوشيال منتظم؟"
                  value={hasSocial}
                  onChange={setHasSocial}
                />
              </div>

              <button
                disabled={!canCalc}
                onClick={compute}
                className="btn-danger disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                احسب خسارتي الآن
              </button>
            </div>
          </div>

          {/* Result + lead capture */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {calc === null ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="surface p-6 rounded-2xl h-full grid place-items-center text-center"
                >
                  <div>
                    <div className="text-5xl mb-3">⚠</div>
                    <div className="text-ink-muted text-sm">
                      أكمل الأسئلة لرؤية حجم الخسارة الشهرية
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="surface-elevated p-6 rounded-2xl surface-glow"
                >
                  <div className="text-[11px] font-mono tracking-widest text-accent-red mb-2">
                    DIAGNOSTIC.RESULT
                  </div>
                  <div className="text-sm text-ink-muted mb-1">
                    أنت تخسر تقريبًا
                  </div>
                  <div className="font-display text-4xl md:text-5xl text-gradient-red font-extrabold mb-1">
                    {formatCurrency(calc)}
                  </div>
                  <div className="text-sm text-ink-muted">
                    شهريًا بسبب ضعف حضورك الرقمي.
                  </div>

                  <div className="divider-x my-5" />

                  <div className="text-sm text-ink mb-4 font-semibold">
                    نتيجة خسارتك جاهزة
                  </div>
                  <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                    اترك رقمك وسنرسل لك تشخيصًا سريعًا لكيف توقف هذه الخسارة.
                  </p>

                  <div className="grid gap-3">
                    <Field
                      label="الاسم"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="اسمك"
                      error={errors.name}
                    />
                    <Field
                      label="رقم الهاتف"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+963 ..."
                      error={errors.phone}
                    />
                    <Field
                      label="المدينة"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="دمشق / حلب / ..."
                      error={errors.city}
                    />
                    <ConsentCheckbox
                      checked={form.consent}
                      onChange={(b) => setForm({ ...form, consent: b })}
                      error={errors.consent}
                    />
                    <button
                      onClick={submit}
                      disabled={submitting}
                      className="btn-danger"
                    >
                      {submitting ? '...' : 'أوقف الخسارة الآن'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange
}: {
  label: string;
  value: '' | 'yes' | 'no';
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <div>
      <div className="text-xs text-ink-muted mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange('yes')}
          className={`px-3 py-2 rounded-lg text-sm border transition ${
            value === 'yes'
              ? 'bg-accent/15 border-accent/50 text-accent'
              : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/20'
          }`}
        >
          نعم
        </button>
        <button
          onClick={() => onChange('no')}
          className={`px-3 py-2 rounded-lg text-sm border transition ${
            value === 'no'
              ? 'bg-accent-red/15 border-accent-red/50 text-accent-red'
              : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/20'
          }`}
        >
          لا
        </button>
      </div>
    </div>
  );
}
