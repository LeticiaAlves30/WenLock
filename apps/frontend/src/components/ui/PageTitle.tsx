import type { ReactNode } from 'react';

type PageTitleProps = {
  children: ReactNode;
};

export function PageTitle({ children }: PageTitleProps) {
  return <h1>{children}</h1>;
}
