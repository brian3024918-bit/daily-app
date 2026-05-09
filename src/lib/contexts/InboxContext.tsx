'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { format, endOfWeek, isToday, isThisWeek } from 'date-fns';
import { Schedule, Priority, Repeat } from '@/types';
import { supabase } from '@/lib/supabase';

type TabKey = 'today' | 'thisWeek' | 'later';
export type TaskDraft = Omit<Schedule, 'id'> & { id?: string };

export function classifyTask(task: Schedule): TabKey {
  if (!task.date) return 'later';
  const d = new Date(task.date + 'T00:00:00');
  if (isToday(d)) return 'today';
  if (isThisWeek(d, { weekStartsOn: 0 })) return 'thisWeek';
  return 'later';
}

function applyGroupDate(task: Schedule, group: TabKey): Schedule {
  if (group === 'today') return { ...task, date: format(new Date(), 'yyyy-MM-dd') };
  if (group === 'thisWeek') return { ...task, date: format(endOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd') };
  return { ...task, date: undefined };
}

// DB row → Schedule
function fromDb(row: Record<string, unknown>): Schedule {
  return {
    id: row.id as string,
    title: row.title as string,
    date: (row.date as string) || undefined,
    categoryId: (row.category_id as string) || undefined,
    color: (row.color as string) || undefined,
    priority: (row.priority as Priority) || 'medium',
    repeat: (row.repeat_type as Repeat) || 'none',
    memo: (row.memo as string) || undefined,
    isTask: (row.is_task as boolean) ?? true,
    isCompleted: (row.is_completed as boolean) ?? false,
    isArchived: (row.is_archived as boolean) ?? false,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

// Schedule → DB row
function toDb(task: Schedule) {
  return {
    id: task.id,
    title: task.title,
    date: task.date || null,
    category_id: task.categoryId || null,
    color: task.color || null,
    priority: task.priority,
    repeat_type: task.repeat,
    memo: task.memo || null,
    is_task: task.isTask,
    is_completed: task.isCompleted,
    is_archived: task.isArchived,
    sort_order: task.sortOrder,
  };
}

interface InboxContextValue {
  tasks: Schedule[];
  saveTask: (draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  restoreTask: (id: string) => void;
}

const InboxContext = createContext<InboxContextValue | null>(null);

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error('useInbox must be used within InboxProvider');
  return ctx;
}

/* 드래그 오버레이용 미니 카드 */
function OverlayCard({ task }: { task: Schedule }) {
  const PRIORITY_DOT: Record<string, string> = { high: '🔴', medium: '🟡', low: '🟢' };
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl shadow-lg"
      style={{
        backgroundColor: task.color ? `${task.color}33` : '#f5f0e8',
        borderLeft: `3px solid ${task.color || '#ccc'}`,
        width: 240,
        userSelect: 'none',
      }}
    >
      <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: task.color || '#ccc' }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug truncate" style={{ color: '#2C2416' }}>{task.title}</div>
        <span className="text-[10px]">{PRIORITY_DOT[task.priority]}</span>
      </div>
    </div>
  );
}

export function InboxProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Schedule[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Supabase에서 tasks 로드
  useEffect(() => {
    supabase.from('tasks').select('*').order('sort_order')
      .then(({ data, error }) => {
        if (error) { console.error('tasks load error:', error); return; }
        if (data) setTasks(data.map(fromDb));
      });
  }, []);

  const saveTask = useCallback((draft: TaskDraft) => {
    if (draft.id) {
      // 수정
      setTasks(prev => prev.map(t => t.id === draft.id ? { ...t, ...draft, id: draft.id! } : t));
      supabase.from('tasks').update(toDb({ ...draft, id: draft.id } as Schedule)).eq('id', draft.id)
        .then(({ error }) => { if (error) console.error('task update error:', error); });
    } else {
      // 신규 추가
      const newTask: Schedule = { ...draft, id: `t${Date.now()}` } as Schedule;
      setTasks(prev => [...prev, newTask]);
      supabase.from('tasks').insert(toDb(newTask))
        .then(({ error }) => { if (error) console.error('task insert error:', error); });
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    supabase.from('tasks').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('task delete error:', error); });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, isCompleted: true, isArchived: true } : t)
    );
    supabase.from('tasks').update({ is_completed: true, is_archived: true }).eq('id', id)
      .then(({ error }) => { if (error) console.error('task complete error:', error); });
  }, []);

  const restoreTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, isCompleted: false, isArchived: false } : t)
    );
    supabase.from('tasks').update({ is_completed: false, is_archived: false }).eq('id', id)
      .then(({ error }) => { if (error) console.error('task restore error:', error); });
  }, []);

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;

    const draggedId = String(active.id);
    const overId = String(over.id);

    if (overId.startsWith('cal-')) {
      const dateStr = overId.slice(4);
      setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, date: dateStr } : t));
      supabase.from('tasks').update({ date: dateStr }).eq('id', draggedId)
        .then(({ error }) => { if (error) console.error(error); });
      return;
    }

    if (overId.startsWith('inbox-group-')) {
      const targetGroup = overId.slice(12) as TabKey;
      setTasks(prev => prev.map(t => {
        if (t.id !== draggedId) return t;
        const updated = applyGroupDate(t, targetGroup);
        supabase.from('tasks').update({ date: updated.date || null }).eq('id', draggedId)
          .then(({ error }) => { if (error) console.error(error); });
        return updated;
      }));
      return;
    }

    setTasks(prev => {
      const draggedTask = prev.find(t => t.id === draggedId);
      const overTask = prev.find(t => t.id === overId);
      if (!draggedTask || !overTask) return prev;

      const draggedGroup = classifyTask(draggedTask);
      const overGroup = classifyTask(overTask);

      if (draggedGroup !== overGroup) {
        return prev.map(t => {
          if (t.id !== draggedId) return t;
          const updated = applyGroupDate(t, overGroup);
          supabase.from('tasks').update({ date: updated.date || null }).eq('id', draggedId)
            .then(({ error }) => { if (error) console.error(error); });
          return updated;
        });
      }

      const oldIdx = prev.findIndex(t => t.id === draggedId);
      const newIdx = prev.findIndex(t => t.id === overId);
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const handleDragCancel = () => setActiveId(null);

  const activeTask = activeId ? tasks.find(t => t.id === activeId) ?? null : null;

  return (
    <InboxContext.Provider value={{ tasks, saveTask, deleteTask, toggleComplete, restoreTask }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}
        <DragOverlay dropAnimation={null}>
          {activeTask && <OverlayCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </InboxContext.Provider>
  );
}
