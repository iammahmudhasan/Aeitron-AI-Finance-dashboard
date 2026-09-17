import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TeamMessageToast from '../notifications/TeamMessageToast';

export default function DashboardLayout({ children, onAddClient, activeView, onNavigate, searchQuery, onSearchChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <TeamMessageToast onNavigate={onNavigate} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={onNavigate}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onAddClient={onAddClient}
          activeView={activeView}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
