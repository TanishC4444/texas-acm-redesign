import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { CommunityGame, StartupPreview } from './preview';
import './preview.css';

export const metadata = { title: 'Community preview', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const projects = [
    {
        id: 'office-hours',
        name: 'Office Hours',
        area: 'Campus tools',
        description: 'See which help sessions are open and plan a visit.',
        mark: '08:40',
    },
    {
        id: 'route-lab',
        name: 'Route Lab',
        area: 'Data visualization',
        description: 'Explore how routing algorithms take different paths across the same map.',
        mark: 'A → B',
    },
    {
        id: 'bitboard',
        name: 'Bitboard',
        area: 'Developer tools',
        description: 'Draw a circuit and step through its state changes.',
        mark: '1010',
    },
];

export default async function CommunityPreview({
    searchParams,
}: {
    searchParams: Promise<{ project?: string }>;
}) {
    if (process.env.ACM_COMMUNITY_PREVIEW !== '1') notFound();
    const { project } = await searchParams;
    const selected = projects.find(({ id }) => id === project);
    if (selected)
        return (
            <div className="rt-page community-preview">
                <section className="community-section">
                    <Link className="rt-text-link" href="/community-preview#portfolio">
                        Back to the portfolio book
                    </Link>
                    <h1>{selected.name}</h1>
                    <p>{selected.description}</p>
                    <p>
                        This is a sample project page. A published portfolio card would open the
                        student’s own website.
                    </p>
                </section>
            </div>
        );

    return (
        <div className="rt-page community-preview">
            <header className="community-section">
                <h1>ACM Community Lab</h1>
                <p>Local preview with sample projects, opportunities, and scores.</p>
                <nav className="community-jumps" aria-label="Community sections">
                    <a href="#portfolio">Portfolio book</a>
                    <a href="#hack-night">Hack Night</a>
                    <a href="#startup">Startup hub</a>
                    <a href="#clubs">Club contacts</a>
                    <a href="#game">CS DLE</a>
                </nav>
            </header>
            <section className="community-section" id="portfolio">
                <h2>Portfolio book</h2>
                <div className="community-portfolios">
                    {projects.map((item) => (
                        <Link
                            key={item.id}
                            className="community-portfolio"
                            href={'/community-preview?project=' + item.id}
                        >
                            <span className="community-thumb" aria-hidden="true">
                                {item.mark}
                            </span>
                            <strong>
                                {item.name} <ArrowUpRight size={16} aria-hidden="true" />
                            </strong>
                            <span>{item.area}</span>
                        </Link>
                    ))}
                </div>
            </section>
            <section className="community-section community-hack" id="hack-night">
                <div>
                    <h2>Hack Night</h2>
                    <p>
                        Try a biweekly 90-minute build. An ambassador brings a practical challenge,
                        small teams make something, and everyone closes with demos.
                    </p>
                </div>
                <div>
                    <h3>Example challenge · Launch telemetry</h3>
                    <p>
                        Build a dashboard that flags anomalies in a sample data stream. Beginners
                        get a starter dataset and a mentor.
                    </p>
                    <Link className="rt-text-link" href="/#calendar">
                        See the chapter calendar
                    </Link>
                </div>
            </section>
            <section className="community-section" id="startup">
                <h2>Startup hub</h2>
                <StartupPreview />
            </section>
            <section className="community-section" id="clubs">
                <h2>Clubs &amp; ambassadors</h2>
                <dl className="community-directory">
                    <div>
                        <dt>Student clubs</dt>
                        <dd>
                            Propose a co-hosted workshop, cross-post an event, or coordinate
                            volunteers.
                        </dd>
                    </div>
                    <div>
                        <dt>Company ambassadors</dt>
                        <dd>
                            Pitch a hands-on challenge, bring mentors, or host a project demo night.
                        </dd>
                    </div>
                </dl>
                <p>
                    A live directory would list approved role inboxes and each team’s preferred way
                    to collaborate.
                </p>
            </section>
            <section className="community-section" id="game">
                <h2>CS DLE &amp; leaderboard</h2>
                <CommunityGame />
            </section>
        </div>
    );
}
