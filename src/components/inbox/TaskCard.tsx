'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Schedule } from '@/types';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const PRIORITY_DOT: Record<string, string> = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
};

interface TaskCardProps {
  task: Schedule;
  onToggle: (id: string) => void;
  onEdit: (task: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: task.color ? `${task.color}22` : 'var(--bg-sidebar)',
    borderLeft: `3px solid ${task.color || 'var(--border-color)'}`,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className="group flex items-start gap-2 px-3 py-2.5 rounded-xl"
    >
      {/* 드래그 핸들 */}
      <button
        className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing"
        style={{ color: 'var(--text-muted)', touchAction: 'none' }}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>

      {/* 완료 체크 (원형 버튼) */}
      <button
        onClick={() => onToggle(task.id)}
        className="shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center hover:opacity-70 transition-opacity"
        style={{ borderColor: task.color || 'var(--border-color)' }}
      />

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
          {task.title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px]">{PRIORITY_DOT[task.priority]}</span>
          {task.date && (
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {format(parseISO(task.date), 'M/d (EEE)', { locale: ko })}
            </span>
          )}
          {task.memo && (
            <span className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
              · {task.memo}
            </span>
          )}
        </div>
      </div>

      {/* 편집 / 삭제 */}
      <div className="shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
