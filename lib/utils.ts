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

export function buildWaLink(number: string, message: string) {
  return `https://wa.me/${formatPhoneForWa(number)}?text=${encodeURIComponent(
    message
  )}`;
}

// Tiny generic delay
export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
