import CalendarHero from '@/components/calendar-hero';
import GoogleCalendar from '@/components/google-calendar';

export default function CalendarPage() {
    return (
        <div className="legacy-content min-h-screen">
            <CalendarHero />
            <GoogleCalendar />
        </div>
    );
}
