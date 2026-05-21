'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/ui/Field';

export function LoginCard() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    setBusy(false);
    if (!res.ok) {
      setErr('كلمة المرور غير صحيحة');
      return;
    }
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] grid place-items-center container-tight">
      <form
        onSubmit={submit}
        className="surface-elevated rounded-2xl p-6 md:p-8 w-full max-w-md surface-glow"
      >
        <div className="chip mb-3">ADMIN_LOGIN</div>
        <h1 className="font-display text-2xl text-gradient mb-2">
          لوحة قيادة المعارك
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          أدخل كلمة المرور للوصول إلى لوحة العملاء المحتملين.
        </p>
        <Field
          label="كلمة المرور"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          error={err ?? undefined}
          placeholder="••••••••"
        />
        <button disabled={busy} className="btn-primary mt-4 w-full">
          {busy ? '...' : 'الدخول'}
        </button>
      </form>
    </div>
  );
}
