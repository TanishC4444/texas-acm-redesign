import Link from 'next/link';
import ChapterPageHero from '@/components/revamp/page-hero';
import { ArrowUpRight } from 'lucide-react';
import { PublishedCards } from '@/components/revamp/live-content';
import CorporateEvents from '@/components/corporate-events';
import AcademicEvents from '@/components/academic-events';
import SocialEvents from '@/components/social-events';
export const metadata = { title: 'What’s on' };
export default function EventsPage() {
    return (
        <>
            <ChapterPageHero
                title="Chapter events"
                description="Academic, industry, and community events hosted by Texas ACM."
                image="familyfeud25"
                alt="Texas ACM community event"
                href="/calendar"
                action="Open the calendar"
            />
            <div className="studio-section">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">COMING UP</span>
                        <h2>Save your spot.</h2>
                    </div>
                    <a className="text-link" href="https://www.instagram.com/texas_acm/">
                        The latest on Instagram ↗
                    </a>
                </div>
                <PublishedCards kind="event" />
                <nav className="event-category-links" aria-label="Event categories">
                    <a href="#industry">01 / Industry ↗</a>
                    <a href="#academics">02 / Academics ↗</a>
                    <a href="#community">03 / Community ↗</a>
                </nav>
            </div>
            <div className="legacy-content">
                <div id="industry" className="category-banner">
                    <span className="eyebrow">01 / INDUSTRY</span>
                    <h2>Your next open door.</h2>
                </div>
                <CorporateEvents />
                <div id="academics" className="category-banner">
                    <span className="eyebrow">02 / ACADEMICS</span>
                    <h2>Stay curious. Make something.</h2>
                </div>
                <AcademicEvents />
                <div id="community" className="category-banner">
                    <span className="eyebrow">03 / COMMUNITY</span>
                    <h2>Your people are here.</h2>
                </div>
                <SocialEvents />
            </div>
        </>
    );
}
