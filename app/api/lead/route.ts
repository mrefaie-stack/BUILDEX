import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseService } from '@/lib/supabase';
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

    // Pull visitor_id from cookie/body fallback
    const visitor_id =
      parsed.data.visitor_id || req.cookies.get('visitor_id')?.value || null;

    const supa = getSupabaseService();
    if (!supa) {
      console.warn('[lead] Supabase not configured — lead not stored');
      return NextResponse.json({ ok: true, stored: false });
    }

    try {
      const { data, error } = await supa
        .from('leads')
        .insert({
          visitor_id,
          name: parsed.data.name ?? null,
          phone: parsed.data.phone,
          city: parsed.data.city ?? null,
          company_type: parsed.data.company_type ?? null,
          selected_package: parsed.data.selected_package ?? null,
          selected_services: parsed.data.selected_services ?? null,
          calculator_result: parsed.data.calculator_result ?? null,
          source: parsed.data.source ?? null,
          message: parsed.data.message ?? null,
          status: 'new'
        })
        .select('id')
        .single();

      if (error) {
        console.warn('[lead] supabase error:', error.message);
        // Still respond OK so the user-facing flow continues.
        return NextResponse.json({ ok: true, stored: false });
      }
      return NextResponse.json({ ok: true, id: data?.id });
    } catch (netErr: any) {
      console.warn('[lead] network error:', netErr?.message);
      return NextResponse.json({ ok: true, stored: false });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}
