import AppLayout from "@/components/layout/AppLayout";
import CalendarView from "@/components/calendar/CalendarView";

export default function HomePage() {
  return (
    <AppLayout showInboxSidebar>
      <CalendarView />
    </AppLayout>
  );
}
