'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  CalendarDays, ClipboardList, BookOpen,
  BarChart2, Archive, Settings, X,
} from 'lucide-react';
import { useInbox } from '@/lib/contexts/InboxContext';
import { useDiary } from '@/lib/contexts/DiaryContext';
import { format } from 'date-fns';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tasks } = useInbox();
  const { diaries } = useDiary();

  const activeTaskCount = tasks.filter(t => !t.isArchived && !t.isCompleted).length;
  const thisMonthStr = format(new Date(), 'yyyy-MM');
  const thisMonthDiaryCount = diaries.filter(d => d.date.startsWith(thisMonthStr)).length;

  const menuItems = [
    {
      icon: CalendarDays,
      label: '캘린더',
      sub: '월간 / 주간 / 일간',
      href: '/',
    },
    {
      icon: ClipboardList,
      label: '보관함',
      sub: activeTaskCount > 0 ? `${activeTaskCount}개의 할 일` : '할 일 없음',
      href: '/inbox',
    },
    {
      icon: BookOpen,
      label: '일기',
      sub: thisMonthDiaryCount > 0 ? `${thisMonthDiaryCount}개의 기록 · 이번 달` : '이번 달 기록 없음',
      href: '/diary',
    },
    {
      icon: BarChart2,
      label: '무드 통계',
      sub: '월간 무드 트렌드',
      href: '/stats',
    },
    {
      icon: Archive,
      label: '아카이브',
      sub: '완료된 항목',
      href: '/archive',
    },
    {
      icon: Settings,
      label: '설정',
      sub: '테마 · 앱 정보',
      href: '/settings',
    },
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(44,36,22,0.35)' }}
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{
          width: '320px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            ≡ 메뉴
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors hover:opacity-70"
            style={{ color: 'var(--text-sub)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 mb-2">
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                style={
                  isActive
                    ? { backgroundColor: 'var(--color-sand, #E8D8A0)', color: 'var(--text-primary)' }
                    : { color: 'var(--text-primary)' }
                }
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-sub)', flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>›</span>
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4">
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '12px' }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A8D4B0' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Supabase 연결됨</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v0.7.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
