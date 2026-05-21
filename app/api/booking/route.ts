import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb, jsonOrNull, newId } from '@/lib/db';
import { notifyAsync } from '@/lib/email';
import { phoneRegex } from '@/lib/validation';
import { formatSlotLabel, SLOT_DURATION_MIN } from '@/lib/slots';

const schema = z.object({
  visitor_id: z.string().optional(),
  name: z.string().trim().min(2),
  phone: z.string().trim().regex(phoneRegex),
  city: z.string().trim().optional(),
  company_type: z.string().trim().optional(),
  selected_package: z.string().trim().optional(),
  selected_services: z.any().optional(),
  company_size: z.string().optional(),
  calculator_result: z.number().nullable().optional(),
  message: z.string().trim().optional().or(z.literal('')),
  source: z.string().trim().optional(),
  meeting_at: z.string().optional() // ISO timestamp of chosen slot
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

    const composedMessage = [
      parsed.data.message,
      parsed.data.company_size ? `حجم الشركة: ${parsed.data.company_size}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    let leadId: string | null = null;
    let bookingId: string | null = null;

    try {
      const db = getDb();

      // If a meeting slot was chosen, lock it via a transaction so two
      // simultaneous bookings can't grab the same time.
      const insert = db.transaction(() => {
        if (parsed.data.meeting_at) {
          const taken = db
            .prepare(
              'SELECT id FROM bookings WHERE meeting_at = ? LIMIT 1'
            )
            .get(parsed.data.meeting_at);
          if (taken) {
            throw new Error('SLOT_TAKEN');
          }
        }

        leadId = newId();
        db.prepare(
          `INSERT INTO leads
            (id, visitor_id, name, phone, city, company_type, selected_package,
             selected_services, calculator_result, source, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
        ).run(
          leadId,
          visitor_id,
          parsed.data.name,
          parsed.data.phone,
          parsed.data.city ?? null,
          parsed.data.company_type ?? null,
          parsed.data.selected_package ?? null,
          jsonOrNull(parsed.data.selected_services),
          parsed.data.calculator_result ?? null,
          parsed.data.source ?? 'booking-form',
          composedMessage || null
        );

        bookingId = newId();
        db.prepare(
          `INSERT INTO bookings
            (id, visitor_id, lead_id, name, phone, city, selected_package,
             selected_services, booking_source, meeting_at, meeting_duration)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          bookingId,
          visitor_id,
          leadId,
          parsed.data.name,
          parsed.data.phone,
          parsed.data.city ?? null,
          parsed.data.selected_package ?? null,
          jsonOrNull(parsed.data.selected_services),
          parsed.data.source ?? 'booking-form',
          parsed.data.meeting_at ?? null,
          SLOT_DURATION_MIN
        );
      });

      insert();
    } catch (e: any) {
      if (e?.message === 'SLOT_TAKEN') {
        return NextResponse.json(
          { ok: false, error: 'slot_taken' },
          { status: 409 }
        );
      }
      console.warn('[booking] write failed:', e?.message);
      return NextResponse.json({ ok: true, stored: false });
    }

    const meetingLabel = parsed.data.meeting_at
      ? formatSlotLabel(parsed.data.meeting_at)
      : null;

    notifyAsync({
      subject: parsed.data.meeting_at
        ? 'حجز meeting جديد'
        : 'طلب حجز جديد (بدون توقيت)',
      intro: parsed.data.meeting_at
        ? `تم حجز جلسة تشخيص لمدة ${SLOT_DURATION_MIN} دقيقة.`
        : 'تم استلام طلب حجز جديد — لم يتم اختيار توقيت بعد.',
      fields: {
        'الاسم': parsed.data.name,
        'الهاتف': parsed.data.phone,
        'المدينة': parsed.data.city,
        'نوع الشركة': parsed.data.company_type,
        'حجم الشركة': parsed.data.company_size,
        'الباقة': parsed.data.selected_package,
        'الأسلحة': formatList(parsed.data.selected_services),
        'الخسارة المحسوبة': parsed.data.calculator_result
          ? `$${parsed.data.calculator_result.toLocaleString()}`
          : null,
        'الموعد المقترح': meetingLabel,
        'رسالة العميل': parsed.data.message,
        'lead_id': leadId,
        'booking_id': bookingId
      },
      cta: leadId
        ? {
            label: 'فتح في لوحة الإدارة',
            url: `https://buildex.mila-knight.com/admin/leads/${leadId}`
          }
        : undefined
    });

    return NextResponse.json({
      ok: true,
      lead_id: leadId,
      booking_id: bookingId,
      meeting_label: meetingLabel
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}

function formatList(v: unknown): string | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  return v.map(String).join('، ');
}
