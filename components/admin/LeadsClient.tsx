'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LeadRecord } from '@/lib/types';
import { LeadsTable } from './LeadsTable';

export function LeadsClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

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
          setConfigured(false);
          setLeads([]);
          return;
        }
        setLeads(j.leads ?? []);
        setConfigured(j.configured ?? true);
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

      {configured === false && (
        <SupabaseSetupCard />
      )}

      {err && configured !== false && (
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

function SupabaseSetupCard() {
  return (
    <div className="surface-elevated rounded-2xl p-6 mb-6 surface-glow">
      <div className="flex items-start gap-3 mb-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-xl">
          ⚙
        </div>
        <div>
          <div className="font-display text-xl text-gradient-gold">
            Supabase لم يتم ربطه بعد
          </div>
          <p className="text-sm text-ink-muted mt-1 leading-relaxed">
            الموقع شغّال طبيعي للزوار، لكن حفظ العملاء المحتملين معطّل حاليًا.
            اربط Supabase وستظهر الـ leads هنا تلقائيًا.
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-3 text-sm text-ink-muted">
        <Step n="1" t="أنشئ مشروعًا على supabase.com">
          سجّل دخول وأنشئ project جديد (مجاني). من Settings → API انسخ:
          <code className="block mt-1 font-mono text-[12px] text-accent">
            Project URL · anon public key · service_role key
          </code>
        </Step>
        <Step n="2" t="شغّل ملف Schema">
          من SQL Editor في Supabase، انسخ والصق محتوى الملف
          <code className="font-mono text-accent"> supabase/schema.sql </code>
          من الريبو وشغّله (يُنشئ 4 جداول مع RLS policies).
        </Step>
        <Step n="3" t="حدّث ملف .env على السيرفر">
          <code className="block mt-1 whitespace-pre-wrap font-mono text-[12px] text-accent leading-relaxed">
{`ssh root@72.61.162.106
nano /root/buildex/.env

# عدّل هذه السطور:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

pm2 restart buildex --update-env`}
          </code>
        </Step>
        <Step n="4" t="حدّث الصفحة">
          ارجع إلى لوحة الإدارة، اضغط <b>↻ تحديث</b>. ستظهر الـ leads فور وصولها.
        </Step>
      </ol>
    </div>
  );
}

function Step({
  n,
  t,
  children
}: {
  n: string;
  t: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold shrink-0">
        {n}
      </span>
      <div className="flex-1">
        <div className="text-ink font-medium">{t}</div>
        <div className="text-ink-muted text-[13px] mt-1">{children}</div>
      </div>
    </li>
  );
}
