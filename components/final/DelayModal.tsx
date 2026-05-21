'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DelayModal({ open, onClose }: Props) {
  const router = useRouter();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-bg-deep/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-[120] max-w-md mx-auto surface-elevated rounded-2xl p-6 surface-glow"
          >
            <div className="chip chip-red mb-3">⚠ تنبيه استراتيجي</div>
            <h3 className="font-display text-2xl text-gradient-red mb-2">
              كل تأجيل له ثمن
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              المنافس الذي بدأ اليوم، سيسبقك غدًا. هل أنت متأكد أنك تريد الخروج؟
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => {
                  router.push('/booking');
                }}
                className="btn-primary"
              >
                لا، أريد الحجز الآن
              </button>
              <button onClick={onClose} className="btn-ghost">
                نعم، سأؤجل
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
