'use client';

import { DiaryProvider } from '@/lib/contexts/DiaryContext';
import { InboxProvider } from '@/lib/contexts/InboxContext';
import { CalendarProvider } from '@/lib/contexts/CalendarContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DiaryProvider>
        <InboxProvider>
          <CalendarProvider>
            {children}
          </CalendarProvider>
        </InboxProvider>
      </DiaryProvider>
    </ThemeProvider>
  );
}
