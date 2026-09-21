import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <main className="min-h-[calc(100vh-4rem)] bg-app-background p-6 lg:p-8">{children}</main>;
}
