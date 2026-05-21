'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LevelHeader } from '@/components/layout/LevelHeader';
import { ScrollScene } from '@/components/about/ScrollScene';
import { GlowingMap } from '@/components/about/GlowingMap';
import { FlipCard } from '@/components/about/FlipCard';
import { AchievementBadge } from '@/components/about/AchievementBadge';
import { useTrackPage } from '@/lib/hooks';
import { trackEvent } from '@/lib/tracking';

const TEAM = [
  {
    initials: 'م.ر',
    name: 'محمد رفاعي',
    role: 'القائد العام',
    power: 'الاستراتيجية',
    bio: 'يقود معركة العميل من الفكرة إلى السيطرة على السوق، مع خبرة في تحويل الشركات من حضور صفري إلى مرجع رقمي.',
    accent: 'cyan'
  },
  {
    initials: 'أ.خ',
    name: 'أحمد خليل',
    role: 'مهندس الترسانة',
    power: 'بناء المواقع',
    bio: 'يبني منصات سريعة آمنة جاهزة للتحويل، ويربط كل شيء بنظام قياس دقيق.',
    accent: 'gold'
  },
  {
    initials: 'س.م',
    name: 'سارة منصور',
    role: 'قائدة الإعلانات',
    power: 'القنص الإعلاني',
    bio: 'تصمم حملات تستهدف العميل الحقيقي بدقة، وتخفض التكلفة بنسبة وصلت إلى -62٪.',
    accent: 'red'
  },
  {
    initials: 'ر.ع',
    name: 'رامي العلي',
    role: 'مخرج المعارك',
    power: 'إنتاج الفيديو',
    bio: 'يحوّل قصص العملاء إلى فيديوهات سينمائية تترك أثرًا لا يُنسى.',
    accent: 'cyan'
  }
];

const ACHIEVEMENTS = [
  { icon: '🏆', title: '+50 معركة منتصرة', body: 'مشاريع منفذة بنتائج موثقة عبر المحافظات السورية.' },
  { icon: '⚡', title: '×10 ROAS', body: 'أعلى عائد استثمار حققناه لعميل في 21 يوم فقط.' },
  { icon: '🛡', title: '95% رضا العملاء', body: 'معدل احتفاظ قياسي مقارنة بالسوق.' },
  { icon: '🎯', title: '-62% تكلفة عميل', body: 'تخفيض دائم في تكلفة الاستفسار للعملاء.' },
  { icon: '🚀', title: '+340% استفسارات', body: 'نمو متوسط لأكثر عمليات الإطلاق نجاحًا.' },
  { icon: '👑', title: '#1 في 38 كلمة', body: 'نتائج SEO حققت الصدارة في 38 كلمة مفتاحية.' }
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

      <div className="container-tight">
        <ScrollScene
          index={1}
          eyebrow="Scene 01"
          title="ولدنا من قلب إعادة الإعمار"
          body="من قلب سوريا الجديدة، رأينا الشركات التي تعمل بصمت بينما يأخذ المنافسون مكانها رقميًا. قررنا أن نقدم سلاحًا مختلفًا: تجربة استراتيجية، تنفيذ سريع، ونتائج قابلة للقياس."
          visual={<GlowingMap />}
        />

        <ScrollScene
          flip
          index={2}
          eyebrow="Scene 02"
          title="الفريق الذي يدخل المعركة معك"
          body="كل عضو في الفريق متخصص في سلاح واحد. لا تشتيت ولا واجهات. لكل معركة قائدها، ولكل مرحلة المهنية المسؤولة عنها."
          visual={
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((t) => (
                <FlipCard key={t.name} {...t} />
              ))}
            </div>
          }
        />

        <section className="relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="font-mono text-[11px] tracking-[0.4em] text-accent-gold uppercase mb-2">
              Scene 03
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-gradient-gold leading-tight">
              Achievements Unlocked
            </h3>
            <p className="text-ink-muted mt-3 max-w-xl mx-auto">
              ست إنجازات نفخر بها — معايير عملنا في كل معركة جديدة.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge
                key={a.title}
                icon={a.icon}
                title={a.title}
                body={a.body}
                index={i}
              />
            ))}
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="surface-elevated rounded-2xl p-8 md:p-12 text-center surface-glow">
            <div className="font-mono text-[11px] tracking-[0.4em] text-accent uppercase mb-3">
              NEXT_PHASE
            </div>
            <h3 className="font-display text-2xl md:text-4xl text-gradient mb-3">
              جاهز تختار سلاحك؟
            </h3>
            <p className="text-ink-muted max-w-xl mx-auto mb-6">
              كل معركة تبدأ باختيار السلاح الصحيح. اعبر إلى Level 2 لاستعراض الترسانة.
            </p>
            <Link
              href="/level-2"
              onClick={() => trackEvent('clicked_next_level_2')}
              className="btn-primary"
            >
              انتقل إلى Level 2 ←
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
