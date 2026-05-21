'use client';

import { Suspense } from 'react';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { BookingForm } from '@/components/booking/BookingForm';
import { useTrackPage } from '@/lib/hooks';

export default function BookingPage() {
  useTrackPage('visited_booking', 'booking');
  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 06 / الحجز"
        title="ابدأ معركتك الآن"
        subtitle="املأ البيانات واختر موعدًا للجلسة. سيصلك تأكيد على هاتفك."
      />

      <section className="section">
        <div className="container-tight grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="surface rounded-2xl p-8">...</div>}>
              <BookingForm />
            </Suspense>
          </div>
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="surface rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-widest text-accent uppercase mb-3">
                MISSION_BRIEF
              </div>
              <ul className="space-y-3 text-sm text-ink">
                <Item>تواصل مباشر مع قائد الفريق خلال 24 ساعة</Item>
                <Item>جلسة تشخيص مجانية لمدة 45 دقيقة</Item>
                <Item>عرض مخصص بناءً على ترسانتك</Item>
                <Item>التزام كامل بالخصوصية والسرية</Item>
              </ul>
            </div>
            <div className="surface rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-widest text-accent-gold uppercase mb-3">
                BOOKING_RULES
              </div>
              <ul className="space-y-2 text-xs text-ink-muted leading-relaxed">
                <li>• المواعيد متاحة من السبت إلى الخميس</li>
                <li>• ساعات العمل: 10 ص — 6 م (توقيت دمشق)</li>
                <li>• الموعد بيتأكد على رقم الهاتف خلال ساعة</li>
                <li>• يمكن تأجيل الموعد بالتواصل مباشرة</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-accent/20 text-accent text-[10px]">
        ✓
      </span>
      <span className="text-ink-muted">{children}</span>
    </li>
  );
}
