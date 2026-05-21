'use client';

import { trackEvent } from '@/lib/tracking';

export function CalendarEmbed() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;

  if (!url) {
    return (
      <div className="surface rounded-2xl p-8 text-center">
        <div className="font-mono text-[11px] tracking-widest text-accent-gold uppercase mb-2">
          BOOKING_SLOTS
        </div>
        <div className="font-display text-xl text-gradient mb-2">
          احجز جلسة تشخيص مجانية لمدة 45 دقيقة
        </div>
        <p className="text-sm text-ink-muted">
          اربط حساب Calendly عبر متغير NEXT_PUBLIC_CALENDLY_URL في .env
        </p>
      </div>
    );
  }

  return (
    <div className="surface-elevated rounded-2xl p-2 overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="font-mono text-[11px] tracking-widest text-accent-gold uppercase mb-1">
          BOOKING_SLOTS
        </div>
        <div className="font-display text-xl text-gradient">
          احجز جلسة تشخيص مجانية لمدة 45 دقيقة
        </div>
      </div>
      <iframe
        src={url}
        width="100%"
        height="700"
        loading="lazy"
        title="Calendar booking"
        className="rounded-xl border-0"
        onLoad={() => trackEvent('viewed_calendar_embed')}
      />
    </div>
  );
}
