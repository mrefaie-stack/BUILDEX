'use client';

import { useEffect, type ReactNode } from 'react';
import { ensureVisitorId, upsertVisitor } from '@/lib/tracking';
import { useArsenalStore } from '@/lib/store';

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const setVisitorId = useArsenalStore((s) => s.setVisitorId);
  const visitorId = useArsenalStore((s) => s.visitorId);
  const consent = useArsenalStore((s) => s.cookieConsent);

  useEffect(() => {
    const id = ensureVisitorId();
    if (!visitorId) setVisitorId(id);
  }, [visitorId, setVisitorId]);

  useEffect(() => {
    if (consent !== 'denied') upsertVisitor();
  }, [consent]);

  return <>{children}</>;
}
