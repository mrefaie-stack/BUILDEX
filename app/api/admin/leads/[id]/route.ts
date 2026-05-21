import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseService } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = [
  'new',
  'contacted',
  'interested',
  'follow_up',
  'converted',
  'rejected'
] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES)
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supa = getSupabaseService();
  if (!supa) {
    return NextResponse.json({ ok: false, configured: false }, { status: 404 });
  }
  try {
    const { data: lead, error } = await supa
      .from('leads')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    if (!lead) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    let events: any[] = [];
    if (lead.visitor_id) {
      const { data: ev } = await supa
        .from('visitor_events')
        .select('*')
        .eq('visitor_id', lead.visitor_id)
        .order('created_at', { ascending: true })
        .limit(1000);
      events = ev ?? [];
    }

    const { data: bookings } = await supa
      .from('bookings')
      .select('*')
      .eq('lead_id', params.id);

    return NextResponse.json({
      ok: true,
      lead,
      events,
      bookings: bookings ?? []
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unreachable', configured: false },
      { status: 503 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  const supa = getSupabaseService();
  if (!supa) return NextResponse.json({ ok: false, configured: false });
  try {
    const { error } = await supa
      .from('leads')
      .update({ status: parsed.data.status })
      .eq('id', params.id);
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unreachable' },
      { status: 503 }
    );
  }
}
