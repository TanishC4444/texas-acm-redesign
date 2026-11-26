'use client';
import { PageIntro, RouteLink } from './primitives';
import { EventRow } from './events';
import { useRuntime } from './provider';
const campaigns: Record<string, { title: string; match: RegExp; description: string }> = {
    'cs-week': {
        title: 'CS Week.',
        match: /cs\s*week/i,
        description: 'A week of computing, collaboration and community.',
    },
    elections: {
        title: 'Chapter elections.',
        match: /election/i,
        description: 'Find current election events and participation details.',
    },
};
export default function Campaign({ slug }: { slug: string }) {
    const { events, status, now } = useRuntime();
    const def = campaigns[slug];
    if (!def)
        return (
            <div className="rt-page">
                <PageIntro
                    label="Campaign"
                    title="Campaign not found."
                    action={<RouteLink href="/#calendar">See chapter calendar</RouteLink>}
                />
            </div>
        );
    const active = events.filter((e) => def.match.test(e.title) && new Date(e.end).getTime() > now);
    return (
        <div className="rt-page">
            <PageIntro label="Campaign" title={def.title} description={def.description} />
            {status === 'loading' ? (
                <p className="rt-empty" role="status">
                    Loading current schedule…
                </p>
            ) : active.length ? (
                active.map((e) => <EventRow key={e.id} event={e} />)
            ) : (
                <section className="rt-cell">
                    <h2>Not currently scheduled.</h2>
                    <p>
                        Current campaign dates appear here when published to the chapter calendar.
                    </p>
                    <RouteLink href="/#calendar">See chapter calendar</RouteLink>
                </section>
            )}
        </div>
    );
}
