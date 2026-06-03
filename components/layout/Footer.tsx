'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { buildWaLink, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from '@/lib/utils';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="relative z-10 border-t border-white/5 mt-24">
      <div className="container-tight py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Image
              src="/logo-mark.png"
              alt="MILA KNIGHT"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div className="font-display text-2xl font-extrabold tracking-tight leading-none">
              <span className="text-accent">MILA</span>{' '}
              <span className="text-ink">KNIGHT</span>
            </div>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">
            نحن لا نبيع خدمات. نخوض معكم معركة السيطرة الرقمية ونحول شركتكم إلى
            قوة لا يمكن تجاوزها.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href={`tel:+${CONTACT_PHONE}`}
              dir="ltr"
              className="inline-flex items-center gap-2 self-start font-mono text-accent hover:text-accent-light transition"
            >
              <span aria-hidden>📞</span> {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={buildWaLink(
                CONTACT_PHONE,
                'مرحبًا MILA KNIGHT، أريد التواصل بخصوص خدماتكم.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start text-ink-muted hover:text-ink transition"
            >
              <span aria-hidden>💬</span> تواصل عبر واتساب
            </a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink mb-3">المراحل</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/level-1" className="hover:text-ink">من نحن</Link></li>
            <li><Link href="/level-2" className="hover:text-ink">سجل المعارك</Link></li>
            <li><Link href="/level-3" className="hover:text-ink">الخدمات والباقات</Link></li>
            <li><Link href="/level-4" className="hover:text-ink">المعركة الأخيرة</Link></li>
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
        <div>© {new Date().getFullYear()} MILA KNIGHT. كل المعارك محفوظة.</div>
        <div className="font-mono tracking-widest text-accent/70">MILA_KNIGHT/v1.0</div>
      </div>
    </footer>
  );
}
