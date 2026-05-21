'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, rightSlot, className, ...rest },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm text-ink mb-2 font-medium">
          {label}
        </span>
      )}
      <span className="relative block">
        <input
          ref={ref}
          {...rest}
          className={cn(
            'w-full rounded-xl bg-bg-card border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-dim outline-none transition focus:border-accent/50 focus:bg-bg-elevated',
            error && 'border-accent-red/60 focus:border-accent-red/80',
            rightSlot && 'pl-12',
            className
          )}
        />
        {rightSlot && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm">
            {rightSlot}
          </span>
        )}
      </span>
      {error ? (
        <span className="mt-1 block text-xs text-accent-red">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-dim">{hint}</span>
      ) : null}
    </label>
  );
});

interface SelectProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  value,
  onChange,
  options,
  placeholder
}: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm text-ink mb-2 font-medium">
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-xl bg-bg-card border border-white/10 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50',
          error && 'border-accent-red/60'
        )}
      >
        {placeholder && (
          <option value="" disabled className="bg-bg-card">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-card">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 block text-xs text-accent-red">{error}</span>
      )}
    </label>
  );
}

interface TextareaProps {
  label?: string;
  error?: string;
  rows?: number;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}

export function Textarea({
  label,
  error,
  rows = 4,
  value,
  onChange,
  placeholder
}: TextareaProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm text-ink mb-2 font-medium">
          {label}
        </span>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full rounded-xl bg-bg-card border border-white/10 px-4 py-3 text-sm text-ink placeholder:text-ink-dim outline-none transition focus:border-accent/50 focus:bg-bg-elevated resize-none',
          error && 'border-accent-red/60'
        )}
      />
      {error && (
        <span className="mt-1 block text-xs text-accent-red">{error}</span>
      )}
    </label>
  );
}
