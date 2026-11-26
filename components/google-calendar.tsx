import CalendarBoard from '@/components/revamp/calendar-board';
export default function GoogleCalendar() {
    return (
        <section className="editorial-section standalone-calendar">
            <CalendarBoard />
            <a
                className="editorial-text-link"
                href="https://calendar.google.com/calendar/ical/utacm.org_tblt9l9gskpcunjovsjfh8ei0g%40group.calendar.google.com/public/basic.ics"
            >
                Download iCal (.ics) File ↗
            </a>
        </section>
    );
}
