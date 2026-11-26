import { PageIntro } from '@/components/runtime/primitives';
import QuickAccess from '@/components/resources/cs-guide/quick-access';
import UsefulInformation from '@/components/resources/cs-guide/useful-information';
export const metadata = { title: 'CS Guide' };
export default function Guide() {
    return (
        <div className="rt-page">
            <PageIntro
                label="CS Guide"
                title="Start here. Keep exploring."
                description="Academic, research and career resources for UTCS students."
            />
            <div className="rt-split" id="guide" data-section-title="Start">
                <div className="rt-cell rt-sticky">
                    <h2>Get started at UTCS.</h2>
                    <p>Accounts, campus resources, internships and research.</p>
                </div>
                <div className="rt-cell rt-guide">
                    <QuickAccess />
                </div>
            </div>
            <div className="rt-split" id="information" data-section-title="Plan">
                <div className="rt-cell rt-sticky">
                    <h2>Plan your path.</h2>
                    <p>Degree planning, honors and graduate study.</p>
                </div>
                <div className="rt-cell rt-guide">
                    <UsefulInformation />
                </div>
            </div>
        </div>
    );
}
