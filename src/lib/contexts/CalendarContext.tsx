'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { CalendarView } from '@/types';

interface CalendarContextType {
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  viewMonth: Date;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  goToPrevPeriod: () => void;
  goToNextPeriod: () => void;
  goToToday: () => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const today = new Date();
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [viewDate, setViewDate] = useState(today);

  const goToPrevPeriod = useCallback(() => {
    if (currentView === 'month') setViewMonth(m => subMonths(m, 1));
    else if (currentView === 'week') setViewDate(d => subWeeks(d, 1));
    else setViewDate(d => subDays(d, 1));
  }, [currentView]);

  const goToNextPeriod = useCallback(() => {
    if (currentView === 'month') setViewMonth(m => addMonths(m, 1));
    else if (currentView === 'week') setViewDate(d => addWeeks(d, 1));
    else setViewDate(d => addDays(d, 1));
  }, [currentView]);

  const goToToday = useCallback(() => {
    const t = new Date();
    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDate(t);
    setViewDate(t);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        currentView, setCurrentView,
        selectedDate, setSelectedDate,
        viewMonth,
        viewDate, setViewDate,
        goToPrevPeriod,
        goToNextPeriod,
        goToToday,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}
