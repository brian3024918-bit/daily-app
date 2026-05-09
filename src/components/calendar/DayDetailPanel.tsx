'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X, CheckCircle2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInbox } from '@/lib/contexts/InboxContext';
import { useDiary } from '@/lib/contexts/DiaryContext';

interface DayDetailPanelProps {
  date: Date;
  onClose: () => void;
}

const WEATHER_ICON: Record<string, string> = {
  sunny: '☀️',
  partlyCloudy: '🌤',
  cloudy: '⛅',
  rainy: '🌧',
  snowy: '❄️',
  windy: '💨',
};

export default function DayDetailPanel({ date, onClose }: DayDetailPanelProps) {
  const router = useRouter();
  const { tasks } = useInbox();
  const { diaries } = useDiary();

  const dateStr = format(date, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr && !t.isArchived && !t.isCompleted);
  const diary = diaries.find(d => d.date === dateStr);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-card)' }}>
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {format(date, 'M월 d일 EEEE', { locale: ko })}
          </span>
          {diary && (
            <span className="text-sm">
              {WEATHER_ICON[diary.weather ?? ''] ?? ''} {diary.mood}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:opacity-60 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {dayTasks.length === 0 && !diary && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            이 날의 할 일이 없어요.
          </p>
        )}

        {dayTasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <CheckCircle2 size={12} style={{ color: 'var(--text-sub)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>할일</span>
            </div>
            <div className="space-y-1.5">
              {dayTasks.map(t => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${t.color || 'var(--border-color)'}22`,
                    borderLeft: `3px solid ${t.color || 'var(--border-color)'}`,
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 shrink-0"
                    style={{ borderColor: t.color || 'var(--border-color)' }}
                  />
                  <span style={{ color: 'var(--text-primary)' }}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 일기 버튼 */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => router.push(`/diary?date=${dateStr}`)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: diary ? 'var(--accent-blue)' : 'var(--accent-orange)',
            color: '#fff',
          }}
        >
          <BookOpen size={15} />
          {diary ? `이 날 일기 보기 ${diary.mood ?? ''}` : '이 날 일기 쓰기'}
        </button>
      </div>
    </div>
  );
}
