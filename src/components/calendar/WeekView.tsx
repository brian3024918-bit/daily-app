'use client';

import { useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCalendar } from '@/lib/contexts/CalendarContext';
import { useInbox } from '@/lib/contexts/InboxContext';
import { useDroppable } from '@dnd-kit/core';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function DroppableCell({ id }: { id: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        height: HOUR_HEIGHT,
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: isOver ? 'rgba(232, 168, 124, 0.12)' : 'transparent',
        transition: 'background-color 0.1s',
      }}
    />
  );
}

export default function WeekView() {
  const { viewDate, setViewDate, setCurrentView } = useCalendar();
  const { tasks } = useInbox();
  const weekStart = startOfWeek(viewDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTasks = tasks.filter(t => !t.isArchived && !t.isCompleted);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  const now = new Date();
  const nowTop = (now.getHours() * 60 + now.getMinutes()) / 60 * HOUR_HEIGHT;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* 요일 헤더 */}
      <div
        className="grid shrink-0"
        style={{
          gridTemplateColumns: '48px repeat(7, 1fr)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, today);
          const dow = day.getDay();
          const dayColor = dow === 0 ? '#E8786A' : dow === 6 ? 'var(--accent-blue)' : 'var(--text-sub)';
          return (
            <div key={i} className="flex flex-col items-center py-2 gap-0.5">
              <span className="text-[11px] font-medium uppercase" style={{ color: dayColor }}>
                {format(day, 'EEE', { locale: ko })}
              </span>
              <button
                onClick={() => { setViewDate(day); setCurrentView('day'); }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors hover:opacity-80"
                style={{
                  backgroundColor: isToday ? 'var(--accent-orange)' : 'transparent',
                  color: isToday ? '#fff' : dayColor,
                }}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>

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

          {/* 요일 컬럼 */}
          {weekDays.map((day, dayIdx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isToday = isSameDay(day, today);
            const timedTasks = activeTasks.filter(t => t.date === dateStr && t.startTime);

            return (
              <div
                key={dayIdx}
                className="flex-1 relative"
                style={{
                  borderLeft: '1px solid var(--border-color)',
                  minHeight: 24 * HOUR_HEIGHT,
                  backgroundColor: isToday ? 'rgba(232,168,124,0.03)' : 'transparent',
                }}
              >
                {/* 드롭 가능한 시간 셀 */}
                {HOURS.map(hour => (
                  <DroppableCell key={hour} id={`cal-${dateStr}`} />
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
                    <div
                      className="flex-1"
                      style={{ height: 2, backgroundColor: 'var(--accent-orange)' }}
                    />
                  </div>
                )}

                {/* 할일 블록 */}
                {timedTasks.map(t => {
                  const startMin = timeToMinutes(t.startTime!);
                  const endMin = t.endTime ? timeToMinutes(t.endTime) : startMin + 60;
                  const top = (startMin / 60) * HOUR_HEIGHT;
                  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 22);

                  return (
                    <div
                      key={t.id}
                      style={{
                        position: 'absolute',
                        top,
                        left: 2,
                        right: 2,
                        height,
                        zIndex: 2,
                        backgroundColor: `${t.color || 'var(--accent-orange)'}30`,
                        borderLeft: `3px solid ${t.color || 'var(--accent-orange)'}`,
                      }}
                      className="rounded px-1.5 py-0.5 overflow-hidden"
                    >
                      <div className="text-[11px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {t.title}
                      </div>
                      {height > 36 && (
                        <div className="text-[10px] truncate" style={{ color: 'var(--text-sub)' }}>
                          {t.startTime} – {t.endTime}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
