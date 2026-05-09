'use client';

import { useRouter, usePathname } from 'next/navigation';
import { CalendarDays, ClipboardList, BookOpen, Settings } from 'lucide-react';

const TABS = [
  { icon: CalendarDays, label: '캘린더', href: '/' },
  { icon: ClipboardList, label: '보관함', href: '/inbox' },
  { icon: BookOpen,      label: '일기',   href: '/diary' },
  { icon: Settings,      label: '설정',   href: '/settings' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden flex items-center border-t safe-area-pb"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ icon: Icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
            style={{ color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)' }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
