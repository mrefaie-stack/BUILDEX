'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { Countdown } from '@/components/final/Countdown';
import { CapacityBar } from '@/components/final/CapacityBar';
import { SocialProofTicker } from '@/components/final/SocialProofTicker';
import { DelayModal } from '@/components/final/DelayModal';
import { ExitIntentModal } from '@/components/final/ExitIntentModal';
import { ArsenalLeadModal } from '@/components/services/ArsenalLeadModal';
import { useTrackPage } from '@/lib/hooks';
import { trackEvent } from '@/lib/tracking';
import { useArsenalStore } from '@/lib/store';
import { Magnetic } from '@/components/effects/Magnetic';
import { playSound } from '@/lib/sound';

export default function Level5() {
  useTrackPage('visited_level_5', 'level-5');
  const [delayOpen, setDelayOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const hasSubmittedLead = useArsenalStore((s) => s.hasSubmittedLead);

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 05 / المعركة الأخيرة"
        title="قرارك الآن يحدد مستقبل شركتك"
        subtitle="وصلت إلى هنا. رأيت الأرقام، رأيت ما فعلناه لغيرك، ورأيت الأسلحة المتاحة. الآن سؤال واحد فقط:"
        accent="red"
      />

      <section className="section">
        <div className="container-tight grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="surface-elevated rounded-2xl p-6 md:p-8 surface-glow"
            >
              <div className="chip chip-red mb-3">CRITICAL_QUESTION</div>
              <h2 className="font-display text-3xl md:text-4xl text-gradient-red leading-tight">
                هل ستستمر في خسارة العملاء؟
              </h2>
              <p className="mt-4 text-ink-muted leading-relaxed">
                عندما تنتهي الأماكن — لا حجز ولا استثناء. من تأخر ينتظر 3 أشهر
                للدورة القادمة.
              </p>
            </motion.div>

            <div className="surface-elevated rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-widest text-accent uppercase mb-2">
                CAPACITY_BARS
              </div>
              <div className="grid gap-3 mt-2">
                <CapacityBar
                  name="باقة المقاتل"
                  filled={60}
                  remainingLabel="تبقى 4 أماكن فقط"
                />
                <CapacityBar
                  name="باقة المحارب"
                  filled={85}
                  remainingLabel="تبقى مكانان فقط"
                  tone="gold"
                />
                <CapacityBar
                  name="باقة القائد"
                  filled={95}
                  remainingLabel="يكاد ينفد"
                  tone="red"
                />
              </div>
            </div>

            <SocialProofTicker />
          </div>

          <div className="space-y-6">
            <div className="surface-elevated rounded-2xl p-6 text-center">
              <div className="font-mono text-[11px] tracking-widest text-accent-red uppercase mb-3">
                COUNTDOWN
              </div>
              <div className="text-sm text-ink-muted mb-3">
                العرض ينتهي خلال
              </div>
              <Countdown />
            </div>

            <div className="surface-elevated surface-glow rounded-2xl p-6 text-center">
              <h3 className="font-display text-xl text-gradient mb-3">
                اتخذ القرار الآن
              </h3>
              <Magnetic strength={0.2} radius={120}>
                <Link
                  href="/booking"
                  onClick={() => {
                    trackEvent('clicked_final_cta');
                    playSound('confirm');
                  }}
                  onMouseEnter={() => playSound('hover')}
                  className="btn-neon w-full justify-center"
                >
                  ابدأ معركتك ←
                </Link>
              </Magnetic>
              <button
                onClick={() => {
                  setDelayOpen(true);
                  trackEvent('clicked_delay_decision');
                }}
                className="btn-ghost w-full mt-2"
              >
                تأجيل القرار
              </button>
              {!hasSubmittedLead && (
                <button
                  onClick={() => setLeadOpen(true)}
                  className="mt-4 text-xs text-ink-muted underline decoration-dotted hover:text-ink"
                >
                  أو اطلب عرضًا مخصصًا قبل اتخاذ القرار
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <DelayModal open={delayOpen} onClose={() => setDelayOpen(false)} />
      <ExitIntentModal />
      <ArsenalLeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="قبل أن تؤجل القرار"
        body="اترك بياناتك وسنرسل لك عرضًا مناسبًا لحجم معركتك."
        source="final-battle-modal"
      />
    </div>
  );
}
