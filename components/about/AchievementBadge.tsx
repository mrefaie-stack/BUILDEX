'use client';

import { motion } from 'framer-motion';

interface Props {
  icon: string;
  title: string;
  body: string;
  index: number;
}

export function AchievementBadge({ icon, title, body, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className="surface-elevated rounded-2xl p-5 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, delay: index * 0.12 + 0.1 }}
        className="text-3xl mb-2"
      >
        {icon}
      </motion.div>
      <div className="font-semibold text-ink">{title}</div>
      <div className="text-sm text-ink-muted mt-1 leading-relaxed">{body}</div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: index * 0.12 + 0.4 }}
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent to-accent-gold"
      />
    </motion.div>
  );
}
