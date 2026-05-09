export type Priority = 'high' | 'medium' | 'low';
export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type Weather = 'sunny' | 'partlyCloudy' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
export type DueDateGroup = 'today' | 'thisWeek' | 'later';
export type CalendarView = 'day' | 'week' | 'month';

export interface Category {
  id: string;
  userId?: string;
  name: string;
  color: string;
  createdAt?: string;
}

export interface Schedule {
  id: string;
  userId?: string;
  categoryId?: string;
  category?: Category;
  title: string;
  memo?: string;
  date?: string;       // YYYY-MM-DD
  startTime?: string;  // HH:MM
  endTime?: string;    // HH:MM
  isTask: boolean;
  priority: Priority;
  repeat: Repeat;
  isCompleted: boolean;
  completedAt?: string;
  isArchived: boolean;
  sortOrder: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task extends Schedule {
  isTask: true;
  dueDateGroup?: DueDateGroup;
}

export interface DiaryEntry {
  id: string;
  userId?: string;
  date: string;        // YYYY-MM-DD
  content?: string;
  mood?: string;       // emoji string
  weather?: Weather;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  userId?: string;
  name: string;
  color?: string;
  createdAt?: string;
}

export interface DiaryTag {
  diaryId: string;
  tagId: string;
}
