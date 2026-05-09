'use client';

import AppLayout from '@/components/layout/AppLayout';
import { useInbox } from '@/lib/contexts/InboxContext';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

function ArchiveContent() {
  const { tasks, restoreTask, deleteTask } = useInbox();

  const archivedTasks = tasks
    .filter(t => t.isArchived || t.isCompleted)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  const grouped: Record<string, typeof archivedTasks> = {};
  archivedTasks.forEach(task => {
    const key = task.date || '__nodate__';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  const groupKeys = Object.keys(grouped).sort((a, b) => {
    if (a === '__nodate__') return 1;
    if (b === '__nodate__') return -1;
    return b.localeCompare(a);
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Archive size={20} style={{ color: 'var(--accent-orange)' }} />
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>아카이브</h1>
        {archivedTasks.length > 0 && (
          <span
            className="text-xs px-2 py-px rounded-full font-medium"
            style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-muted)' }}
          >
            {archivedTasks.length}개
          </span>
        )}
      </div>

      {archivedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="text-4xl">🗄️</div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>완료된 할 일이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupKeys.map(dateKey => (
            <div key={dateKey}>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--text-sub)' }}>
                {dateKey === '__nodate__'
                  ? '날짜 없음'
                  : format(parseISO(dateKey), 'M월 d일 (EEE)', { locale: ko })}
              </div>
              <div className="space-y-1.5">
                {grouped[dateKey].map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: task.color ? `${task.color}11` : 'var(--bg-sidebar)',
                      borderLeft: `3px solid ${task.color || 'var(--border-color)'}`,
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: task.color || 'var(--text-muted)', fontSize: 8 }}
                    >
                      ✓
                    </span>
                    <span
                      className="flex-1 text-sm line-through truncate"
                      style={{ color: 'var(--text-sub)', opacity: 0.7 }}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                      title="복원"
                    >
                      <RotateCcw size={13} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                      title="영구 삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArchivePage() {
  return (
    <AppLayout showInboxSidebar={false}>
      <ArchiveContent />
    </AppLayout>
  );
}
