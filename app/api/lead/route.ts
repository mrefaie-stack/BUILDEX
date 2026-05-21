import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, jsonOrNull, newId } from '@/lib/db';
import { notifyAsync } from '@/lib/email';
import { phoneRegex } from '@/lib/validation';

const schema = z.object({
  visitor_id: z.string().optional(),
  name: z.string().trim().optional(),
  phone: z.string().trim().regex(phoneRegex),
  city: z.string().trim().optional(),
  company_type: z.string().trim().optional(),
  selected_package: z.string().trim().optional(),
  selected_services: z.any().optional(),
  calculator_result: z.number().nullable().optional(),
  source: z.string().trim().optional(),
  message: z.string().trim().optional()
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid payload', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const visitor_id =
      parsed.data.visitor_id || req.cookies.get('visitor_id')?.value || null;

    let id: string | null = null;
    try {
      const db = getDb();
      id = newId();
      db.prepare(
        `INSERT INTO leads
          (id, visitor_id, name, phone, city, company_type, selected_package,
           selected_services, calculator_result, source, message, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
      ).run(
        id,
        visitor_id,
        parsed.data.name ?? null,
        parsed.data.phone,
        parsed.data.city ?? null,
        parsed.data.company_type ?? null,
        parsed.data.selected_package ?? null,
        jsonOrNull(parsed.data.selected_services),
        parsed.data.calculator_result ?? null,
        parsed.data.source ?? null,
        parsed.data.message ?? null
      );
    } catch (e: any) {
      console.warn('[lead] insert failed:', e?.message);
      return NextResponse.json({ ok: true, stored: false });
    }

    // Fire-and-forget email notification
    notifyAsync({
      subject: notifSubjectForLead(parsed.data.source),
      intro:
        parsed.data.source === 'calculator-loss'
          ? 'تم تعبئة حاسبة الخسارة وترك بيانات للتواصل.'
          : parsed.data.source === 'exit-intent'
            ? 'زائر كان على وشك المغادرة وترك بياناته.'
            : parsed.data.source === 'final-battle-modal'
              ? 'طلب عرض مخصص قبل اتخاذ قرار الحجز.'
              : 'تم التقاط بيانات أولية أثناء بناء الترسانة.',
      fields: {
        'الاسم': parsed.data.name,
        'الهاتف': parsed.data.phone,
        'المدينة': parsed.data.city,
        'نوع الشركة': parsed.data.company_type,
        'الباقة المختارة': parsed.data.selected_package,
        'الأسلحة المختارة': formatList(parsed.data.selected_services),
        'الخسارة المحسوبة': parsed.data.calculator_result
          ? `$${parsed.data.calculator_result.toLocaleString()}`
          : null,
        'المصدر': parsed.data.source,
        'visitor_id': visitor_id,
        'lead_id': id
      },
      cta: id
        ? {
            label: 'فتح في لوحة الإدارة',
            url: `https://buildex.mila-knight.com/admin/leads/${id}`
          }
        : undefined
    });

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}

function notifSubjectForLead(source?: string): string {
  if (source === 'calculator-loss') return 'حاسبة خسارة مكتملة';
  if (source === 'exit-intent') return 'لـيد عبر Exit Intent';
  if (source === 'final-battle-modal') return 'طلب عرض قبل القرار النهائي';
  if (source === 'arsenal-modal') return 'لـيد جزئي بعد اختيار سلاحين';
  return 'لـيد جديد';
}

function formatList(v: unknown): string | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  return v.map(String).join('، ');
}
