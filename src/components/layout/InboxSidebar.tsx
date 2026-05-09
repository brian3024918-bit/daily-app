'use client';

import { useState } from 'react';
import { Plus, Search, Archive } from 'lucide-react';
import { useInbox, classifyTask, TaskDraft } from '@/lib/contexts/InboxContext';
import TaskGroup from '@/components/inbox/TaskGroup';
import TaskAddModal from '@/components/inbox/TaskAddModal';
import { Schedule } from '@/types';

type TabKey = 'today' | 'thisWeek' | 'later';

export default function InboxSidebar() {
  const { tasks, saveTask, deleteTask, toggleComplete, restoreTask } = useInbox();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Schedule | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  const activeTasks = tasks.filter(t => !t.isArchived && !t.isCompleted);
  const archivedTasks = tasks.filter(t => t.isArchived || t.isCompleted);

  const filtered = (group: TabKey) =>
    activeTasks.filter(t => {
      const matchGroup = classifyTask(t) === group;
      const matchSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase());
      return matchGroup && matchSearch;
    });

  const totalActive = activeTasks.length;

  const handleEdit = (task: Schedule) => {
    setEditTarget(task);
    setModalOpen(true);
  };

  const handleSave = (draft: TaskDraft) => {
    saveTask(draft);
    setEditTarget(null);
  };

  const openAddModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  return (
    <>
      <aside
        className="hidden lg:flex flex-col h-full"
        style={{
          width: '300px',
          minWidth: '300px',
          borderLeft: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>보관함</span>
            {totalActive > 0 && (
              <span
                className="text-[10px] px-1.5 py-px rounded-full font-medium"
                style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
              >
                {totalActive}
              </span>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
          >
            <Plus size={12} />
            추가
          </button>
        </div>

        {/* 검색 */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--bg-sidebar)' }}
          >
            <Search size={13} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* 그룹 힌트 */}
        <p className="px-5 pb-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          그룹 이름에 드롭하면 날짜가 자동 변경됩니다
        </p>

        {/* 할일 그룹 목록 */}
        <div className="flex-1 px-4 overflow-y-auto scrollbar-thin pb-2">
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
            onClick={openAddModal}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs transition-opacity hover:opacity-70 mt-1"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            <Plus size={12} />
            새 할 일
          </button>
        </div>

        {/* 아카이브 섹션 */}
        {archivedTasks.length > 0 && (
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setShowArchive(v => !v)}
              className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity w-full"
              style={{ color: 'var(--text-muted)' }}
            >
              <Archive size={12} />
              완료됨 {archivedTasks.length}개
              <span className="ml-auto">{showArchive ? '▲' : '▼'}</span>
            </button>

            {showArchive && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                {archivedTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
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
                    <span className="flex-1 text-xs line-through truncate" style={{ color: 'var(--text-sub)' }}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="text-[10px] hover:opacity-70 transition-opacity shrink-0"
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
      </aside>

      {modalOpen && (
        <TaskAddModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}
    </>
  );
}
