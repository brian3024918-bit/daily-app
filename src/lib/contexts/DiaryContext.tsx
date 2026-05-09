'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { DiaryEntry, Tag, Weather } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/contexts/AuthContext';

interface DiaryContextValue {
  diaries: DiaryEntry[];
  tags: Tag[];
  getDiary: (date: string) => DiaryEntry | undefined;
  saveDiary: (entry: Partial<DiaryEntry> & { date: string }) => void;
  deleteDiary: (id: string) => void;
  addTag: (name: string, color: string) => Tag;
}

const DiaryContext = createContext<DiaryContextValue | null>(null);

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
}

// DB row → DiaryEntry
function fromDbDiary(row: Record<string, unknown>): DiaryEntry {
  return {
    id: row.id as string,
    date: row.date as string,
    content: (row.content as string) || '',
    weather: (row.weather as Weather) || undefined,
    mood: (row.mood as string) || undefined,
    tags: (row.tags as Tag[]) || [],
  };
}

// DB row → Tag
function fromDbTag(row: Record<string, unknown>): Tag {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
  };
}

export function DiaryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!user) { setDiaries([]); setTags([]); return; }

    supabase.from('diaries').select('*').eq('user_id', user.id).order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('diaries load error:', error); return; }
        if (data) setDiaries(data.map(fromDbDiary));
      });

    supabase.from('tags').select('*').eq('user_id', user.id).order('created_at')
      .then(({ data, error }) => {
        if (error) { console.error('tags load error:', error); return; }
        if (data) setTags(data.map(fromDbTag));
      });
  }, [user]);

  const getDiary = useCallback(
    (date: string) => diaries.find(d => d.date === date),
    [diaries],
  );

  const saveDiary = useCallback((entry: Partial<DiaryEntry> & { date: string }) => {
    // 낙관적 업데이트
    setDiaries(prev => {
      const exists = prev.find(d => d.date === entry.date);
      if (exists) {
        return prev.map(d => d.date === entry.date ? { ...d, ...entry } : d);
      }
      return [...prev, { id: `d${Date.now()}`, content: '', tags: [], ...entry } as DiaryEntry];
    });

    // Supabase 동기화
    const row = {
      id: entry.id ?? `d${Date.now()}`,
      date: entry.date,
      content: entry.content ?? '',
      weather: entry.weather ?? null,
      mood: entry.mood ?? null,
      tags: entry.tags ?? [],
      user_id: user?.id,
    };
    supabase.from('diaries').upsert(row, { onConflict: 'date' })
      .then(({ error }) => { if (error) console.error('diary save error:', error); });
  }, []);

  const deleteDiary = useCallback((id: string) => {
    setDiaries(prev => prev.filter(d => d.id !== id));
    supabase.from('diaries').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('diary delete error:', error); });
  }, []);

  const addTag = useCallback((name: string, color: string): Tag => {
    const newTag: Tag = { id: `tag${Date.now()}`, name, color };
    setTags(prev => [...prev, newTag]);
    supabase.from('tags').insert({ id: newTag.id, name, color, user_id: user?.id })
      .then(({ error }) => { if (error) console.error('tag insert error:', error); });
    return newTag;
  }, [user]);

  return (
    <DiaryContext.Provider value={{ diaries, tags, getDiary, saveDiary, deleteDiary, addTag }}>
      {children}
    </DiaryContext.Provider>
  );
}
