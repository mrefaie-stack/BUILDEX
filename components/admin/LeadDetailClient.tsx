'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LeadRecord, LeadStatus, VisitorEventRecord } from '@/lib/types';
import { formatSlotLabel } from '@/lib/slots';
import { cn } from '@/lib/utils';

const STATUSES: { id: LeadStatus; label: string }[] = [
  { id: 'new', label: 'جديد' },
  { id: 'contacted', label: 'تم التواصل' },
  { id: 'interested', label: 'مهتم' },
  { id: 'follow_up', label: 'متابعة' },
  { id: 'converted', label: 'تم التحويل' },
  { id: 'rejected', label: 'مرفوض' }
];

interface BookingSummary {
  id: string;
  meeting_at: string | null;
  meeting_duration: number | null;
  booking_source: string | null;
}

export function LeadDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [events, setEvents] = useState<VisitorEventRecord[]>([]);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    fetch(`/api/admin/leads/${id}`)
      .then(async (r) => {
        if (r.status === 401) {
          router.push('/admin/leads');
          return null;
        }
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        if (!j.ok) throw new Error(j.error ?? 'failed');
        setLead(j.lead);
        setEvents(j.events ?? []);
        setBookings(j.bookings ?? []);
      })
      .catch((e) => setErr(e.message));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setStatus = async (status: LeadStatus) => {
    if (!lead) return;
    setBusy(true);
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setBusy(false);
    load();
  };

  if (err) {
    return (
      <div className="container-tight section">
        <Link href="/admin/leads" className="text-accent text-sm">
          ← العودة
        </Link>
        <div className="surface rounded-xl p-6 mt-4 text-accent-red">{err}</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container-tight section">
        <div className="surface rounded-2xl p-10 text-center text-ink-muted">
          جاري التحميل...
        </div>
      </div>
    );
  }

  const services = Array.isArray(lead.selected_services)
    ? lead.selected_services
    : [];

  return (
    <div className="container-tight section">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link
            href="/admin/leads"
            className="text-xs text-accent hover:text-accent/70"
          >
            ← كل العملاء المحتملين
          </Link>
          <h1 className="font-display text-3xl text-gradient mt-2">
            {lead.name || lead.phone}
          </h1>
          <div className="text-xs text-ink-dim mt-1 font-mono">
            {lead.id}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              disabled={busy}
              onClick={() => setStatus(s.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs border transition disabled:opacity-50',
                lead.status === s.id
                  ? 'bg-accent/15 border-accent/50 text-accent'
                  : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/30'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Info label="الاسم" value={lead.name || '—'} />
        <Info label="الهاتف" value={lead.phone} link={`tel:${lead.phone}`} mono />
        <Info label="المدينة" value={lead.city || '—'} />
        <Info label="نوع الشركة" value={lead.company_type || '—'} />
        <Info label="الباقة المختارة" value={lead.selected_package || '—'} />
        <Info
          label="نتيجة الحاسبة"
          value={
            lead.calculator_result
              ? `$${Number(lead.calculator_result).toLocaleString()}`
              : '—'
          }
        />
        <Info label="المصدر" value={lead.source || '—'} />
        <Info
          label="تاريخ الإنشاء"
          value={new Date(lead.created_at).toLocaleString('ar-SY')}
        />
        <Info label="visitor_id" value={lead.visitor_id || '—'} mono />
      </div>

      {services.length > 0 && (
        <div className="surface-elevated rounded-2xl p-5 mb-6">
          <div className="text-xs font-mono tracking-widest text-accent uppercase mb-2">
            SELECTED_SERVICES
          </div>
          <div className="flex flex-wrap gap-1.5">
            {services.map((s, i) => (
              <span key={i} className="chip">
                {String(s)}
              </span>
            ))}
          </div>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="surface-elevated rounded-2xl p-5 mb-6 surface-glow">
          <div className="text-xs font-mono tracking-widest text-accent-gold uppercase mb-3">
            MEETINGS ({bookings.length})
          </div>
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between surface rounded-lg p-3 text-sm"
              >
                <div>
                  <div className="text-ink font-medium">
                    {b.meeting_at
                      ? formatSlotLabel(b.meeting_at)
                      : 'بدون توقيت محدد'}
                  </div>
                  <div className="text-[11px] text-ink-dim mt-0.5 font-mono">
                    {b.booking_source ?? '—'}
                  </div>
                </div>
                {b.meeting_at && (
                  <span className="chip-gold chip !text-[11px]">
                    {b.meeting_duration ?? 45} د
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lead.message && (
        <div className="surface-elevated rounded-2xl p-5 mb-6">
          <div className="text-xs font-mono tracking-widest text-accent uppercase mb-2">
            MESSAGE
          </div>
          <p className="text-sm text-ink whitespace-pre-line leading-relaxed">
            {lead.message}
          </p>
        </div>
      )}

      <div className="surface-elevated rounded-2xl p-5">
        <div className="text-xs font-mono tracking-widest text-accent uppercase mb-3">
          VISITOR_TIMELINE ({events.length})
        </div>
        {events.length === 0 ? (
          <div className="text-sm text-ink-muted">لا توجد أحداث مرتبطة.</div>
        ) : (
          <ol className="relative border-r border-white/10 pe-4">
            {events.map((e) => (
              <li key={e.id} className="relative pr-4 py-2">
                <span className="absolute right-[-5px] top-3 grid h-2.5 w-2.5 place-items-center rounded-full bg-accent shadow-glow" />
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm text-ink font-mono">{e.event_name}</div>
                  <div className="text-[11px] text-ink-dim">
                    {new Date(e.created_at).toLocaleString('ar-SY')}
                  </div>
                </div>
                {e.page && (
                  <div className="text-[11px] text-ink-muted">{e.page}</div>
                )}
                {e.metadata && (
                  <pre className="text-[11px] text-ink-dim bg-bg-card border border-white/5 rounded-md p-2 mt-1 overflow-x-auto font-mono">
                    {JSON.stringify(e.metadata, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  link,
  mono
}: {
  label: string;
  value: string;
  link?: string;
  mono?: boolean;
}) {
  return (
    <div className="surface rounded-xl p-4">
      <div className="text-[10px] font-mono tracking-widest text-ink-dim uppercase mb-1">
        {label}
      </div>
      {link ? (
        <a
          href={link}
          className={cn('text-sm text-ink hover:text-accent', mono && 'font-mono')}
        >
          {value}
        </a>
      ) : (
        <div
          className={cn('text-sm text-ink', mono && 'font-mono text-xs break-all')}
        >
          {value}
        </div>
      )}
    </div>
  );
}
