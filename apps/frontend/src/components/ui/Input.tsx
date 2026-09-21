import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, id, label, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? inputId + '-error' : undefined;

  return (
    <label htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <span id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
});
