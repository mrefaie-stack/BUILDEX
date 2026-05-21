'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from '@/components/gate/Particles';
import { LoadingOverlay } from '@/components/gate/LoadingOverlay';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { wait } from '@/lib/utils';

export default function GatePage() {
  const router = useRouter();
  const setPath = useArsenalStore((s) => s.setSelectedPath);
  const [loading, setLoading] = useState<null | { label: string; to: string }>(
    null
  );

  const choose = async (kind: 'dominate' | 'loss') => {
    if (loading) return;
    setPath(kind);
    if (kind === 'dominate') {
      trackEvent('clicked_dominate_path');
      setLoading({ label: 'جاري بناء تجربتك', to: '/level-1' });
    } else {
      trackEvent('clicked_loss_path');
      setLoading({ label: 'جاري حساب خسارتك', to: '/calculator-loss' });
    }
    await wait(1700);
    router.push(kind === 'dominate' ? '/level-1' : '/calculator-loss');
  };

  // Fire once on mount via inline effect
  if (typeof window !== 'undefined' && !(window as any).__milaGateTracked) {
    (window as any).__milaGateTracked = true;
    trackEvent('visited_gate');
  }

  return (
    <div className="relative min-h-[100svh] grid place-items-center overflow-hidden">
      <Particles density={70} />

      {/* corner HUD frame */}
      <Hud />

      <div className="relative z-10 w-full container-tight py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 chip mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono tracking-[0.3em] text-[10px]">
            LEVEL_00 / THE_GATE
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-gradient"
        >
          شركتك جاهزة تنبني رقميًا؟
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 mx-auto max-w-2xl text-base md:text-xl text-ink-muted leading-relaxed"
        >
          اختيارك الآن يحدد هل ستقود السوق… أم تترك عملاءك يذهبون للمنافسين.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto"
        >
          <DecisionCard
            tone="accent"
            badge="مسار الهيمنة"
            title="نعم، أريد أن أسيطر على السوق"
            sub="ابدأ بناء ترسانتك الرقمية الآن"
            onClick={() => choose('dominate')}
          />
          <DecisionCard
            tone="danger"
            badge="مسار الخسارة"
            title="لا، أنا مرتاح بخسارة العملاء"
            sub="احسب كم تخسر كل شهر"
            onClick={() => choose('loss')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-[11px] font-mono tracking-[0.4em] text-ink-dim uppercase"
        >
          MilaKnight — Digital Warfare System
        </motion.div>
      </div>

      <AnimatePresence>
        {loading && <LoadingOverlay label={loading.label} />}
      </AnimatePresence>
    </div>
  );
}

function DecisionCard({
  tone,
  badge,
  title,
  sub,
  onClick
}: {
  tone: 'accent' | 'danger';
  badge: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  const isDanger = tone === 'danger';
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden text-right rounded-2xl surface p-6 md:p-7 border border-white/8 transition"
    >
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${
          isDanger ? 'bg-radial-red' : 'bg-radial-glow'
        }`}
      />
      <div className="relative flex items-start justify-between">
        <span
          className={
            isDanger
              ? 'chip chip-red'
              : 'chip'
          }
        >
          {badge}
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest ${
            isDanger ? 'text-accent-red/80' : 'text-accent/80'
          }`}
        >
          0{isDanger ? '2' : '1'} / 02
        </span>
      </div>
      <div className="relative mt-6 text-xl md:text-2xl font-bold text-ink">
        {title}
      </div>
      <div className="relative mt-2 text-sm text-ink-muted">{sub}</div>

      <div className="relative mt-6 flex items-center justify-between">
        <span
          className={
            isDanger
              ? 'inline-flex items-center gap-2 text-sm text-accent-red font-semibold'
              : 'inline-flex items-center gap-2 text-sm text-accent font-semibold'
          }
        >
          {isDanger ? 'احسب الخسارة' : 'ابدأ المعركة'}
          <span className="transition-transform group-hover:-translate-x-1">←</span>
        </span>
        <div
          className={`h-8 w-8 rounded-full grid place-items-center ${
            isDanger
              ? 'bg-accent-red/15 border border-accent-red/30'
              : 'bg-accent/15 border border-accent/30'
          }`}
        >
          <span
            className={
              isDanger ? 'text-accent-red text-lg' : 'text-accent text-lg'
            }
          >
            ⚔
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Hud() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <div className="absolute left-4 top-4 text-[10px] font-mono tracking-widest text-ink-dim">
        ◢ ENGAGEMENT_READY
      </div>
      <div className="absolute right-4 top-4 text-[10px] font-mono tracking-widest text-ink-dim">
        SYS.v1.0 ◣
      </div>
      <div className="absolute left-4 bottom-4 text-[10px] font-mono tracking-widest text-ink-dim">
        UPLINK_STABLE ◤
      </div>
      <div className="absolute right-4 bottom-4 text-[10px] font-mono tracking-widest text-ink-dim">
        ◥ AWAITING_INPUT
      </div>
    </div>
  );
}
