import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseService } from '@/lib/supabase';
import { phoneRegex } from '@/lib/validation';

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
  source: z.string().trim().optional()
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

    const supa = getSupabaseService();
    if (!supa) {
      console.warn('[booking] Supabase not configured');
      return NextResponse.json({ ok: true, stored: false });
    }

    const composedMessage = [
      parsed.data.message,
      parsed.data.company_size ? `حجم الشركة: ${parsed.data.company_size}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    try {
      // 1. Create the lead row
      const { data: lead, error: leadErr } = await supa
        .from('leads')
        .insert({
          visitor_id,
          name: parsed.data.name,
          phone: parsed.data.phone,
          city: parsed.data.city ?? null,
          company_type: parsed.data.company_type ?? null,
          selected_package: parsed.data.selected_package ?? null,
          selected_services: parsed.data.selected_services ?? null,
          calculator_result: parsed.data.calculator_result ?? null,
          source: parsed.data.source ?? 'booking-form',
          message: composedMessage || null,
          status: 'new'
        })
        .select('id')
        .single();

      if (leadErr) {
        console.warn('[booking] lead insert failed:', leadErr.message);
        return NextResponse.json({ ok: true, stored: false });
      }

      // 2. Create the booking row, linked to the lead
      const { data: booking, error: bookErr } = await supa
        .from('bookings')
        .insert({
          visitor_id,
          lead_id: lead?.id ?? null,
          name: parsed.data.name,
          phone: parsed.data.phone,
          city: parsed.data.city ?? null,
          selected_package: parsed.data.selected_package ?? null,
          selected_services: parsed.data.selected_services ?? null,
          booking_source: parsed.data.source ?? 'booking-form'
        })
        .select('id')
        .single();

      if (bookErr) {
        console.warn('[booking] booking insert failed:', bookErr.message);
        return NextResponse.json({ ok: true, lead_id: lead?.id });
      }

      return NextResponse.json({
        ok: true,
        lead_id: lead?.id,
        booking_id: booking?.id
      });
    } catch (netErr: any) {
      console.warn('[booking] network error:', netErr?.message);
      return NextResponse.json({ ok: true, stored: false });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}
