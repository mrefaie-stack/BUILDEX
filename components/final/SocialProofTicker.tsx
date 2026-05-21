'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import messages from '@/data/social-proof.json';

export function SocialProofTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const i = window.setInterval(() => {
      setIdx((c) => (c + 1) % messages.length);
    }, 4500);
    return () => window.clearInterval(i);
  }, []);

  const m = messages[idx];

  return (
    <div className="surface rounded-2xl p-4 md:p-5 flex items-center gap-3">
      <div className="relative grid h-9 w-9 place-items-center rounded-full bg-accent/10 border border-accent/30">
        <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-accent/60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
      </div>
      <div className="overflow-hidden flex-1 min-w-0">
        <div className="text-[10px] font-mono tracking-widest text-ink-dim">
          LIVE_ACTIVITY
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-ink truncate"
          >
            {m.text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
