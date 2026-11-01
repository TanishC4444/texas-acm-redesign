import { PublishedCards } from '@/components/revamp/live-content';
import Forms from '@/components/resources/forms/forms';
import FormsHero from '@/components/resources/forms/forms-hero';

export default function FormsPage() {
    return (
        <div className="legacy-content min-h-screen">
            <FormsHero />
            <div className="studio-section">
                <PublishedCards kind="form" />
            </div>
            <Forms />
        </div>
    );
}
