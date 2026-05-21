'use client';

import Link from 'next/link';
import packagesJson from '@/data/packages.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { PackageCard } from '@/components/packages/PackageCard';
import { PackageBuilder } from '@/components/packages/PackageBuilder';
import type { Package } from '@/lib/types';
import { useTrackPage } from '@/lib/hooks';

export default function Level4() {
  useTrackPage('visited_level_4', 'level-4');
  const packages = packagesJson.packages as Package[];

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 04 / متجر الأسلحة"
        title="اختر ترسانتك"
        subtitle="كل معركة لها أسلحتها — وكل شركة لها حجم حرب مختلف. اختر ترسانتك بحكمة، أو ابنِ ترسانة مخصصة."
        accent="gold"
      />

      <section className="section">
        <div className="container-tight grid gap-5 lg:grid-cols-3">
          {packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>

        <div className="container-tight mt-12">
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
    </div>
  );
}
