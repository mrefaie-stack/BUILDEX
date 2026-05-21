'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useArsenalStore } from '@/lib/store';

export function CookieBanner() {
  const consent = useArsenalStore((s) => s.cookieConsent);
  const set = useArsenalStore((s) => s.setCookieConsent);

  return (
    <AnimatePresence>
      {consent === 'pending' && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-3 left-3 right-3 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
        >
          <div className="surface-elevated p-4 md:p-5 rounded-2xl">
            <div className="text-sm text-ink mb-2 font-semibold">
              ملفات تعريف الارتباط
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل تفاعلك مع الموقع.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => set('granted')}
                className="btn-primary !py-2 !px-4 !text-sm flex-1"
              >
                أوافق
              </button>
              <button
                onClick={() => set('denied')}
                className="btn-ghost !py-2 !px-4 !text-sm"
              >
                إدارة التفضيلات
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
