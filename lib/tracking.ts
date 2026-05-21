'use client';

import { v4 as uuid } from 'uuid';
import { useArsenalStore } from './store';

const VISITOR_KEY = 'milaknight:visitor_id';

export function ensureVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

interface TrackOptions {
  page?: string;
  metadata?: Record<string, unknown>;
  force?: boolean; // bypass cookie consent (e.g. form submissions)
}

export async function trackEvent(
  event: string,
  opts: TrackOptions = {}
): Promise<void> {
  if (typeof window === 'undefined') return;
  const state = useArsenalStore.getState();
  const consent = state.cookieConsent;
  if (consent === 'denied' && !opts.force) return;

  const visitor_id = state.visitorId || ensureVisitorId();
  if (!state.visitorId) state.setVisitorId(visitor_id);

  const payload = {
    visitor_id,
    event_name: event,
    page: opts.page ?? window.location.pathname,
    metadata: opts.metadata ?? null
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      });
      navigator.sendBeacon('/api/track', blob);
      return;
    }
    await fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
      keepalive: true
    });
  } catch {
    /* silent — never block UX on tracking */
  }

  // GA bridge (optional)
  if ((window as any).gtag) {
    (window as any).gtag('event', event, opts.metadata ?? {});
  }
  // Meta Pixel bridge (optional)
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', event, opts.metadata ?? {});
  }
}

export async function upsertVisitor(level?: string) {
  if (typeof window === 'undefined') return;
  const state = useArsenalStore.getState();
  if (state.cookieConsent === 'denied') return;

  const visitor_id = state.visitorId || ensureVisitorId();
  if (!state.visitorId) state.setVisitorId(visitor_id);

  try {
    await fetch('/api/visitor', {
      method: 'POST',
      body: JSON.stringify({
        visitor_id,
        selected_path: state.selectedPath,
        current_level: level ?? state.currentLevel,
        user_agent: navigator.userAgent,
        source: document.referrer || null
      }),
      headers: { 'content-type': 'application/json' },
      keepalive: true
    });
  } catch {
    /* silent */
  }
}
