'use client';

import { useState, useEffect } from 'react';
import { useCalendar } from '@/lib/contexts/CalendarContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import DayDetailPanel from './DayDetailPanel';

export default function CalendarView() {
  const { currentView, viewMonth } = useCalendar();
  const [detailDate, setDetailDate] = useState<Date | null>(null);

  // 월 변경 또는 뷰 전환 시 상세 패널 닫기
  useEffect(() => {
    setDetailDate(null);
  }, [viewMonth, currentView]);

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full">
        {currentView === 'month' && (
          <MonthView onDaySelect={date => setDetailDate(date)} />
        )}
        {currentView === 'week' && <WeekView />}
        {currentView === 'day' && <DayView />}
      </div>

      {/* 날짜 상세 패널 (월간 뷰 전용 슬라이드업) */}
      {detailDate && currentView === 'month' && (
        <div
          className="absolute bottom-0 left-0 right-0 z-10 shadow-lg"
          style={{
            maxHeight: '45%',
            borderTop: '2px solid var(--accent-orange)',
          }}
        >
          <DayDetailPanel
            date={detailDate}
            onClose={() => setDetailDate(null)}
          />
        </div>
      )}
    </div>
  );
}
