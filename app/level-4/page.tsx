'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import packagesJson from '@/data/packages.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { PackageCard } from '@/components/packages/PackageCard';
import { PackageBuilder } from '@/components/packages/PackageBuilder';
import { ArsenalLeadModal } from '@/components/services/ArsenalLeadModal';
import type { Package } from '@/lib/types';
import { useTrackPage } from '@/lib/hooks';
import { useArsenalStore } from '@/lib/store';

export default function Level4() {
  useTrackPage('visited_level_4', 'level-4');
  const packages = packagesJson.packages as Package[];

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
        level="LEVEL 04 / متجر الأسلحة"
        title="اختر ترسانتك"
        subtitle="هنا تختار. باقة جاهزة تناسب حجم معركتك، أو ابنِ ترسانتك الخاصة سلاحًا بسلاح وشاهد التكلفة الشهرية لحظيًا."
        accent="gold"
      />

      <section className="section">
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

        <div className="container-tight mt-6">
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
            <Link href="/level-5" className="btn-primary">
              انتقل إلى Level 5 ←
            </Link>
          </div>
        </div>
      </section>

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
