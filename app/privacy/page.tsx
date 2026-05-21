import { LevelHeader } from '@/components/layout/LevelHeader';

export const metadata = {
  title: 'سياسة الخصوصية',
  description: 'كيف نتعامل مع بيانات الزوار والعملاء على موقع MilaKnight.'
};

export default function PrivacyPage() {
  return (
    <div className="relative">
      <LevelHeader
        level="POLICY"
        title="سياسة الخصوصية"
        subtitle="نحرص على حماية بياناتك واستخدامها فقط لما هو ضروري لمعركتك الرقمية."
      />
      <section className="section">
        <div className="container-tight max-w-3xl">
          <div className="prose prose-invert max-w-none text-ink-muted leading-loose space-y-6">
            <Section title="ما الذي نجمعه؟">
              نقوم بجمع بيانات أساسية مثل الاسم، رقم الهاتف، المدينة، ونوع
              الشركة عند ملء أي نموذج على الموقع. كما نسجل معرّفًا فريدًا للزائر
              في المتصفح (بدون أي بيانات شخصية) لتحسين تجربتك وقياس التفاعل.
            </Section>
            <Section title="كيف نستخدم البيانات؟">
              نستخدم بياناتك للتواصل معك بخصوص خدمات MilaKnight، وإرسال خطة
              مناسبة لشركتك، ولتحسين أداء الموقع. لا نقوم ببيع أو مشاركة بياناتك
              مع أي طرف ثالث لأغراض إعلانية.
            </Section>
            <Section title="ملفات تعريف الارتباط (Cookies)">
              نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك (مثل ترسانتك المختارة)
              وقياس تفاعلك مع الموقع. يمكنك رفض ملفات تعريف الارتباط من خلال
              النافذة التي تظهر في أول زيارة، وسيستمر الموقع بالعمل ولكن لن نسجل
              أحداث القياس.
            </Section>
            <Section title="حقوقك">
              يمكنك في أي وقت طلب حذف بياناتك أو الاستفسار عما نخزّنه عنك عبر
              التواصل المباشر مع الفريق. سنرد على طلبك خلال 48 ساعة.
            </Section>
            <Section title="حماية البيانات">
              جميع البيانات تُخزّن في خوادم آمنة عبر Supabase ومحمية بسياسات
              صارمة على مستوى الصف (RLS). لا يمكن قراءة بيانات العملاء إلا من
              خلال طاقم الإدارة المخوّل.
            </Section>
            <Section title="التواصل">
              لأي استفسار حول الخصوصية، يمكنك التواصل معنا عبر واتساب الموجود في
              صفحة الحجز.
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface rounded-2xl p-6">
      <h2 className="font-display text-xl text-gradient mb-3">{title}</h2>
      <p className="text-sm leading-loose">{children}</p>
    </div>
  );
}
