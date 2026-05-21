'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArsenalStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/level-1', label: 'من نحن' },
  { href: '/level-2', label: 'الخدمات' },
  { href: '/level-3', label: 'سجل المعارك' },
  { href: '/level-4', label: 'الباقات' },
  { href: '/level-5', label: 'المعركة الأخيرة' },
  { href: '/booking', label: 'الحجز' }
];

export function Header() {
  const pathname = usePathname();
  const weapons = useArsenalStore((s) => s.selectedWeapons);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide header entirely on the gate landing — it should feel like a clean threshold.
  if (pathname === '/') return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-md bg-bg/70 border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-lg text-gradient">MilaKnight</div>
            <div className="text-[10px] text-ink-muted tracking-[0.2em] uppercase">
              Digital Warfare
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 text-sm rounded-full transition-colors',
                  active
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-accent/10 border border-accent/30 shadow-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ArsenalCounterPill count={weapons.length} />
          <Link href="/booking" className="btn-primary !py-2 !px-4 !text-sm">
            ابدأ المعركة
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
            className="lg:hidden btn-ghost !p-2"
          >
            <Burger open={open} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/5 bg-bg/95 backdrop-blur-md"
          >
            <div className="container-tight py-3 grid gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-3 py-3 rounded-lg text-sm border border-transparent',
                    pathname.startsWith(n.href)
                      ? 'bg-accent/10 border-accent/30 text-ink'
                      : 'text-ink-muted hover:text-ink hover:bg-white/3'
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-4 w-5">
      <span
        className={cn(
          'absolute right-0 top-0 h-[2px] w-5 bg-ink transition-all',
          open && 'translate-y-[7px] rotate-45'
        )}
      />
      <span
        className={cn(
          'absolute right-0 top-[7px] h-[2px] w-5 bg-ink transition-all',
          open && 'opacity-0'
        )}
      />
      <span
        className={cn(
          'absolute right-0 bottom-0 h-[2px] w-5 bg-ink transition-all',
          open && '-translate-y-[7px] -rotate-45'
        )}
      />
    </div>
  );
}

function ArsenalCounterPill({ count }: { count: number }) {
  return (
    <Link
      href="/level-2"
      aria-label="ترسانتك"
      className="hidden md:inline-flex relative items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-[12px] text-ink hover:border-accent/60 transition"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="text-ink-muted">ترسانتك:</span>
      <motion.span
        key={count}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-mono text-accent"
      >
        {count}
      </motion.span>
      <span className="text-ink-muted">سلاح</span>
    </Link>
  );
}

function Logo() {
  return (
    <div className="relative h-9 w-9">
      <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-accent/40 via-accent/10 to-accent-gold/30 blur-[8px] opacity-80" />
      <div className="relative grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-bg-card">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 21 L3 6 L12 3 L21 6 L21 21 L14 21 L14 14 L10 14 L10 21 Z"
            stroke="url(#g1)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0" stopColor="#00D1FF" />
              <stop offset="1" stopColor="#E6B450" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
