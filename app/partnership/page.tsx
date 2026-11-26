import ManagedPhoto from '@/components/revamp/site-photos';
import Companies, { CorporateContact, PartnerDirectory } from '@/components/runtime/companies';
export const metadata = { title: 'Partnerships' };
export default function Partnership() {
    return (
        <div className="rt-page acm-partnership">
            <section className="acm-partner-opening">
                <div>
                    <h1>
                        Connect with <em>Texas computing.</em>
                    </h1>
                    <p>Meet the students shaping what comes next.</p>
                    <CorporateContact label="Partner with ACM" />
                </div>
                <div className="acm-partner-image">
                    <ManagedPhoto
                        slot="industry"
                        src="/studio/acmformal25.webp"
                        alt="Texas ACM students at a chapter formal"
                        width="1200"
                        height="900"
                        fetchPriority="high"
                    />
                </div>
            </section>
            <Companies />
            <section className="acm-packages" id="packages">
                <header className="acm-packages-title" id="benefits">
                    <div>
                        <h2>Partnership opportunities</h2>
                        <p>
                            Host an event, share your work with students, or join us at the
                            corporate networking banquet.
                        </p>
                    </div>
                    <CorporateContact label="Contact the corporate team" />
                </header>
                <div className="acm-package-options">
                    {[
                        {
                            tier: 'Silver',
                            headline: 'Meet the chapter',
                            benefits: [
                                'Host company talks and workshops',
                                'Attend the corporate banquet',
                                'Access the banquet resume book',
                            ],
                        },
                        {
                            tier: 'Gold',
                            headline: 'Go beyond the talk',
                            benefits: [
                                'All Silver benefits',
                                'Host a company-branded Hack Night',
                                'Access the chapter-wide resume book',
                            ],
                        },
                        {
                            tier: 'Platinum',
                            headline: 'Build a deeper partnership',
                            benefits: [
                                'All Gold benefits',
                                'More events and Hack Nights',
                                'Priority scheduling and expanded banquet participation',
                            ],
                        },
                    ].map(({ tier, headline, benefits }) => (
                        <article key={tier} data-tier={tier.toLowerCase()}>
                            <h3>{tier}</h3>
                            <p>{headline}</p>
                            <ul>
                                {benefits.map((benefit) => (
                                    <li key={benefit}>{benefit}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
                <p className="acm-package-note">
                    Contact our team for current terms and availability.
                </p>
            </section>
            <PartnerDirectory />
        </div>
    );
}
