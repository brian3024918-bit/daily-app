'use client';

import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Schedule } from '@/types';
import TaskCard from './TaskCard';

type GroupKey = 'today' | 'thisWeek' | 'later';

const GROUP_LABELS: Record<GroupKey, string> = {
  today: '오늘',
  thisWeek: '이번주',
  later: '나중에',
};

interface TaskGroupProps {
  groupKey: GroupKey;
  tasks: Schedule[];
  onToggle: (id: string) => void;
  onEdit: (task: Schedule) => void;
  onDelete: (id: string) => void;
}

function DroppableGroupHeader({ groupKey, label, count, collapsed, onToggle }: {
  groupKey: GroupKey;
  label: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `inbox-group-${groupKey}` });

  return (
    <button
      ref={setNodeRef}
      onClick={onToggle}
      className="flex items-center gap-1.5 mb-2 w-full text-left rounded-lg px-1 py-1 transition-colors"
      style={{
        backgroundColor: isOver ? 'rgba(232, 168, 124, 0.18)' : 'transparent',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
      </span>
      <span className="text-xs font-semibold" style={{ color: isOver ? 'var(--accent-orange)' : 'var(--text-sub)' }}>
        {label}
      </span>
      {count > 0 && (
        <span
          className="text-[10px] px-1.5 py-px rounded-full font-medium"
          style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-muted)' }}
        >
          {count}
        </span>
      )}
      {isOver && (
        <span className="ml-auto text-[10px] font-medium" style={{ color: 'var(--accent-orange)' }}>
          여기에 놓기
        </span>
      )}
    </button>
  );
}

export default function TaskGroup({ groupKey, tasks, onToggle, onEdit, onDelete }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-4">
      <DroppableGroupHeader
        groupKey={groupKey}
        label={GROUP_LABELS[groupKey]}
        count={tasks.length}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />

      {!collapsed && (
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {tasks.length === 0 ? (
              <p className="text-[11px] py-2 text-center" style={{ color: 'var(--text-muted)' }}>
                비어 있음
              </p>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
