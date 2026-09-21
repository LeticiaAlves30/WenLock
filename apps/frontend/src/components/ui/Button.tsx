import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
