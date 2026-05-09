'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, isSameDay } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import { useCalendar } from '@/lib/contexts/CalendarContext';
import { useInbox } from '@/lib/contexts/InboxContext';
import { useDiary } from '@/lib/contexts/DiaryContext';
import { Schedule } from '@/types';

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

interface CellData {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
}

interface MonthViewProps {
  onDaySelect: (date: Date) => void;
}

interface CalendarCellProps {
  cell: CellData;
  isToday: boolean;
  isSelected: boolean;
  hasDiary: boolean;
  allItems: Schedule[];
  onClick: () => void;
}

function CalendarCell({ cell, isToday, isSelected, hasDiary, allItems, onClick }: CalendarCellProps) {
  const dateStr = format(cell.date, 'yyyy-MM-dd');
  const { isOver, setNodeRef } = useDroppable({ id: `cal-${dateStr}` });
  const dayOfWeek = cell.date.getDay();

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col p-1 cursor-pointer transition-colors"
      style={{
        borderRight: dayOfWeek === 6 ? 'none' : '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: isOver
          ? 'rgba(232, 168, 124, 0.15)'
          : isSelected && !isToday
          ? 'rgba(168, 200, 232, 0.12)'
          : 'transparent',
        transition: 'background-color 0.1s',
      }}
      onClick={onClick}
    >
      {/* 날짜 숫자 + 일기 아이콘 */}
      <div className="flex items-center gap-0.5 mb-0.5">
        <span
          className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
          style={{
            backgroundColor: isToday ? 'var(--accent-orange)' : 'transparent',
            color: isToday
              ? '#fff'
              : !cell.isCurrentMonth
              ? 'var(--text-muted)'
              : dayOfWeek === 0
              ? '#E8786A'
              : dayOfWeek === 6
              ? 'var(--accent-blue)'
              : 'var(--text-primary)',
            fontWeight: isToday ? 700 : 500,
          }}
        >
          {cell.day}
        </span>
        {hasDiary && (
          <span className="text-[8px] leading-none" title="일기 있음">
            ✏️
          </span>
        )}
        {isOver && (
          <span className="text-[8px] ml-auto" style={{ color: 'var(--accent-orange)' }}>+</span>
        )}
      </div>

      {/* 일정 / 할일 chip */}
      <div className="space-y-px flex-1 min-h-0">
        {allItems.slice(0, 3).map(item => (
          <div
            key={item.id}
            className="px-1 py-px rounded text-[10px] truncate leading-tight"
            style={{
              backgroundColor: `${item.color || '#ccc'}2e`,
              borderLeft: `2px solid ${item.color || '#ccc'}`,
              color: cell.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {item.isTask && (
              <span className="mr-0.5 opacity-50">○</span>
            )}
            {item.title}
          </div>
        ))}
        {allItems.length > 3 && (
          <div className="text-[10px] pl-1" style={{ color: 'var(--text-muted)' }}>
            +{allItems.length - 3}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MonthView({ onDaySelect }: MonthViewProps) {
  const { viewMonth, selectedDate, setSelectedDate, setViewDate } = useCalendar();
  const { tasks: inboxTasks } = useInbox();
  const { diaries } = useDiary();
  const router = useRouter();
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: CellData[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });
  }

  const diaryDateSet = new Set(diaries.map(d => d.date));
  const activeTasks = inboxTasks.filter(t => !t.isArchived && !t.isCompleted);

  const handleCellClick = (date: Date) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      router.push(`/diary?date=${format(date, 'yyyy-MM-dd')}`);
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      setSelectedDate(date);
      setViewDate(date);
      onDaySelect(date);
    }, 260);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 shrink-0">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={d}
            className="text-center text-xs font-medium py-2"
            style={{
              color:
                i === 0 ? '#E8786A' : i === 6 ? 'var(--accent-blue)' : 'var(--text-sub)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div
        className="grid grid-cols-7 flex-1"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        {cells.map((cell, idx) => {
          const dateStr = format(cell.date, 'yyyy-MM-dd');
          const isToday = isSameDay(cell.date, today);
          const isSelected = selectedDate ? isSameDay(cell.date, selectedDate) : false;
          const hasDiary = cell.isCurrentMonth && diaryDateSet.has(dateStr);
          const allItems = activeTasks.filter(t => t.date === dateStr);

          return (
            <CalendarCell
              key={idx}
              cell={cell}
              isToday={isToday}
              isSelected={isSelected}
              hasDiary={hasDiary}
              allItems={allItems}
              onClick={() => handleCellClick(cell.date)}
            />
          );
        })}
      </div>
    </div>
  );
}
