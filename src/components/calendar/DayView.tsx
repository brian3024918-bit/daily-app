'use client';

import { useRef, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCalendar } from '@/lib/contexts/CalendarContext';
import { useInbox } from '@/lib/contexts/InboxContext';
import { useDiary } from '@/lib/contexts/DiaryContext';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64;

const WEATHER_ICON: Record<string, string> = {
  sunny: '☀️', partlyCloudy: '🌤', cloudy: '⛅', rainy: '🌧', snowy: '❄️', windy: '💨',
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function DayView() {
  const { viewDate } = useCalendar();
  const { tasks } = useInbox();
  const { diaries } = useDiary();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const dateStr = format(viewDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr && !t.isArchived && !t.isCompleted);
  const timedTasks = dayTasks.filter(t => t.startTime);
  const allDayTasks = dayTasks.filter(t => !t.startTime);
  const diary = diaries.find(d => d.date === dateStr);

  const isToday = isSameDay(viewDate, today);
  const nowTop = (today.getHours() * 60 + today.getMinutes()) / 60 * HOUR_HEIGHT;

  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const targetHour = isSameDay(viewDate, now)
        ? Math.max(0, now.getHours() - 2)
        : 7;
      scrollRef.current.scrollTop = targetHour * HOUR_HEIGHT;
    }
  }, [viewDate]);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* 날짜 헤더 */}
      <div
        className="px-4 py-3 shrink-0 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
      >
        <div>
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {format(viewDate, 'M월 d일 EEEE', { locale: ko })}
          </div>
          {diary && (
            <div className="flex items-center gap-1.5 mt-0.5 text-sm">
              <span>{WEATHER_ICON[diary.weather ?? ''] ?? ''}</span>
              <span>{diary.mood}</span>
              <span className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                {diary.content?.slice(0, 40)}{(diary.content?.length ?? 0) > 40 ? '…' : ''}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push(`/diary?date=${dateStr}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity shrink-0"
          style={{
            backgroundColor: diary ? 'var(--accent-blue)' : 'var(--accent-orange)',
            color: '#fff',
          }}
        >
          <BookOpen size={14} />
          {diary ? '일기 보기' : '일기 쓰기'}
        </button>
      </div>

      {/* 종일 할일 */}
      {allDayTasks.length > 0 && (
        <div
          className="px-4 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            <CheckCircle2 size={11} style={{ color: 'var(--text-sub)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-sub)' }}>할일</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allDayTasks.map(t => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                style={{
                  backgroundColor: `${t.color || 'var(--border-color)'}22`,
                  borderLeft: `2px solid ${t.color || 'var(--border-color)'}`,
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  className="w-3 h-3 rounded-full border-2 shrink-0"
                  style={{ borderColor: t.color || 'var(--border-color)' }}
                />
                {t.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 시간 그리드 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_HEIGHT }}>

          {/* 시간 레이블 */}
          <div className="shrink-0" style={{ width: 48 }}>
            {HOURS.map(hour => (
              <div
                key={hour}
                style={{ height: HOUR_HEIGHT }}
                className="flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {hour === 0 ? '' : `${String(hour).padStart(2, '0')}:00`}
                </span>
              </div>
            ))}
          </div>

          {/* 하루 컬럼 */}
          <div
            className="flex-1 relative"
            style={{
              borderLeft: '1px solid var(--border-color)',
              minHeight: 24 * HOUR_HEIGHT,
            }}
          >
            {/* 시간 셀 */}
            {HOURS.map(hour => (
              <div
                key={hour}
                style={{
                  height: HOUR_HEIGHT,
                  borderBottom: '1px solid var(--border-color)',
                }}
              />
            ))}

            {/* 현재 시각 표시선 */}
            {isToday && (
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                style={{ top: nowTop - 1 }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--accent-orange)', marginLeft: -4 }}
                />
                <div className="flex-1" style={{ height: 2, backgroundColor: 'var(--accent-orange)' }} />
              </div>
            )}

            {/* 시간 할일 블록 */}
            {timedTasks.map(t => {
              const startMin = timeToMinutes(t.startTime!);
              const endMin = t.endTime ? timeToMinutes(t.endTime) : startMin + 60;
              const top = (startMin / 60) * HOUR_HEIGHT;
              const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 28);

              return (
                <div
                  key={t.id}
                  style={{
                    position: 'absolute',
                    top,
                    left: 4,
                    right: 4,
                    height,
                    backgroundColor: `${t.color || 'var(--accent-orange)'}25`,
                    borderLeft: `4px solid ${t.color || 'var(--accent-orange)'}`,
                  }}
                  className="rounded-lg px-3 py-1.5 overflow-hidden"
                >
                  <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {t.title}
                  </div>
                  {height > 40 && (
                    <div className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {t.startTime} – {t.endTime}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
