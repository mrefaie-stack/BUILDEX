'use client';

import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  onChange: (b: boolean) => void;
  error?: string;
}

export function ConsentCheckbox({ checked, onChange, error }: Props) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <span
          className={cn(
            'mt-0.5 grid h-5 w-5 place-items-center rounded-md border transition',
            checked
              ? 'bg-accent border-accent'
              : 'bg-bg-card border-white/15',
            error && !checked && 'border-accent-red/60'
          )}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12 L10 17 L19 7"
                stroke="#02030A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
        </span>
        <span className="text-xs text-ink-muted leading-relaxed">
          أوافق على استخدام بياناتي للتواصل معي بخصوص خدمات MilaKnight وإرسال
          خطة مناسبة لشركتي.
        </span>
      </label>
      {error && (
        <span className="mt-1 block text-xs text-accent-red">{error}</span>
      )}
    </div>
  );
}
