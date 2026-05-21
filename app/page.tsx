'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroAtmosphere } from '@/components/effects/HeroAtmosphere';
import { LoadingOverlay } from '@/components/gate/LoadingOverlay';
import { Magnetic } from '@/components/effects/Magnetic';
import { SoundToggle } from '@/components/effects/SoundToggle';
import { playSound } from '@/lib/sound';
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
      playSound('confirm');
      trackEvent('clicked_dominate_path');
      setLoading({ label: 'جاري بناء تجربتك', to: '/level-1' });
    } else {
      playSound('warn');
      trackEvent('clicked_loss_path');
      setLoading({ label: 'جاري حساب خسارتك', to: '/calculator-loss' });
    }
    playSound('charge');
    await wait(1700);
    router.push(kind === 'dominate' ? '/level-1' : '/calculator-loss');
  };

  if (typeof window !== 'undefined' && !(window as any).__milaGateTracked) {
    (window as any).__milaGateTracked = true;
    trackEvent('visited_gate');
  }

  return (
    <div className="relative min-h-[100svh] grid place-items-center overflow-hidden bg-bg-deep">
      <HeroAtmosphere />

      {/* Corner HUD frame */}
      <Hud />

      {/* Top-left: gothic "THE GATE" word-mark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="absolute left-6 md:left-10 top-6 md:top-8 z-20 flex items-center gap-3"
      >
        <div className="relative h-8 w-8 grid place-items-center">
          <span className="absolute inset-0 rounded-full bg-accent/15 blur-md" />
          <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none">
            <defs>
              <linearGradient id="swG" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0" stopColor="#FFE9B0" />
                <stop offset="1" stopColor="#8C5A12" />
              </linearGradient>
            </defs>
            <path
              d="M12 2 L13.5 6 L18 4 L16 8.5 L21 10 L17 12 L21 14 L16 15.5 L18 20 L13.5 18 L12 22 L10.5 18 L6 20 L8 15.5 L3 14 L7 12 L3 10 L8 8.5 L6 4 L10.5 6 Z"
              stroke="url(#swG)"
              strokeWidth="0.6"
              fill="url(#swG)"
              fillOpacity="0.18"
            />
          </svg>
        </div>
        <div className="font-gothic text-[1.55rem] md:text-[1.85rem] tracking-[0.18em] leading-none">
          <span className="text-gradient-gold">THE</span>{' '}
          <span className="text-gradient">GATE</span>
        </div>
      </motion.div>

      {/* Top-right: sound toggle + menu hint */}
      <div className="absolute right-6 md:right-10 top-6 md:top-8 z-20 flex items-center gap-3">
        <SoundToggle />
        <div className="hidden md:flex flex-col gap-1.5" aria-hidden>
          <span className="h-[2px] w-6 bg-ink/70" />
          <span className="h-[2px] w-6 bg-ink/70" />
          <span className="h-[2px] w-6 bg-ink/70" />
        </div>
      </div>

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
          initial={{ opacity: 0, y: 30, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0em' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.15]"
          style={{
            textShadow:
              '0 0 24px rgba(0,209,255,0.12), 0 1px 0 rgba(0,0,0,0.6)'
          }}
        >
          <span className="text-gradient">شركتك جاهزة تنبني رقميًا؟</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-6 mx-auto max-w-2xl text-base md:text-xl text-ink-muted leading-relaxed"
        >
          اختيارك الآن يحدد هل ستقود السوق… أم تترك عملاءك يذهبون للمنافسين.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-5"
        >
          <Magnetic strength={0.25} radius={120}>
            <button
              onClick={() => choose('dominate')}
              onMouseEnter={() => playSound('hover')}
              className="btn-neon group text-base md:text-lg"
            >
              <span>نعم، أريد أن أسيطر على السوق</span>
              <ArrowSword />
            </button>
          </Magnetic>
          <Magnetic strength={0.15} radius={90}>
            <button
              onClick={() => choose('loss')}
              onMouseEnter={() => playSound('hover')}
              className="btn-neon-dim text-base md:text-lg"
            >
              لا، أنا مرتاح بخسارة العملاء
            </button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-16 flex items-center justify-center gap-3 text-[10px] font-mono tracking-[0.5em] text-ink-dim uppercase"
        >
          <span className="hidden md:inline-flex h-px w-12 bg-white/15" />
          <span>SCROLL_TO_EXPLORE</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ▾
          </motion.span>
        </motion.div>
      </div>

      {/* Bottom-left status text */}
      <div className="absolute bottom-6 left-6 md:left-10 z-20 text-[10px] font-mono tracking-[0.3em] text-ink-dim hidden md:block">
        MilaKnight · DIGITAL_WARFARE_SYSTEM
      </div>
      <div className="absolute bottom-6 right-6 md:right-10 z-20 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-ink-dim hidden md:flex">
        <span>EXPLORE_THE_GATE</span>
        <span className="h-px w-10 bg-white/15" />
        <span>→</span>
      </div>

      <AnimatePresence>
        {loading && <LoadingOverlay label={loading.label} />}
      </AnimatePresence>
    </div>
  );
}

function ArrowSword() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M3 12 H17 M11 6 L17 12 L11 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Hud() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <Corner pos="left-4 top-4" rotate={0} />
      <Corner pos="right-4 top-4" rotate={90} />
      <Corner pos="right-4 bottom-4" rotate={180} />
      <Corner pos="left-4 bottom-4" rotate={270} />
    </div>
  );
}

function Corner({ pos, rotate }: { pos: string; rotate: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute ${pos} h-6 w-6 text-accent/40`}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      aria-hidden
    >
      <path d="M2 2 H14 M2 2 V14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
