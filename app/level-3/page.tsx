'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import weapons from '@/data/weapons.json';
import packagesJson from '@/data/packages.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { WeaponCard } from '@/components/services/WeaponCard';
import { WeaponDetailDrawer } from '@/components/services/WeaponDetailDrawer';
import { PackageCard } from '@/components/packages/PackageCard';
import { PackageBuilder } from '@/components/packages/PackageBuilder';
import { ArsenalLeadModal } from '@/components/services/ArsenalLeadModal';
import type { Package, Weapon } from '@/lib/types';
import { useTrackPage } from '@/lib/hooks';
import { useArsenalStore } from '@/lib/store';

export default function Level3() {
  useTrackPage('visited_level_3', 'level-3');
  const packages = packagesJson.packages as Package[];

  const [active, setActive] = useState<Weapon | null>(null);

  const selected = useArsenalStore((s) => s.selectedWeapons);
  const arsenalCaptureSeen = useArsenalStore((s) => s.arsenalCaptureSeen);
  const markSeen = useArsenalStore((s) => s.markArsenalCaptureSeen);
  const hasSubmittedLead = useArsenalStore((s) => s.hasSubmittedLead);
  const [leadOpen, setLeadOpen] = useState(false);

  // Once the visitor builds an arsenal of 2+ weapons, offer a tailored quote (once).
  useEffect(() => {
    if (selected.length >= 2 && !arsenalCaptureSeen && !hasSubmittedLead) {
      const t = setTimeout(() => setLeadOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [selected.length, arsenalCaptureSeen, hasSubmittedLead]);

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 03 / متجر الأسلحة"
        title="أسلحة المعركة"
        subtitle="كل خدمة = سلاح بهدف ومدة ونتيجة. تعرّف على الأسلحة بالتفصيل، ثم اختر باقة جاهزة أو ابنِ ترسانتك الخاصة سلاحًا بسلاح وشاهد التكلفة الشهرية لحظيًا."
        accent="gold"
      />

      {/* ---- A) Service details (showcase) ---- */}
      <section className="section pb-0">
        <div className="container-tight">
          <div className="font-mono text-[11px] tracking-[0.4em] text-accent uppercase mb-2">
            ARSENAL_BRIEFING
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-gradient mb-6">
            تعرّف على الأسلحة
          </h2>
        </div>
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
      </section>

      {/* ---- B) Ready-made packages ---- */}
      <section className="section">
        <div className="container-tight">
          <div className="font-mono text-[11px] tracking-[0.4em] text-accent uppercase mb-2">
            READY_LOADOUTS
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-gradient mb-6">
            باقات جاهزة
          </h2>
        </div>
        <div className="container-tight grid gap-5 lg:grid-cols-3">
          {packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>

        <div className="container-tight mt-12">
          <div className="relative my-2 flex items-center gap-4">
            <div className="divider-x" />
            <span className="shrink-0 text-xs font-mono tracking-[0.3em] text-ink-dim uppercase">
              أو
            </span>
            <div className="divider-x" />
          </div>
        </div>

        {/* ---- C) Custom build (selection) ---- */}
        <div id="arsenal-builder" className="container-tight mt-6 scroll-mt-24">
          <PackageBuilder />
        </div>

        <div className="container-tight mt-14">
          <div className="surface-elevated surface-glow rounded-2xl p-8 md:p-10 text-center">
            <h3 className="font-display text-2xl md:text-3xl text-gradient mb-3">
              ترسانتك جاهزة. القرار الآن.
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              اعبر إلى المعركة الأخيرة — وحدد ما إذا كنت ستبدأ اليوم أم تترك المنافس يسبقك.
            </p>
            <Link href="/level-4" className="btn-primary">
              انتقل إلى Level 4 ←
            </Link>
          </div>
        </div>
      </section>

      <WeaponDetailDrawer weapon={active} onClose={() => setActive(null)} />

      <ArsenalLeadModal
        open={leadOpen}
        onClose={() => {
          setLeadOpen(false);
          markSeen();
        }}
      />
    </div>
  );
}
