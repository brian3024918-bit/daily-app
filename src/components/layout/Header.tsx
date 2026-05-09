'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Menu, CalendarDays, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView } from '@/types';
import { useCalendar } from '@/lib/contexts/CalendarContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const VIEW_LABELS: Record<CalendarView, string> = { day: '일', week: '주', month: '월' };

function getPeriodLabel(view: CalendarView, viewMonth: Date, viewDate: Date): string {
  if (view === 'month') {
    return format(viewMonth, 'yyyy년 M월');
  }
  if (view === 'week') {
    const start = startOfWeek(viewDate, { weekStartsOn: 0 });
    const end = endOfWeek(viewDate, { weekStartsOn: 0 });
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'M월 d일')} ~ ${format(end, 'd일')}`;
    }
    return `${format(start, 'M월 d일')} ~ ${format(end, 'M월 d일')}`;
  }
  return format(viewDate, 'M월 d일 EEEE', { locale: ko });
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { currentView, setCurrentView, viewMonth, viewDate, goToPrevPeriod, goToNextPeriod, goToToday } =
    useCalendar();
  const today = new Date();
  const weekNumber = getWeekNumber(today);
  const dayLabel = format(today, 'EEE', { locale: ko }).toUpperCase();
  const monthLabel = format(today, 'MMM', { locale: ko }).toUpperCase();
  const dayNum = format(today, 'd');
  const periodLabel = getPeriodLabel(currentView, viewMonth, viewDate);

  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b shrink-0"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {/* 좌측: 메뉴 + 기간 네비게이션 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80"
          style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}
        >
          <Menu size={15} />
          <span>메뉴</span>
        </button>

        <div className="flex items-center gap-0.5">
          <button
            onClick={goToPrevPeriod}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-sub)' }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={goToToday}
            className="flex items-center gap-1.5 px-1 hover:opacity-80 transition-opacity"
          >
            <CalendarDays size={16} style={{ color: 'var(--accent-orange)' }} />
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {periodLabel}
            </span>
          </button>

          <button
            onClick={goToNextPeriod}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-sub)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <span className="hidden sm:inline text-xs" style={{ color: 'var(--text-muted)' }}>
          {dayLabel} · {monthLabel} {dayNum} · WEEK {weekNumber}
        </span>
      </div>

      {/* 우측: 뷰 토글 + 새로 만들기 */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-full p-0.5" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
          {(['day', 'week', 'month'] as CalendarView[]).map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={
                currentView === view
                  ? { backgroundColor: 'var(--accent-orange)', color: '#fff' }
                  : { color: 'var(--text-sub)' }
              }
            >
              {VIEW_LABELS[view]}
            </button>
          ))}
        </div>

        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80"
          style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">새로 만들기</span>
        </button>
      </div>
    </header>
  );
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
