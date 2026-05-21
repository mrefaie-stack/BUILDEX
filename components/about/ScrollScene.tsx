'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  index: number;
  eyebrow: string;
  title: string;
  body: string;
  visual?: ReactNode;
  flip?: boolean;
}

export function ScrollScene({ index, eyebrow, title, body, visual, flip }: Props) {
  return (
    <section
      className={cn(
        'relative grid gap-8 md:grid-cols-2 items-center py-16 md:py-24',
        flip && 'md:[&>*:first-child]:order-2'
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: flip ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="font-mono text-[11px] tracking-[0.4em] text-accent mb-2 uppercase">
          {eyebrow}
        </div>
        <h3 className="font-display text-3xl md:text-4xl text-gradient leading-tight mb-4">
          {title}
        </h3>
        <p className="text-ink-muted leading-relaxed text-base md:text-lg max-w-xl">
          {body}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative"
      >
        {visual}
      </motion.div>
    </section>
  );
}
