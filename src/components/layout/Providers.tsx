'use client';

import { DiaryProvider } from '@/lib/contexts/DiaryContext';
import { InboxProvider } from '@/lib/contexts/InboxContext';
import { CalendarProvider } from '@/lib/contexts/CalendarContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <InboxProvider>
            <CalendarProvider>
              {children}
            </CalendarProvider>
          </InboxProvider>
        </DiaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
