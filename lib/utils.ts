import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD') {
  if (Number.isNaN(value)) return '0';
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value);
  return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`;
}

export function formatPhoneForWa(phone: string) {
  return phone.replace(/[^0-9]/g, '');
}

// ---- MILA KNIGHT public contact number ----
/** Digits-only number for wa.me / tel: links. */
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966560004773';
/** Human-readable form for display (LTR). */
export const CONTACT_PHONE_DISPLAY = '+966 56 000 4773';

export function buildWaLink(number: string, message: string) {
  return `https://wa.me/${formatPhoneForWa(number)}?text=${encodeURIComponent(
    message
  )}`;
}

// Tiny generic delay
export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
