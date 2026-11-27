'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
const calendar = 'utacm.org_tblt9l9gskpcunjovsjfh8ei0g%40group.calendar.google.com';
export default function CalendarBoard() {
    const [view, setView] = useState('AGENDA');
    return (
        <div className="calendar-board">
            <div className="calendar-sheet">
                <div className="calendar-toolbar">
                    <span>
                        <i /> Texas ACM / Live Calendar
                    </span>
                    <a
                        className="calendar-subscribe"
                        href={`https://calendar.google.com/calendar/u/0/r?cid=${calendar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Add Calendar <ArrowUpRight size={14} />
                    </a>
                    <div role="group" aria-label="Calendar view">
                        <button aria-pressed={view === 'AGENDA'} onClick={() => setView('AGENDA')}>
                            Schedule
                        </button>
                        <button aria-pressed={view === 'MONTH'} onClick={() => setView('MONTH')}>
                            Month
                        </button>
                    </div>
                </div>
                <iframe
                    key={view}
                    style={{ height: view === 'AGENDA' ? 340 : 500 }}
                    title="Texas ACM shared events calendar"
                    loading="lazy"
                    src={`https://calendar.google.com/calendar/embed?src=${calendar}&ctz=America%2FChicago&mode=${view}&color=%232445aa&showTitle=0&showPrint=0&showCalendars=0&showTz=0`}
                />
                <div className="calendar-bottom">
                    <span>Plans Change. Check Event Details Before Attending.</span>
                    <a
                        href={`https://calendar.google.com/calendar/embed?src=${calendar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Calendar <ArrowUpRight size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}
