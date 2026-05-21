'use client';

import { motion } from 'framer-motion';

/**
 * Ambient cinematic background:
 *  - faint grid
 *  - soft animated radial glows
 *  - subtle film noise (via CSS)
 */
export function BgEffects() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-40 h-[40rem] w-[40rem] rounded-full bg-accent/15 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-accent-gold/10 blur-3xl"
      />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
