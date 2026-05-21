'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Package } from '@/lib/types';
import { useArsenalStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { formatCurrency, cn } from '@/lib/utils';

interface Props {
  pkg: Package;
  index: number;
}

export function PackageCard({ pkg, index }: Props) {
  const router = useRouter();
  const setPackage = useArsenalStore((s) => s.setSelectedPackage);
  const current = useArsenalStore((s) => s.selectedPackage);
  const isSelected = current === pkg.id;

  const choose = () => {
    setPackage(pkg.id);
    trackEvent('selected_package', { metadata: { package: pkg.id } });
    router.push(`/booking?package=${pkg.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={cn(
        'relative surface rounded-2xl p-6 md:p-7 transition',
        pkg.popular && 'surface-glow border-accent/40'
      )}
    >
      {pkg.popular && (
        <div className="absolute -top-3 right-6">
          <div className="chip chip-gold !text-[11px]">★ الأكثر شعبية</div>
        </div>
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px] tracking-widest text-accent uppercase">
          {pkg.code}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-ink-dim">
          P_0{index + 1}
        </span>
      </div>
      <div className="font-display text-2xl md:text-3xl text-gradient">
        {pkg.name}
      </div>
      <div className="text-sm text-ink-muted mt-1 mb-5">{pkg.subtitle}</div>

      <div className="flex items-baseline gap-2 mb-4">
        <div
          className={cn(
            'font-display text-4xl font-extrabold',
            pkg.popular ? 'text-gradient' : 'text-ink'
          )}
        >
          {formatCurrency(pkg.price, pkg.currency)}
        </div>
        <div className="text-sm text-ink-muted">{pkg.cycle}</div>
        {pkg.oldPrice && (
          <div className="ms-2 text-sm text-ink-dim line-through">
            {formatCurrency(pkg.oldPrice, pkg.currency)}
          </div>
        )}
      </div>

      <p className="text-sm text-ink-muted leading-relaxed mb-5">
        {pkg.description}
      </p>

      <ul className="space-y-2 mb-6">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-accent/15 text-accent text-[10px]">
              ✓
            </span>
            <span className="text-ink">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={choose}
        className={cn(
          'w-full',
          pkg.popular ? 'btn-primary' : 'btn-ghost',
          isSelected && 'btn-gold'
        )}
      >
        {isSelected ? '✓ مختارة — تابع للحجز' : pkg.ctaLabel}
      </button>
    </motion.div>
  );
}
