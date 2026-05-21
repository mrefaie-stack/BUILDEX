'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="relative z-10 border-t border-white/5 mt-24">
      <div className="container-tight py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl text-gradient mb-3">MilaKnight</div>
          <p className="text-sm text-ink-muted leading-relaxed">
            نحن لا نبيع خدمات. نخوض معكم معركة السيطرة الرقمية ونحول شركتكم إلى
            قوة لا يمكن تجاوزها.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink mb-3">المراحل</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/level-1" className="hover:text-ink">من نحن</Link></li>
            <li><Link href="/level-2" className="hover:text-ink">الخدمات</Link></li>
            <li><Link href="/level-3" className="hover:text-ink">سجل المعارك</Link></li>
            <li><Link href="/level-4" className="hover:text-ink">الباقات</Link></li>
            <li><Link href="/level-5" className="hover:text-ink">المعركة الأخيرة</Link></li>
            <li><Link href="/booking" className="hover:text-ink">الحجز</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink mb-3">الموارد</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/calculator-loss" className="hover:text-ink">حاسبة الخسارة</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">سياسة الخصوصية</Link></li>
            <li><Link href="/booking" className="hover:text-ink">احجز جلسة تشخيص</Link></li>
          </ul>
        </div>
      </div>
      <div className="divider-x" />
      <div className="container-tight py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-ink-dim">
        <div>© {new Date().getFullYear()} MilaKnight. كل المعارك محفوظة.</div>
        <div className="font-mono tracking-widest">DIGITAL_WARFARE/v1.0</div>
      </div>
    </footer>
  );
}
