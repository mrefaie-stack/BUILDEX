'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { LeadRecord, LeadStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'interested',
  'follow_up',
  'converted',
  'rejected'
];

const STATUS_AR: Record<LeadStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  interested: 'مهتم',
  follow_up: 'متابعة',
  converted: 'تم التحويل',
  rejected: 'مرفوض'
};

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: 'bg-accent/15 text-accent border-accent/30',
  contacted: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
  interested: 'bg-accent-gold/15 text-accent-gold border-accent-gold/30',
  follow_up: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
  converted: 'bg-accent-green/15 text-accent-green border-accent-green/30',
  rejected: 'bg-accent-red/15 text-accent-red border-accent-red/30'
};

export function LeadsTable({ leads }: { leads: LeadRecord[] }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesQ =
        !q ||
        [l.name, l.phone, l.city, l.company_type, l.selected_package]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q.toLowerCase()));
      const matchesStatus = filter === 'all' || l.status === filter;
      return matchesQ && matchesStatus;
    });
  }, [leads, q, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث بالاسم / الهاتف / المدينة..."
          className="flex-1 min-w-[220px] rounded-xl bg-bg-card border border-white/10 px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-accent/50"
        />
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={`الكل (${leads.length})`}
          />
          {STATUSES.map((s) => {
            const count = leads.filter((l) => l.status === s).length;
            return (
              <Chip
                key={s}
                active={filter === s}
                onClick={() => setFilter(s)}
                label={`${STATUS_AR[s]} (${count})`}
                tone={s}
              />
            );
          })}
        </div>
      </div>

      <div className="surface-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-[11px] uppercase tracking-widest text-ink-dim border-b border-white/5">
                <Th>الاسم</Th>
                <Th>الهاتف</Th>
                <Th>المدينة</Th>
                <Th>نوع الشركة</Th>
                <Th>الباقة</Th>
                <Th>خسارة محسوبة</Th>
                <Th>المصدر</Th>
                <Th>الحالة</Th>
                <Th>التاريخ</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-white/5 hover:bg-white/2 transition"
                >
                  <Td>
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="text-ink hover:text-accent font-medium"
                    >
                      {l.name || '—'}
                    </Link>
                  </Td>
                  <Td>
                    <a
                      href={`tel:${l.phone}`}
                      className="font-mono text-ink-muted hover:text-ink"
                    >
                      {l.phone}
                    </a>
                  </Td>
                  <Td>{l.city || '—'}</Td>
                  <Td>{l.company_type || '—'}</Td>
                  <Td>{l.selected_package || '—'}</Td>
                  <Td>
                    {l.calculator_result
                      ? `$${Number(l.calculator_result).toLocaleString()}`
                      : '—'}
                  </Td>
                  <Td>{l.source || '—'}</Td>
                  <Td>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]',
                        STATUS_COLOR[l.status]
                      )}
                    >
                      {STATUS_AR[l.status]}
                    </span>
                  </Td>
                  <Td className="text-ink-dim text-xs whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString('ar-SY')}
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-ink-muted text-sm"
                  >
                    لا توجد عملاء محتملون
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-right px-4 py-3 font-medium">{children}</th>;
}
function Td({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn('px-4 py-3 text-ink', className)}>{children}</td>;
}
function Chip({
  active,
  onClick,
  label,
  tone
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone?: LeadStatus;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[12px] transition',
        active
          ? tone
            ? STATUS_COLOR[tone]
            : 'bg-accent/15 border-accent/40 text-accent'
          : 'bg-bg-card border-white/10 text-ink-muted hover:border-white/20'
      )}
    >
      {label}
    </button>
  );
}
