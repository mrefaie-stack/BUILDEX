'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function useArsenalToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);

  const node = (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          className="fixed bottom-24 right-4 md:right-8 z-[80]"
        >
          <div className="surface-elevated rounded-2xl px-4 py-3 shadow-glow flex items-center gap-3 surface-glow">
            <div className="h-8 w-8 rounded-full bg-accent/15 border border-accent/30 grid place-items-center text-accent">
              ⚔
            </div>
            <div className="text-sm text-ink font-medium pr-1">{msg}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { show: setMsg, node };
}
