'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Field, Select, Textarea } from '@/components/ui/Field';
import { ConsentCheckbox } from '@/components/ui/ConsentCheckbox';
import { bookingSchema } from '@/lib/validation';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { buildWaLink } from '@/lib/utils';
import { playSound } from '@/lib/sound';
import { burstAtCenter } from '@/components/effects/Confetti';

const COMPANY_TYPES = [
  { value: 'مقاولات', label: 'مقاولات' },
  { value: 'تشطيبات', label: 'تشطيبات' },
  { value: 'مكتب هندسي', label: 'مكتب هندسي' },
  { value: 'عقارات', label: 'عقارات' },
  { value: 'مواد بناء', label: 'مواد بناء' },
  { value: 'شركة تطوير عقاري', label: 'شركة تطوير عقاري' },
  { value: 'أخرى', label: 'أخرى' }
];

const PACKAGES = [
  { value: 'starter', label: 'المقاتل الجديد' },
  { value: 'warrior', label: 'المحارب' },
  { value: 'supreme', label: 'القائد الأعلى' },
  { value: 'custom', label: 'ترسانة مخصصة' }
];

const SIZES = [
  { value: '1-5', label: '1-5 موظفين' },
  { value: '6-20', label: '6-20 موظفًا' },
  { value: '21-50', label: '21-50 موظفًا' },
  { value: '50+', label: 'أكثر من 50' }
];

export function BookingForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const pkgFromUrl = sp.get('package');
  const servicesFromUrl = sp.get('services');

  const lead = useArsenalStore((s) => s.leadData);
  const updateLead = useArsenalStore((s) => s.updateLeadData);
  const setSubmitted = useArsenalStore((s) => s.setHasSubmittedLead);
  const storeWeapons = useArsenalStore((s) => s.selectedWeapons);
  const storePackage = useArsenalStore((s) => s.selectedPackage);
  const calc = useArsenalStore((s) => s.calculatorResult);

  const [form, setForm] = useState({
    name: lead.name ?? '',
    phone: lead.phone ?? '',
    city: lead.city ?? '',
    company_type: lead.company_type ?? '',
    selected_package: pkgFromUrl ?? storePackage ?? '',
    company_size: '',
    message: '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackEvent('started_booking_form');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    markStarted();
    const parsed = bookingSchema.safeParse(form);
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

    const selected_services = servicesFromUrl
      ? servicesFromUrl.split(',').filter(Boolean)
      : storeWeapons;

    updateLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      city: parsed.data.city,
      company_type: parsed.data.company_type,
      selected_package: parsed.data.selected_package
    });

    try {
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          selected_services,
          calculator_result: calc,
          source: 'booking-form'
        })
      });
      trackEvent('submitted_booking_form', {
        force: true,
        metadata: {
          package: parsed.data.selected_package,
          weapons: selected_services
        }
      });
      setSubmitted(true);
      playSound('success');
      burstAtCenter({
        count: 140,
        spread: 160,
        power: 11,
        colors: ['#00D1FF', '#E6B450', '#FFFFFF', '#FF8A3D']
      });
      setTimeout(() => router.push('/confirmation'), 400);
    } catch {
      setBusy(false);
    }
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '963000000000';
  const waMessage =
    `مرحبًا MilaKnight، أريد بدء معركتي الرقمية. هذه بياناتي: ${
      form.name || '...'
    } - ${form.city || '...'} - ${form.selected_package || '...'}`;
  const waLink = buildWaLink(waNumber, waMessage);

  return (
    <form onSubmit={submit} onChange={markStarted} className="surface-elevated rounded-2xl p-6 md:p-8 grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
        <Field
          label="رقم الهاتف"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          placeholder="+963 ..."
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="المدينة"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          error={errors.city}
          required
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
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="الباقة المختارة"
          value={form.selected_package}
          onChange={(v) => setForm({ ...form, selected_package: v })}
          options={PACKAGES}
          placeholder="اختر باقتك"
          error={errors.selected_package}
        />
        <Select
          label="حجم الشركة"
          value={form.company_size}
          onChange={(v) => setForm({ ...form, company_size: v })}
          options={SIZES}
          placeholder="اختر"
          error={errors.company_size}
        />
      </div>
      <Textarea
        label="رسالتك (اختياري)"
        value={form.message}
        onChange={(v) => setForm({ ...form, message: v })}
        placeholder="أخبرنا عن شركتك وأهدافك في المعركة..."
      />
      <ConsentCheckbox
        checked={form.consent}
        onChange={(b) => setForm({ ...form, consent: b })}
        error={errors.consent}
      />

      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'جاري الإرسال...' : 'أرسل طلب الانضمام للمعركة'}
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('clicked_whatsapp', { force: true })}
          className="btn-gold"
        >
          تواصل عبر واتساب
        </a>
      </div>
    </form>
  );
}
