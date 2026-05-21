import nodemailer, { type Transporter } from 'nodemailer';

let _transport: Transporter | null = null;
let _configChecked = false;

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}

function getConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.NOTIFY_EMAIL || 'mrefaie@milaknights.com';

  if (!host || !port || !user || !pass || !from) return null;
  return { host, port, user, pass, from, to };
}

function getTransport(): Transporter | null {
  if (_transport) return _transport;
  const cfg = getConfig();
  if (!cfg) {
    if (!_configChecked) {
      _configChecked = true;
      console.warn(
        '[email] SMTP not configured — set SMTP_HOST/PORT/USER/PASS/FROM in .env'
      );
    }
    return null;
  }
  _transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465, // SSL for 465, STARTTLS otherwise
    auth: { user: cfg.user, pass: cfg.pass }
  });
  return _transport;
}

export interface NotifyPayload {
  subject: string;
  /** Plain summary lines, rendered as a key/value table. */
  fields: Record<string, string | number | null | undefined>;
  /** Optional free-form intro paragraph above the table. */
  intro?: string;
  /** Optional CTA — a button at the bottom. */
  cta?: { label: string; url: string };
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHtml(p: NotifyPayload): string {
  const rows = Object.entries(p.fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:8px 12px;background:#0F1424;border:1px solid #1f2937;color:#9CA3AF;font-size:13px;width:170px;">${escape(k)}</td>
          <td style="padding:8px 12px;background:#080A12;border:1px solid #1f2937;color:#F5F7FB;font-size:14px;">${escape(String(v))}</td>
        </tr>`
    )
    .join('');

  const ctaHtml = p.cta
    ? `
      <a href="${escape(p.cta.url)}"
         style="display:inline-block;padding:12px 22px;border-radius:10px;background:linear-gradient(135deg,#00D1FF,#007BFF);color:#02030A;text-decoration:none;font-weight:700;letter-spacing:.02em;margin-top:20px;">
        ${escape(p.cta.label)}
      </a>`
    : '';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="margin:0;padding:24px;background:#05070D;font-family:'Segoe UI',Cairo,Arial,sans-serif;color:#F5F7FB;">
  <div style="max-width:640px;margin:0 auto;background:#0A0E1A;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
    <div style="padding:18px 22px;background:linear-gradient(135deg,rgba(0,209,255,0.18),rgba(230,180,80,0.12));border-bottom:1px solid #1f2937;">
      <div style="font-size:11px;letter-spacing:.4em;color:#00D1FF;font-family:Consolas,monospace;">BUILDEX · NEW_INTERACTION</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px;">${escape(p.subject)}</div>
    </div>
    <div style="padding:22px;">
      ${p.intro ? `<p style="margin:0 0 16px;color:#A6ADBB;line-height:1.7;">${escape(p.intro)}</p>` : ''}
      <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;">
        ${rows}
      </table>
      ${ctaHtml}
    </div>
    <div style="padding:14px 22px;border-top:1px solid #1f2937;color:#6B7280;font-size:11px;font-family:Consolas,monospace;letter-spacing:.2em;">
      BUILDEX · MILA-KNIGHT.COM · ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
    </div>
  </div>
</body>
</html>`;
}

function renderText(p: NotifyPayload): string {
  const lines = [
    `BUILDEX — ${p.subject}`,
    p.intro ? '' : null,
    p.intro ?? null,
    '',
    '--- Details ---',
    ...Object.entries(p.fields)
      .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
      .map(([k, v]) => `${k}: ${v}`),
    p.cta ? '' : null,
    p.cta ? `${p.cta.label}: ${p.cta.url}` : null
  ].filter((l) => l !== null);
  return lines.join('\n');
}

/**
 * Send an interaction notification. Fire-and-forget: errors are swallowed
 * so they never propagate to the user-facing request.
 */
export async function notify(p: NotifyPayload): Promise<boolean> {
  try {
    const tx = getTransport();
    if (!tx) return false;
    const cfg = getConfig()!;
    await tx.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject: `[BUILDEX] ${p.subject}`,
      html: renderHtml(p),
      text: renderText(p)
    });
    return true;
  } catch (e: any) {
    console.warn('[email] send failed:', e?.message);
    return false;
  }
}

/**
 * Fire-and-forget wrapper — never awaited from request handlers so a slow
 * SMTP server can't delay a form submission response.
 */
export function notifyAsync(p: NotifyPayload) {
  notify(p).catch(() => {});
}
