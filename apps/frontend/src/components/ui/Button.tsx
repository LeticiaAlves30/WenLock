import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, ...props },
  ref,
) {
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});
