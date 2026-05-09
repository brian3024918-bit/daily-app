'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useDiary } from '@/lib/contexts/DiaryContext';
import { useInbox } from '@/lib/contexts/InboxContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';

const MOOD_OPTIONS = [
  { emoji: '😊', label: '행복' },
  { emoji: '😌', label: '평온' },
  { emoji: '🥰', label: '사랑' },
  { emoji: '🤩', label: '신남' },
  { emoji: '😴', label: '피곤' },
  { emoji: '😔', label: '우울' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😤', label: '짜증' },
];

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function StatsContent() {
  const { diaries } = useDiary();
  const { tasks } = useInbox();
  const [viewMonth, setViewMonth] = useState(new Date());

  const monthStr = format(viewMonth, 'yyyy-MM');
  const monthDiaries = diaries.filter(d => d.date.startsWith(monthStr));
  const writtenDates = new Set(monthDiaries.map(d => d.date));

  const monthStart = startOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(viewMonth) });
  const firstDayOfWeek = getDay(monthStart);
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const moodCounts: Record<string, number> = {};
  monthDiaries.forEach(d => {
    if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });
  const maxMoodCount = Math.max(1, ...Object.values(moodCounts));
  const hasMoods = Object.keys(moodCounts).length > 0;

  const allTasks = tasks;
  const completedTasks = allTasks.filter(t => t.isCompleted);
  const completionRate = allTasks.length > 0
    ? Math.round((completedTasks.length / allTasks.length) * 100)
    : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 헤더 + 월 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>📊 통계</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMonth(m => subMonths(m, 1))}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium px-1" style={{ color: 'var(--text-primary)' }}>
            {format(viewMonth, 'yyyy년 M월')}
          </span>
          <button
            onClick={() => setViewMonth(m => addMonths(m, 1))}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 일기 작성 캘린더 히트맵 */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>📔 일기 작성 기록</h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {monthDiaries.length}일 / {days.length}일
          </span>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[10px] py-0.5" style={{ color: 'var(--text-muted)' }}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEntry = writtenDates.has(dateStr);
            const isToday = dateStr === todayStr;
            return (
              <div
                key={dateStr}
                className="aspect-square flex items-center justify-center rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: hasEntry
                    ? 'var(--accent-orange)'
                    : isToday
                    ? 'rgba(232,168,124,0.15)'
                    : 'transparent',
                  color: hasEntry ? '#fff' : isToday ? 'var(--accent-orange)' : 'var(--text-sub)',
                  outline: isToday && !hasEntry ? '1.5px solid var(--accent-orange)' : 'none',
                }}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>

      {/* 기분 분포 */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>😊 기분 분포</h2>
        {!hasMoods ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
            이번 달 기록된 기분이 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {MOOD_OPTIONS
              .filter(m => moodCounts[m.emoji])
              .sort((a, b) => (moodCounts[b.emoji] || 0) - (moodCounts[a.emoji] || 0))
              .map(({ emoji, label }) => {
                const count = moodCounts[emoji] || 0;
                const pct = Math.round((count / maxMoodCount) * 100);
                return (
                  <div key={emoji} className="flex items-center gap-2">
                    <span className="text-base w-7 text-center shrink-0" title={label}>{emoji}</span>
                    <div
                      className="flex-1 h-5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--bg-sidebar)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: 'var(--accent-orange)',
                          opacity: 0.55 + (pct / 100) * 0.45,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs w-5 text-right shrink-0 font-semibold"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 할일 통계 */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>✅ 할일 통계</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: '전체', value: allTasks.length, color: 'var(--text-primary)' },
            { label: '완료', value: completedTasks.length, color: 'var(--accent-orange)' },
            { label: '남음', value: allTasks.length - completedTasks.length, color: 'var(--color-coral, #F2A896)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="text-center py-3 rounded-xl"
              style={{ backgroundColor: 'var(--bg-sidebar)' }}
            >
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-sidebar)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%`, backgroundColor: 'var(--accent-orange)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>완료율</span>
          <span className="text-[10px] font-semibold" style={{ color: 'var(--accent-orange)' }}>
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <AppLayout showInboxSidebar={false}>
      <StatsContent />
    </AppLayout>
  );
}
