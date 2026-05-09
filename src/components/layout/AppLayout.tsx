'use client';

import { useState } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import InboxSidebar from './InboxSidebar';
import BottomTabBar from './BottomTabBar';

interface AppLayoutProps {
  children: React.ReactNode;
  showInboxSidebar?: boolean;
}

export default function AppLayout({ children, showInboxSidebar = true }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Header onMenuClick={() => setMenuOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
        {showInboxSidebar && <InboxSidebar />}
      </div>

      <BottomTabBar />
    </div>
  );
}
