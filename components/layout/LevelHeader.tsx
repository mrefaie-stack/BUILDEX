'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  level: string;
  title: string;
  subtitle?: string;
  accent?: 'cyan' | 'gold' | 'red';
  back?: { href: string; label: string };
}

export function LevelHeader({ level, title, subtitle, accent = 'cyan', back }: Props) {
  const accentClass =
    accent === 'gold'
      ? 'text-gradient-gold'
      : accent === 'red'
        ? 'text-gradient-red'
        : 'text-gradient';

  return (
    <section className="relative pt-12 md:pt-16">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span
            className={cn(
              'chip font-mono tracking-widest',
              accent === 'gold' && 'chip-gold',
              accent === 'red' && 'chip-red'
            )}
          >
            {level}
          </span>
          {back && (
            <Link
              href={back.href}
              className="text-xs text-ink-muted hover:text-ink transition"
            >
              ← {back.label}
            </Link>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className={cn(
            'mt-4 text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-tight',
            accentClass
          )}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-base md:text-lg text-ink-muted max-w-3xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        <div className="divider-x mt-8" />
      </div>
    </section>
  );
}
