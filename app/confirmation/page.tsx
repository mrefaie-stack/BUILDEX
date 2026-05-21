'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useArsenalStore } from '@/lib/store';
import { useTrackPage } from '@/lib/hooks';
import packagesJson from '@/data/packages.json';
import weaponsJson from '@/data/weapons.json';
import type { Package, Weapon } from '@/lib/types';
import { trackEvent } from '@/lib/tracking';
import { buildWaLink } from '@/lib/utils';
import { playSound } from '@/lib/sound';
import { burstAtCenter } from '@/components/effects/Confetti';

export default function ConfirmationPage() {
  useTrackPage('visited_confirmation', 'confirmation');
  useEffect(() => {
    playSound('success');
    burstAtCenter({
      count: 180,
      spread: 180,
      power: 12,
      colors: ['#00D1FF', '#E6B450', '#FFFFFF', '#FF8A3D', '#10B981']
    });
    const t = setTimeout(() => {
      burstAtCenter({ count: 80, spread: 150, power: 9 });
    }, 600);
    return () => clearTimeout(t);
  }, []);
  const pkgId = useArsenalStore((s) => s.selectedPackage);
  const weapons = useArsenalStore((s) => s.selectedWeapons);
  const lead = useArsenalStore((s) => s.leadData);

  const pkg = (packagesJson.packages as Package[]).find((p) => p.id === pkgId);
  const chosenWeapons = (weaponsJson as Weapon[]).filter((w) =>
    weapons.includes(w.id)
  );

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '963000000000';
  const waLink = buildWaLink(
    waNumber,
    `تم حجز معركتي مع MilaKnight. اسمي: ${lead.name || '...'} - الباقة: ${
      pkg?.name || 'مخصصة'
    }`
  );
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div className="relative">
      <section className="section">
        <div className="container-tight text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="mx-auto h-24 w-24 mb-6 grid place-items-center rounded-full border border-accent/40 bg-accent/10 shadow-glow"
          >
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                d="M5 12 L10 17 L19 7"
                stroke="#00D1FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="chip mb-3">MISSION_ACCEPTED</div>
            <h1 className="font-display text-3xl md:text-5xl text-gradient">
              تم استلام طلبك
            </h1>
            <p className="mt-4 text-ink-muted max-w-2xl mx-auto leading-relaxed">
              فريق MilaKnight سيبدأ مراجعة بياناتك، وسيتم التواصل معك قريبًا
              لتحديد الجلسة الأولى وتفعيل خطتك.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto text-right"
          >
            <div className="surface rounded-2xl p-6">
              <div className="font-mono text-[10px] tracking-widest text-accent uppercase mb-2">
                YOUR_PACKAGE
              </div>
              <div className="font-display text-xl text-gradient-gold">
                {pkg ? pkg.name : 'ترسانة مخصصة'}
              </div>
              {pkg && (
                <p className="text-sm text-ink-muted mt-1">{pkg.subtitle}</p>
              )}
            </div>
            <div className="surface rounded-2xl p-6">
              <div className="font-mono text-[10px] tracking-widest text-accent uppercase mb-2">
                YOUR_ARSENAL
              </div>
              {chosenWeapons.length === 0 ? (
                <div className="text-sm text-ink-muted">سنحدد ترسانتك معًا في الجلسة</div>
              ) : (
                <ul className="text-sm text-ink space-y-1">
                  {chosenWeapons.map((w) => (
                    <li key={w.id} className="flex items-center gap-2">
                      <span className="text-accent">▸</span>
                      <span>{w.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('clicked_whatsapp', { force: true })}
              className="btn-gold"
            >
              تواصل عبر واتساب
            </a>
            {calendarUrl && (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('booked_calendar_call', { force: true })}
                className="btn-primary"
              >
                احجز جلسة من التقويم
              </a>
            )}
            <Link href="/" className="btn-ghost">
              العودة للموقع
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
