import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-app-background">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
