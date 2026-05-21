# MilaKnight — Digital Warfare

تجربة موقع تفاعلية سينمائية تحوّل زيارة الزائر إلى رحلة معركة رقمية:
بوابة → اختيار مسار → اختيار أسلحة → بناء ترسانة → سجل معارك → المعركة الأخيرة → حجز.

> هذا المشروع ليس موقعًا تقليديًا لوكالة. إنه نظام توليد عملاء محتملين + قياس سلوكي مبني فوق Next.js 14.

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS — ثيم سينمائي داكن مع زجاجية ومُضيئات لطيفة
- Framer Motion — انتقالات، توهج، fold-ins، scroll-storytelling
- Zustand — حالة عالمية + persist عبر localStorage
- React Hook Form + Zod — نماذج موثقة
- Supabase — قاعدة بيانات + RLS
- دعم RTL عربي افتراضيًا
- تتبع زائر مخصص + لوحة إدارة محمية بكلمة مرور

---

## التشغيل

```bash
# 1. ثبّت الاعتمادات
npm install

# 2. انسخ متغيرات البيئة
cp .env.example .env

# 3. (اختياري) اضبط Supabase — انظر قسم Supabase أدناه

# 4. شغّل الـ dev server
npm run dev
```

افتح: http://localhost:3000

---

## Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com)
2. شغّل ملف `supabase/schema.sql` في SQL Editor
3. انسخ القيم إلى `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> الموقع يعمل بشكل طبيعي حتى بدون Supabase — تتبع الأحداث وحفظ leads يصبح عمليات no-op آمنة.

---

## لوحة الإدارة

اضبط متغيرًا:

```env
ADMIN_PASSWORD=change-me-now
```

ثم افتح:

```
/admin/leads
```

لإدخال كلمة المرور وعرض كل العملاء المحتملين، حالاتهم، أحداث زيارتهم، وأحداث التحويل.

---

## بيئة WhatsApp & Calendar

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=963000000000   # رقم بدون "+"
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your/45min
```

عند ضبطها، تظهر:
- أزرار WhatsApp بنص مُجهّز مسبقًا (الاسم/المدينة/الباقة)
- إطار Calendly مدمج في صفحة الحجز

---

## بنية المجلدات

```
app/
  page.tsx                  # Level 0 — Gate
  calculator-loss/          # حاسبة الخسارة
  level-1/                  # من نحن
  level-2/                  # الأسلحة
  level-3/                  # سجل المعارك
  level-4/                  # الباقات
  level-5/                  # المعركة الأخيرة
  booking/                  # الحجز
  confirmation/             # تأكيد الحجز
  privacy/                  # سياسة الخصوصية
  admin/leads/              # لوحة العملاء المحتملين
  api/
    track/                  # POST /api/track
    visitor/                # POST /api/visitor
    lead/                   # POST /api/lead
    booking/                # POST /api/booking
    admin/login/            # POST/DELETE /api/admin/login
    admin/leads/            # GET /api/admin/leads
    admin/leads/[id]/       # GET/PATCH /api/admin/leads/[id]
components/                 # كل المكونات منظمة حسب المجال
data/                       # كل المحتوى قابل للتحرير في ملفات JSON
lib/                        # تجريد Supabase، الحالة، التحقق، الـ tracking
supabase/schema.sql         # سكيمة قاعدة البيانات الكاملة
```

---

## تتبع الزائر

كل زائر يستلم `visitor_id` فريد في localStorage مفعّل تلقائيًا.
الأحداث التي يتم تتبعها بدون أي تدخل من المستخدم:

| Event                              | متى يُطلق |
|-----------------------------------|-----------|
| `visited_gate`                    | فتح الصفحة الرئيسية |
| `clicked_dominate_path`           | زر "أريد أن أسيطر" |
| `clicked_loss_path`               | زر "مرتاح بخسارة العملاء" |
| `visited_calculator`              | فتح صفحة الحاسبة |
| `calculator_computed`             | حساب الخسارة |
| `completed_loss_calculator`       | إرسال نموذج الحاسبة |
| `visited_level_1..5`              | كل مرحلة |
| `opened_weapon_detail`            | فتح Drawer سلاح |
| `added_weapon_to_arsenal`         | إضافة سلاح |
| `removed_weapon_from_arsenal`     | إزالة سلاح |
| `opened_battle_card`              | فتح بطاقة معركة |
| `filtered_battles`                | استخدام فلاتر |
| `selected_package`                | اختيار باقة |
| `used_package_builder`            | تعديل ترسانة مخصصة |
| `clicked_final_cta`               | زر القرار النهائي |
| `clicked_delay_decision`          | زر "تأجيل القرار" |
| `exit_intent_shown`               | محاولة مغادرة Level 5 |
| `submitted_partial_lead`          | نموذج capture داخل اللعبة |
| `submitted_booking_form`          | نموذج الحجز |
| `clicked_whatsapp`                | زر WhatsApp |
| `booked_calendar_call`            | فتح Calendly |
| `viewed_calendar_embed`           | تحميل إطار Calendly |

> الأحداث تُرسل عبر `navigator.sendBeacon` ولا تُعطّل الواجهة أبدًا.

---

## نقاط Lead Capture الذكية

1. **بعد إضافة سلاحين** — modal ناعم: *ترسانتك بدأت تتشكل*
2. **بعد حساب الخسارة** — نموذج فوري: *نتيجة خسارتك جاهزة*
3. **قبل اتخاذ القرار في Level 5** — modal مخصص أو exit-intent

عند الإرسال يتم ربط:
- الترسانة الحالية
- الباقة المحددة
- نتيجة الحاسبة
- المصدر / الصفحة

---

## الموافقة والخصوصية

- بانر cookies سفلي عند أول زيارة
- إذا رفض الزائر cookies، لا تُرسل أحداث تتبع بعد ذلك (إلا الأحداث التي تتطلب `force: true` مثل إرسال النماذج)
- `/privacy` يحتوي على نص سياسة خصوصية كامل بالعربية

---

## التحرير

كل المحتوى الرئيسي يعيش في:

```
data/weapons.json         # الأسلحة (الخدمات)
data/battles.json         # المعارك (دراسات الحالة)
data/packages.json        # الباقات + خدمات الـ Builder
data/social-proof.json    # الـ ticker على Level 5
data/cities.json          # نقاط الخريطة
```

غيّر القيم وأعد التشغيل — لا حاجة لتعديل أي كود React.

---

## الأداء

- جميع الصور تستخدم `next/image` عند الحاجة
- canvas الجسيمات يحترم `prefers-reduced-motion`
- الـ tracking يستخدم `sendBeacon` مع keepalive
- البنية meets LCP < 2.5s على hardware عادي

---

## ملاحظة معمارية

البنية تتبع فصلاً واضحًا بين:
- المحتوى (`/data/*.json`)
- الحالة (`/lib/store.ts`)
- التتبع (`/lib/tracking.ts`)
- الـ API (`/app/api/*`)
- العرض (`/components/*` + `/app/*`)

هذا يجعل أي تعديل (نص، باقة، سلاح، معركة) آمنًا بدون لمس الكود.
