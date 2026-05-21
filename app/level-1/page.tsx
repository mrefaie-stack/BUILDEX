'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { GlowingMap } from '@/components/about/GlowingMap';
import { CharacterCard } from '@/components/about/CharacterCard';
import { MedallionBadge } from '@/components/about/MedallionBadge';
import { Magnetic } from '@/components/effects/Magnetic';
import { useTrackPage } from '@/lib/hooks';
import { trackEvent } from '@/lib/tracking';
import { playSound } from '@/lib/sound';

const TEAM = [
  {
    initials: 'م.ر',
    name: 'محمد رفاعي',
    role: 'STRATEGY · LEADERSHIP · VISION',
    lvl: 92,
    skills: [
      { label: 'STRATEGY', level: 100, max: true },
      { label: 'LEADERSHIP', level: 100, max: true },
      { label: 'VISION', level: 96 }
    ]
  },
  {
    initials: 'أ.خ',
    name: 'أحمد خليل',
    role: 'OPERATIONS · PROCESS · EXECUTION',
    lvl: 87,
    skills: [
      { label: 'OPERATIONS', level: 95 },
      { label: 'PROCESS', level: 100, max: true },
      { label: 'EXECUTION', level: 92 }
    ]
  },
  {
    initials: 'س.م',
    name: 'سارة منصور',
    role: 'TECHNOLOGY · INNOVATION · SECURITY',
    lvl: 89,
    skills: [
      { label: 'TECHNOLOGY', level: 100, max: true },
      { label: 'INNOVATION', level: 94 },
      { label: 'SECURITY', level: 88 }
    ]
  },
  {
    initials: 'ر.ع',
    name: 'رامي العلي',
    role: 'PRODUCTION · STORYTELLING · CRAFT',
    lvl: 85,
    skills: [
      { label: 'PRODUCTION', level: 93 },
      { label: 'STORYTELLING', level: 100, max: true },
      { label: 'CRAFT', level: 90 }
    ]
  }
];

const ACHIEVEMENTS = [
  {
    icon: <span>🏆</span>,
    number: '01',
    title: '+50 معركة منتصرة',
    body: 'مشاريع منفذة بنتائج موثقة عبر المحافظات السورية.'
  },
  {
    icon: <span>$</span>,
    number: '02',
    title: 'مليون دولار',
    body: 'إجمالي قيمة الفرص التي حققناها لعملائنا.'
  },
  {
    icon: <span>🌍</span>,
    number: '03',
    title: '3 دول',
    body: 'نخدم عملاء في سوريا، السعودية، والإمارات.'
  }
];

export default function Level1() {
  useTrackPage('visited_level_1', 'level-1');

  return (
    <div className="relative">
      <LevelHeader
        level="LEVEL 01 / من نحن"
        title="قصة البطل"
        subtitle="لسنا وكالة تقليدية. نحن فريق يدخل معك معركة السيطرة الرقمية — من اللحظة الأولى حتى تحويل شركتك إلى قوة لا يمكن تجاوزها."
      />

      {/* Vertical numerals + scenes */}
      <div className="container-tight">
        {/* Scene 01 */}
        <Scene num="01" eyebrow="Scene 01" title="ولدنا من قلب إعادة الإعمار">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-ink-muted leading-relaxed text-base md:text-lg max-w-xl">
                من قلب سوريا الجديدة، رأينا الشركات تعمل بصمت بينما يأخذ
                المنافسون مكانها رقميًا. قررنا أن نقدم سلاحًا مختلفًا: تجربة
                استراتيجية، تنفيذ سريع، ونتائج قابلة للقياس.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <ScrollIndicator />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <GlowingMap />
            </motion.div>
          </div>
        </Scene>

        {/* Scene 02 — character cards */}
        <Scene
          num="02"
          eyebrow="Scene 02"
          title="فريق الأبطال"
          sub="قادة مهمتنا لصناعة الفارق"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-ink-muted leading-relaxed text-base mb-8 max-w-xl"
          >
            فريق متكامل من الخبراء المهنيين بعقلين خبرة وشغف لتحقيق رؤيتك
            وكشف نقاط قوتك واستثمارها.
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t, i) => (
              <CharacterCard
                key={t.name}
                initials={t.initials}
                name={t.name}
                role={t.role}
                lvl={t.lvl}
                skills={t.skills}
                index={i}
              />
            ))}
          </div>
        </Scene>

        {/* Scene 03 — achievements */}
        <Scene num="03" eyebrow="Scene 03" title="إنجازاتنا" sub="محطات نعتز بها">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-ink-muted leading-relaxed text-base mb-12 max-w-xl"
          >
            كل إنجاز هنا خطوة جديدة نحو مستقبل أكثر تأثيرًا واستدامة.
          </motion.p>
          <div className="font-mono text-[10px] tracking-[0.5em] text-accent-gold/70 text-center mb-8">
            ━━━━ ACHIEVEMENTS UNLOCKED ━━━━
          </div>
          <div className="grid gap-10 md:grid-cols-3 max-w-4xl mx-auto py-6">
            {ACHIEVEMENTS.map((a, i) => (
              <MedallionBadge
                key={a.title}
                icon={a.icon}
                number={a.number}
                title={a.title}
                body={a.body}
                index={i}
              />
            ))}
          </div>
        </Scene>

        {/* CTA */}
        <section className="py-12 md:py-20">
          <div className="surface-elevated rounded-2xl p-8 md:p-12 text-center surface-glow">
            <div className="font-mono text-[11px] tracking-[0.4em] text-accent uppercase mb-3">
              NEXT_PHASE
            </div>
            <h3 className="font-display text-2xl md:text-4xl text-gradient mb-3">
              جاهز تختار سلاحك؟
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              كل معركة تبدأ باختيار السلاح الصحيح. اعبر إلى Level 2 لاستعراض
              الترسانة.
            </p>
            <Magnetic strength={0.25} radius={120}>
              <Link
                href="/level-2"
                onClick={() => {
                  trackEvent('clicked_next_level_2');
                  playSound('select');
                }}
                onMouseEnter={() => playSound('hover')}
                className="btn-neon"
              >
                انتقل إلى Level 2
                <span className="text-base">←</span>
              </Link>
            </Magnetic>
          </div>
        </section>
      </div>
    </div>
  );
}

function Scene({
  num,
  eyebrow,
  title,
  sub,
  children
}: {
  num: string;
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative py-16 md:py-24 border-t border-accent-gold/10 first:border-t-0">
      {/* Numeral on the left (LTR), but in RTL it shows on the right which is fine */}
      <div className="absolute right-0 top-16 hidden lg:block">
        <div className="font-display text-7xl text-gradient-gold opacity-30 select-none">
          {num}
        </div>
      </div>
      <div className="lg:pr-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="font-mono text-[11px] tracking-[0.4em] text-accent-gold/80 uppercase mb-2">
            {eyebrow}
          </div>
          <h3 className="font-display text-3xl md:text-5xl text-gradient-gold leading-tight">
            {title}
          </h3>
          {sub && (
            <div className="mt-2 text-lg text-ink-muted">{sub}</div>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function ScrollIndicator() {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.4em] text-ink-dim uppercase">
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ▾
      </motion.span>
      <span>SCROLL</span>
    </div>
  );
}
