import QuickAccess from '@/components/resources/cs-guide/quick-access';
import UsefulInformation from '@/components/resources/cs-guide/useful-information';
import AtoZContent from '@/components/resources/atoz/atoz-content';
import FAQ from '@/components/resources/faq/faq';
import ResumeBook from '@/components/resources/resume-book/resume-book';
import Forms from '@/components/resources/forms/forms';
import { PublishedCards } from '@/components/revamp/live-content';
export const metadata = { title: 'Student resources' };
const sections = [
    ['guide', 'CS guide'],
    ['atoz', 'CS A–Z'],
    ['resume', 'Resume book'],
    ['forms', 'Forms'],
    ['faq', 'FAQ'],
] as const;
export default function Resources() {
    return (
        <div className="resources-document">
            <header>
                <h1>Student resources</h1>
                <p>Guides, opportunities, and chapter information in one place.</p>
            </header>
            <div className="resources-layout">
                <nav aria-label="Resource contents">
                    {sections.map(([id, title]) => (
                        <a key={id} href={`#${id}`}>
                            {title}
                        </a>
                    ))}
                </nav>
                <div className="resources-body legacy-content">
                    <section id="guide" aria-labelledby="guide-title">
                        <h2 id="guide-title">CS guide</h2>
                        <QuickAccess />
                        <UsefulInformation />
                        <PublishedCards kind="resource" />
                    </section>
                    <section id="atoz" aria-labelledby="atoz-title">
                        <h2 id="atoz-title">CS A–Z</h2>
                        <AtoZContent />
                    </section>
                    <section id="resume" aria-labelledby="resume-title">
                        <h2 id="resume-title">Resume book</h2>
                        <ResumeBook />
                    </section>
                    <section id="forms" aria-labelledby="forms-title">
                        <h2 id="forms-title">Forms</h2>
                        <PublishedCards kind="form" />
                        <Forms />
                    </section>
                    <section id="faq" aria-labelledby="faq-title">
                        <h2 id="faq-title">FAQ</h2>
                        <FAQ />
                    </section>
                </div>
            </div>
        </div>
    );
}
