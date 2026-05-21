'use client';

import { motion } from 'framer-motion';

export function LoadingOverlay({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-bg-deep/90 backdrop-blur-md"
    >
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
          <div className="font-mono text-[11px] tracking-[0.5em] text-accent uppercase mb-2">
            SYSTEM
          </div>
          <div className="font-display text-2xl text-gradient">{label}</div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden relative">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-accent via-accent/80 to-accent-gold"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
            className="absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-sm"
          />
        </div>
        <div className="mt-3 text-[11px] font-mono text-ink-dim tracking-widest text-center">
          INITIALIZING_ENGAGEMENT_PROTOCOL...
        </div>
      </div>
    </motion.div>
  );
}
