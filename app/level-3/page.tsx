'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import battles from '@/data/battles.json';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { BattleMap } from '@/components/battles/BattleMap';
import { BattleCard } from '@/components/battles/BattleCard';
import type { Battle } from '@/lib/types';
import { useTrackPage } from '@/lib/hooks';
import { trackEvent } from '@/lib/tracking';
import { cn } from '@/lib/utils';

const CITY_FILTERS = ['الكل', 'دمشق', 'حلب', 'حمص', 'اللاذقية', 'طرطوس', 'متعدد'];
const SERVICE_FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'website', label: 'مواقع' },
  { id: 'social', label: 'سوشيال' },
  { id: 'ads', label: 'إعلانات' },
  { id: 'video', label: 'فيديو' },
  { id: 'seo', label: 'SEO' },
  { id: 'consulting', label: 'استشارات' }
];

export default function Level3() {
  useTrackPage('visited_level_3', 'level-3');

  const [city, setCity] = useState('الكل');
  const [service, setService] = useState('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (battles as Battle[]).filter((b) => {
      const cityOk = city === 'الكل' || b.city === city;
      const svcOk = service === 'all' || b.service === service;
      return cityOk && svcOk;
    });
  }, [city, service]);

  const open = (b: Battle) => {
    setActiveId(b.id === activeId ? null : b.id);
    trackEvent('opened_battle_card', { metadata: { id: b.id } });
  };

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 03 / سجل المعارك"
        title="سجل المعارك"
        subtitle="كل مشروع هنا كان معركة. وكل معركة انتهت بانتصار رقمي. اختر معركة لقراءة التفاصيل."
        accent="gold"
      />

      <section className="section">
        <div className="container-tight grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
            <BattleMap
              battles={battles as Battle[]}
              activeId={activeId}
              onSelect={(id) => {
                const b = (battles as Battle[]).find((x) => x.id === id);
                if (b) open(b);
              }}
            />

            <div className="surface rounded-2xl p-4 mt-4">
              <div className="font-mono text-[10px] tracking-widest text-accent uppercase mb-3">
                FILTERS
              </div>
              <div className="text-xs text-ink-muted mb-2">المدينة</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {CITY_FILTERS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCity(c);
                      trackEvent('filtered_battles', {
                        metadata: { city: c, service }
                      });
                    }}
                    className={cn(
                      'px-3 py-1.5 text-[12px] rounded-full border transition',
                      city === c
                        ? 'bg-accent/15 border-accent/50 text-accent'
                        : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/20'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="text-xs text-ink-muted mb-2">السلاح</div>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_FILTERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setService(s.id);
                      trackEvent('filtered_battles', {
                        metadata: { city, service: s.id }
                      });
                    }}
                    className={cn(
                      'px-3 py-1.5 text-[12px] rounded-full border transition',
                      service === s.id
                        ? 'bg-accent-gold/15 border-accent-gold/50 text-accent-gold'
                        : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/20'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid gap-4">
            {filtered.map((b, i) => (
              <BattleCard
                key={b.id}
                battle={b}
                active={activeId === b.id}
                onSelect={() => open(b)}
                index={i}
              />
            ))}
            {filtered.length === 0 && (
              <div className="surface rounded-2xl p-10 text-center text-ink-muted">
                لا توجد معارك ضمن هذا الفلتر — جرب مدينة أو سلاح آخر.
              </div>
            )}
          </div>
        </div>

        <div className="container-tight mt-14">
          <div className="surface-elevated surface-glow rounded-2xl p-8 md:p-10 text-center">
            <h3 className="font-display text-2xl md:text-3xl text-gradient mb-3">
              رأيت المعارك. الآن اختر ترسانتك.
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              متجر الأسلحة في انتظارك — باقات جاهزة + خيار بناء ترسانتك الخاصة.
            </p>
            <Link href="/level-4" className="btn-primary">
              انتقل إلى Level 4 ←
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
