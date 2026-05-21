'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import weapons from '@/data/weapons.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { WeaponCard } from '@/components/services/WeaponCard';
import { WeaponDetailDrawer } from '@/components/services/WeaponDetailDrawer';
import { useArsenalToast } from '@/components/services/ArsenalToast';
import { ArsenalLeadModal } from '@/components/services/ArsenalLeadModal';
import type { Weapon } from '@/lib/types';
import { useArsenalStore } from '@/lib/store';
import { useTrackPage } from '@/lib/hooks';

export default function Level2() {
  useTrackPage('visited_level_2', 'level-2');

  const [active, setActive] = useState<Weapon | null>(null);
  const { show, node } = useArsenalToast();
  const selected = useArsenalStore((s) => s.selectedWeapons);
  const arsenalCaptureSeen = useArsenalStore((s) => s.arsenalCaptureSeen);
  const markSeen = useArsenalStore((s) => s.markArsenalCaptureSeen);
  const hasSubmittedLead = useArsenalStore((s) => s.hasSubmittedLead);
  const [leadOpen, setLeadOpen] = useState(false);

  // Trigger lead modal when arsenal reaches 2 weapons (once)
  useEffect(() => {
    if (selected.length >= 2 && !arsenalCaptureSeen && !hasSubmittedLead) {
      const t = setTimeout(() => setLeadOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [selected.length, arsenalCaptureSeen, hasSubmittedLead]);

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 02 / الخدمات"
        title="اختر سلاحك"
        subtitle="الخدمات = أسلحة. اختر ما يناسب معركتك. كل سلاح له هدف، ومدة، ونتيجة متوقعة."
      />

      <section className="section">
        <div className="container-tight grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(weapons as Weapon[]).map((w, i) => (
            <WeaponCard
              key={w.id}
              weapon={w}
              index={i}
              onOpen={() => setActive(w)}
            />
          ))}
        </div>

        <div className="container-tight mt-14">
          <div className="surface-elevated surface-glow rounded-2xl p-8 md:p-10 text-center">
            <div className="font-mono text-[11px] tracking-[0.4em] text-accent uppercase mb-3">
              ARSENAL_STATUS
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-gradient mb-3">
              {selected.length === 0
                ? 'ترسانتك فارغة — ابدأ بانتقاء سلاحك الأول'
                : `لديك ${selected.length} ${
                    selected.length === 1 ? 'سلاح' : 'أسلحة'
                  } في الترسانة`}
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              ترسانتك جاهزة؟ شاهد المعارك التي ربحناها بأسلحة مماثلة.
            </p>
            <Link href="/level-3" className="btn-primary">
              انتقل إلى Level 3 ←
            </Link>
          </div>
        </div>
      </section>

      <WeaponDetailDrawer
        weapon={active}
        onClose={() => setActive(null)}
        onAdded={() => {
          show('تمت إضافة السلاح إلى ترسانتك');
        }}
      />

      <ArsenalLeadModal
        open={leadOpen}
        onClose={() => {
          setLeadOpen(false);
          markSeen();
        }}
      />

      {node}
    </div>
  );
}
