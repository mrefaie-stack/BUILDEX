'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LeadRecord } from '@/lib/types';
import { LeadsTable } from './LeadsTable';

export function LeadsClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    fetch('/api/admin/leads')
      .then(async (r) => {
        if (r.status === 401) {
          router.push('/admin/leads');
          return null;
        }
        return r.json().catch(() => ({ ok: false, error: 'invalid response' }));
      })
      .then((j) => {
        if (!j) return;
        if (!j.ok) {
          setErr(j.error ?? 'failed');
          setLeads([]);
          return;
        }
        setLeads(j.leads ?? []);
        setErr(null);
      })
      .catch(() => {
        setErr('تعذّر الاتصال — جرب التحديث.');
        setLeads([]);
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="container-tight section">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="chip mb-2">ADMIN_DASHBOARD</div>
          <h1 className="font-display text-3xl text-gradient">
            العملاء المحتملون
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            كل العملاء المحتملين الذين تواصلوا عبر الموقع وأحداثهم.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="btn-ghost !py-2 !px-3 !text-sm"
            title="تحديث"
          >
            ↻ تحديث
          </button>
          <button onClick={logout} className="btn-ghost !py-2 !px-3 !text-sm">
            تسجيل خروج
          </button>
        </div>
      </div>

      {err && (
        <div className="surface rounded-xl p-4 text-sm text-accent-red mb-4">
          خطأ: {err}
        </div>
      )}

      {leads === null ? (
        <div className="surface rounded-2xl p-10 text-center text-ink-muted">
          جاري التحميل...
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
