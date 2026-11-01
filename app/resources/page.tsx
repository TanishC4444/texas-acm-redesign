import Link from 'next/link';
import { resourceLinks } from '@/lib/content';
import { PublishedCards } from '@/components/revamp/live-content';
export const metadata = { title: 'The toolkit | Texas ACM' };
export default function Resources() {
    return (
        <div className="resource-hub">
            <div className="page-intro">
                <span className="eyebrow">THE TEXAS ACM TOOLKIT</span>
                <h1>
                    A little help.
                    <br />
                    <em>A long way.</em>
                </h1>
                <p>
                    Find your footing, learn something new, and take your next step. Your guide to
                    life in UTCS starts here.
                </p>
            </div>
            <div className="resource-grid">
                {resourceLinks.map((r, i) => (
                    <Link className="resource-tile" href={r.href} key={r.href}>
                        <span className="eyebrow">{r.label}</span>
                        <span className="resource-icon">{r.icon}</span>
                        <h2>{r.title}</h2>
                        <p>{r.description}</p>
                        <span className="resource-index">0{i + 1} ↗</span>
                    </Link>
                ))}
            </div>
            <div className="section-heading">
                <h2>Fresh from the team.</h2>
                <Link className="text-link" href="/forms">
                    Forms & signups ↗
                </Link>
            </div>
            <PublishedCards kind="resource" />
            <p className="status-note">
                Looking for an application or event signup? Visit the Forms page.
            </p>
        </div>
    );
}
