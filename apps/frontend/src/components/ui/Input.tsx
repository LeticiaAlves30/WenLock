import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, id, label, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? inputId + '-error' : undefined;

  return (
    <label htmlFor={inputId} className="block min-w-0">
      <span className="mb-1 block text-xs font-semibold text-secondary">{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`h-10 w-full border-x-0 border-t-0 border-b border-primary bg-sidebar/[0.035] px-3 text-sm text-content outline-none transition-colors placeholder:text-muted focus:bg-surface focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
        {...props}
      />
      {hint && !error ? <span className="mt-1 block text-right text-[10px] text-muted">{hint}</span> : null}
      {error ? (
        <span id={errorId} role="alert" className="mt-1 block text-xs text-danger">
          {error}
        </span>
      ) : null}
    </label>
  );
});
