'use client';

import { useState } from 'react';
import { X, Calendar, AlignLeft } from 'lucide-react';
import { Schedule, Priority, Repeat } from '@/types';

const TASK_COLORS = [
  { name: '산호', color: '#F2A896' },
  { name: '민트', color: '#A8D4B0' },
  { name: '하늘', color: '#A8C8E8' },
  { name: '라벤더', color: '#C8B8E8' },
  { name: '샌드', color: '#E8D8A0' },
  { name: '로즈', color: '#E8A8B8' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '🔴 높음', color: '#E8786A' },
  { value: 'medium', label: '🟡 중간', color: '#E8A87C' },
  { value: 'low', label: '🟢 낮음', color: '#A8D4B0' },
];

const REPEAT_OPTIONS: { value: Repeat; label: string }[] = [
  { value: 'none', label: '반복 없음' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
  { value: 'yearly', label: '매년' },
];

type TaskDraft = Omit<Schedule, 'id'> & { id?: string };

interface TaskAddModalProps {
  initial?: Schedule | null;
  onSave: (task: TaskDraft) => void;
  onClose: () => void;
}

export default function TaskAddModal({ initial, onSave, onClose }: TaskAddModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [color, setColor] = useState(initial?.color ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [repeat, setRepeat] = useState<Repeat>(initial?.repeat ?? 'none');
  const [memo, setMemo] = useState(initial?.memo ?? '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id,
      title: title.trim(),
      date: date || undefined,
      color: color || undefined,
      priority,
      repeat,
      memo: memo.trim() || undefined,
      isTask: true,
      isCompleted: false,
      isArchived: false,
      sortOrder: initial?.sortOrder ?? Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative w-full max-w-sm rounded-2xl shadow-xl p-5 space-y-4"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {initial ? '할일 편집' : '새 할일'}
          </h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* 제목 */}
        <input
          autoFocus
          type="text"
          placeholder="할일 제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="w-full text-sm bg-transparent outline-none border-b pb-2"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        />

        {/* 기한 날짜 */}
        <div className="flex items-center gap-2">
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: date ? 'var(--text-primary)' : 'var(--text-muted)', colorScheme: 'light' }}
          />
          {date && (
            <button
              onClick={() => setDate('')}
              className="text-[10px] hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* 색상 */}
        <div>
          <p className="text-[10px] mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>색상</p>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setColor('')}
              className="px-2.5 py-1 rounded-full text-[11px] border transition-all"
              style={{
                borderColor: color === '' ? 'var(--text-sub)' : 'var(--border-color)',
                backgroundColor: color === '' ? 'var(--bg-sidebar)' : 'transparent',
                color: color === '' ? 'var(--text-sub)' : 'var(--text-muted)',
                fontWeight: color === '' ? 600 : 400,
              }}
            >
              없음
            </button>
            {TASK_COLORS.map(c => (
              <button
                key={c.color}
                onClick={() => setColor(c.color)}
                className="px-2.5 py-1 rounded-full text-[11px] border transition-all"
                style={{
                  borderColor: c.color,
                  backgroundColor: color === c.color ? c.color : 'transparent',
                  color: color === c.color ? '#fff' : c.color,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 우선순위 */}
        <div>
          <p className="text-[10px] mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>우선순위</p>
          <div className="flex gap-1.5">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className="flex-1 py-1.5 rounded-xl text-[11px] border transition-all"
                style={{
                  borderColor: opt.color,
                  backgroundColor: priority === opt.value ? opt.color : 'transparent',
                  color: priority === opt.value ? '#fff' : opt.color,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 반복 */}
        <div className="flex items-center gap-2">
          <p className="text-[11px] shrink-0" style={{ color: 'var(--text-muted)' }}>반복</p>
          <select
            value={repeat}
            onChange={e => setRepeat(e.target.value as Repeat)}
            className="flex-1 text-xs bg-transparent outline-none rounded px-2 py-1"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', border: '1px solid var(--border-color)' }}
          >
            {REPEAT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 메모 */}
        <div className="flex gap-2">
          <AlignLeft size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
          <textarea
            placeholder="메모 (선택)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            rows={2}
            className="flex-1 text-xs bg-transparent outline-none resize-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* 저장 / 취소 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-sub)' }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
