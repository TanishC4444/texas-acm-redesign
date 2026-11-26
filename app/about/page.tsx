import Link from 'next/link';
import OfficerTeam from '@/components/officer-team';
import ManagedPhoto from '@/components/revamp/site-photos';

export const metadata = { title: 'About' };
export default function About() {
    return (
        <div className="rt-page acm-about">
            <section className="acm-about-intro" id="mission">
                <div>
                    <h1>
                        Meet the <em>officers.</em>
                    </h1>
                    <p>
                        The students who organize Texas ACM’s workshops, company talks, and chapter
                        events.
                    </p>
                    <Link className="rt-text-link" href="/#chapter">
                        About the chapter
                    </Link>
                </div>
                <ManagedPhoto
                    slot="about"
                    src="/studio/acmretreat25.webp"
                    alt="Texas ACM members at the chapter retreat"
                    width="1000"
                    height="700"
                    fetchPriority="high"
                />
            </section>
            <div id="officers">
                <OfficerTeam />
            </div>
        </div>
    );
}
