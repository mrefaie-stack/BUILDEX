'use client';

import Link from 'next/link';
import { useState } from 'react';
import weapons from '@/data/weapons.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { WeaponCard } from '@/components/services/WeaponCard';
import { WeaponDetailDrawer } from '@/components/services/WeaponDetailDrawer';
import type { Weapon } from '@/lib/types';
import { useTrackPage } from '@/lib/hooks';

export default function Level2() {
  useTrackPage('visited_level_2', 'level-2');

  const [active, setActive] = useState<Weapon | null>(null);

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 02 / الخدمات"
        title="تعرّف على الأسلحة"
        subtitle="الخدمات = أسلحة. كل سلاح له هدف، ومدة، ونتيجة متوقعة. استعرض الترسانة كاملة — وعندما تكون جاهزًا، تختار أسلحتك وتبني باقتك في متجر الأسلحة (Level 4)."
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
              NEXT_PHASE
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-gradient mb-3">
              عرفت الأسلحة؟ شوف المعارك اللي ربحناها بها
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              قبل ما تختار ترسانتك، شاهد نتائج حقيقية حقّقناها لشركات مثل شركتك.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/level-3" className="btn-primary">
                انتقل إلى Level 3 ←
              </Link>
              <Link href="/level-4" className="btn-ghost">
                أو ابدأ ببناء ترسانتك مباشرة
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WeaponDetailDrawer weapon={active} onClose={() => setActive(null)} />
    </div>
  );
}
