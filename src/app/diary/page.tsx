'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Loader2, Plus, Save } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useDiary } from '@/lib/contexts/DiaryContext';
import { Weather, Tag } from '@/types';

const WEATHER_OPTIONS: { value: Weather; emoji: string; label: string }[] = [
  { value: 'sunny',        emoji: '☀️',  label: '맑음' },
  { value: 'partlyCloudy', emoji: '⛅',  label: '구름조금' },
  { value: 'cloudy',       emoji: '☁️',  label: '흐림' },
  { value: 'rainy',        emoji: '🌧️', label: '비' },
  { value: 'snowy',        emoji: '❄️',  label: '눈' },
  { value: 'windy',        emoji: '💨',  label: '바람' },
];

const MOOD_OPTIONS = [
  { emoji: '😊', label: '행복' },
  { emoji: '😌', label: '평온' },
  { emoji: '🥰', label: '사랑' },
  { emoji: '🤩', label: '신남' },
  { emoji: '😴', label: '피곤' },
  { emoji: '😔', label: '우울' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😤', label: '짜증' },
];

const TAG_COLORS = ['#A8D4B0', '#F2A896', '#E8D8A0', '#A8C8E8', '#C8B8E8', '#E8A8B8'];
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

type SaveStatus = 'idle' | 'pending' | 'saved';

function DiaryEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { diaries, saveDiary, tags: allTags, addTag } = useDiary();

  const dateParam = searchParams.get('date');
  const date = dateParam || format(new Date(), 'yyyy-MM-dd');

  const [content, setContent]           = useState('');
  const [weather, setWeather]           = useState<Weather | undefined>();
  const [mood, setMood]                 = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [saveStatus, setSaveStatus]     = useState<SaveStatus>('idle');
  const [newTagInput, setNewTagInput]   = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const pendingRef   = useRef({ content: '', weather: undefined as Weather | undefined, mood: undefined as string | undefined, selectedTags: [] as Tag[] });

  // Load diary when date changes
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const d = diaries.find(e => e.date === date);
    const initialContent = d?.content || '';
    const initialWeather = d?.weather;
    const initialMood    = d?.mood;
    const initialTags    = d?.tags || [];

    setContent(initialContent);
    setWeather(initialWeather);
    setMood(initialMood);
    setSelectedTags(initialTags);
    setSaveStatus('idle');

    pendingRef.current = {
      content: initialContent,
      weather: initialWeather,
      mood: initialMood,
      selectedTags: initialTags,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const performSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const { content, weather, mood, selectedTags } = pendingRef.current;
    saveDiary({ date, content, weather, mood, tags: selectedTags });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  }, [date, saveDiary]);

  const scheduleAutoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus('pending');
    saveTimerRef.current = setTimeout(() => {
      performSave();
    }, 1500);
  }, [performSave]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    pendingRef.current = { ...pendingRef.current, content: val };
    scheduleAutoSave();
  };

  const handleWeatherSelect = (w: Weather) => {
    const next = weather === w ? undefined : w;
    setWeather(next);
    pendingRef.current = { ...pendingRef.current, weather: next };
    scheduleAutoSave();
  };

  const handleMoodSelect = (m: string) => {
    const next = mood === m ? undefined : m;
    setMood(next);
    pendingRef.current = { ...pendingRef.current, mood: next };
    scheduleAutoSave();
  };

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    const next = isSelected
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    setSelectedTags(next);
    pendingRef.current = { ...pendingRef.current, selectedTags: next };
    scheduleAutoSave();
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const color = TAG_COLORS[allTags.length % TAG_COLORS.length];
    const newTag = addTag(newTagInput.trim(), color);
    const next = [...selectedTags, newTag];
    setSelectedTags(next);
    pendingRef.current = { ...pendingRef.current, selectedTags: next };
    setNewTagInput('');
    setShowTagInput(false);
    scheduleAutoSave();
  };

  const navigate = (delta: number) => {
    const d = new Date(date + 'T00:00:00');
    router.push(`/diary?date=${format(addDays(d, delta), 'yyyy-MM-dd')}`);
  };

  const parsedDate = new Date(date + 'T00:00:00');
  const dateLabel  = `${parsedDate.getFullYear()}년 ${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일 (${DAY_NAMES[parsedDate.getDay()]})`;
  const isToday    = format(new Date(), 'yyyy-MM-dd') === date;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">

      {/* 날짜 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors hover:bg-black/5"
        >
          <ChevronLeft size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        <div className="text-center">
          <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {dateLabel}
          </div>
          {isToday && (
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--accent-orange)' }}>오늘</div>
          )}
        </div>

        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-full transition-colors hover:bg-black/5"
        >
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* 일기 카드 */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {/* 저장 상태 */}
        <div className="flex justify-end mb-3 h-4">
          {saveStatus === 'pending' && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={11} className="animate-spin" />
              저장 중...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-orange)' }}>
              <Check size={11} />
              저장됨
            </span>
          )}
        </div>

        {/* 날씨 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium shrink-0 w-8" style={{ color: 'var(--text-muted)' }}>
            날씨
          </span>
          <div className="flex gap-1.5">
            {WEATHER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => handleWeatherSelect(opt.value)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all"
                style={{
                  backgroundColor: weather === opt.value ? 'rgba(232, 168, 124, 0.15)' : 'transparent',
                  outline: weather === opt.value ? '2px solid var(--accent-orange)' : '2px solid transparent',
                  transform: weather === opt.value ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 기분 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium shrink-0 w-8" style={{ color: 'var(--text-muted)' }}>
            기분
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.emoji}
                title={opt.label}
                onClick={() => handleMoodSelect(opt.emoji)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all"
                style={{
                  backgroundColor: mood === opt.emoji ? 'rgba(232, 168, 124, 0.15)' : 'transparent',
                  outline: mood === opt.emoji ? '2px solid var(--accent-orange)' : '2px solid transparent',
                  transform: mood === opt.emoji ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div className="flex items-start gap-3 mb-5">
          <span className="text-xs font-medium shrink-0 w-8 pt-1" style={{ color: 'var(--text-muted)' }}>
            태그
          </span>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {allTags.map(tag => {
              const isSelected = selectedTags.some(t => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: isSelected ? `${tag.color}28` : 'var(--bg-sidebar)',
                    color: isSelected ? tag.color : 'var(--text-muted)',
                    border: `1.5px solid ${isSelected ? tag.color : 'transparent'}`,
                  }}
                >
                  {tag.name}
                </button>
              );
            })}

            {showTagInput ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddTag();
                    if (e.key === 'Escape') { setShowTagInput(false); setNewTagInput(''); }
                  }}
                  placeholder="태그 이름"
                  className="px-2 py-0.5 rounded-full text-xs outline-none w-20"
                  style={{
                    border: '1.5px solid var(--accent-orange)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleAddTag}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
                >
                  추가
                </button>
                <button
                  onClick={() => { setShowTagInput(false); setNewTagInput(''); }}
                  className="text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="px-2.5 py-0.5 rounded-full text-xs flex items-center gap-0.5 transition-opacity hover:opacity-70"
                style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-muted)' }}
              >
                <Plus size={10} />
                태그 추가
              </button>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

        {/* 본문 */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="오늘은 어떤 하루였나요?"
          className="w-full bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:opacity-40"
          style={{
            color: 'var(--text-primary)',
            minHeight: '220px',
            fontFamily: 'inherit',
          }}
        />

        {/* 저장 버튼 */}
        <div
          className="flex justify-end pt-4 mt-2"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={performSave}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80 active:scale-95"
            style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
          >
            {saveStatus === 'saved' ? (
              <>
                <Check size={14} />
                저장됨
              </>
            ) : (
              <>
                <Save size={14} />
                저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiaryPage() {
  return (
    <AppLayout showInboxSidebar={false}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl">📔</div>
          </div>
        }
      >
        <DiaryEditor />
      </Suspense>
    </AppLayout>
  );
}
