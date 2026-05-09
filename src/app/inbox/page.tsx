'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, Archive } from 'lucide-react';
import { useInbox, classifyTask, TaskDraft } from '@/lib/contexts/InboxContext';
import { Schedule } from '@/types';
import TaskGroup from '@/components/inbox/TaskGroup';
import TaskAddModal from '@/components/inbox/TaskAddModal';

type TabKey = 'today' | 'thisWeek' | 'later';

function InboxContent() {
  const { tasks, saveTask, deleteTask, toggleComplete, restoreTask } = useInbox();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Schedule | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  const activeTasks = tasks.filter(t => !t.isArchived && !t.isCompleted);
  const archivedTasks = tasks.filter(t => t.isArchived || t.isCompleted);

  const filtered = (group: TabKey) =>
    activeTasks.filter(t => classifyTask(t) === group);

  const handleEdit = (task: Schedule) => {
    setEditTarget(task);
    setModalOpen(true);
  };

  const handleSave = (draft: TaskDraft) => {
    saveTask(draft);
    setEditTarget(null);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>보관함</h1>
          {activeTasks.length > 0 && (
            <span
              className="text-xs px-2 py-px rounded-full font-medium"
              style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
            >
              {activeTasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
        >
          <Plus size={14} />
          새 할일
        </button>
      </div>

      {/* 힌트 */}
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        그룹 이름에 드롭하면 날짜가 자동 변경됩니다
      </p>

      {/* 할일 그룹 */}
      {(['today', 'thisWeek', 'later'] as TabKey[]).map(group => (
        <TaskGroup
          key={group}
          groupKey={group}
          tasks={filtered(group)}
          onToggle={toggleComplete}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
      ))}

      {/* 새 할일 추가 버튼 */}
      <button
        onClick={() => { setEditTarget(null); setModalOpen(true); }}
        className="w-full flex items-center gap-2 px-3 py-3 rounded-xl border border-dashed text-sm transition-opacity hover:opacity-70 mt-2"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
      >
        <Plus size={14} />
        새 할 일 추가
      </button>

      {/* 아카이브 */}
      {archivedTasks.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowArchive(v => !v)}
            className="flex items-center gap-2 text-sm mb-3 w-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            <Archive size={14} />
            완료됨 {archivedTasks.length}개
            <span className="ml-auto">{showArchive ? '▲' : '▼'}</span>
          </button>

          {showArchive && (
            <div className="space-y-1.5">
              {archivedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: task.color ? `${task.color}11` : 'var(--bg-sidebar)',
                    borderLeft: `3px solid ${task.color || 'var(--border-color)'}`,
                    opacity: 0.6,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: task.color || 'var(--text-muted)', fontSize: 8 }}
                  >
                    ✓
                  </span>
                  <span className="flex-1 text-sm line-through truncate" style={{ color: 'var(--text-sub)' }}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => restoreTask(task.id)}
                    className="text-xs hover:opacity-70 transition-opacity shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    복원
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <TaskAddModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}

export default function InboxPage() {
  return (
    <AppLayout showInboxSidebar={false}>
      <InboxContent />
    </AppLayout>
  );
}
