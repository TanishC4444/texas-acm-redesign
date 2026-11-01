// app/events/page.tsx
import CSGuideHero from '@/components/resources/cs-guide/cs-guide-hero';
import QuickAccess from '@/components/resources/cs-guide/quick-access';
import UsefulInformation from '@/components/resources/cs-guide/useful-information';

export default async function CSGuidePage() {
    return (
        <div className="legacy-content min-h-screen">
            <CSGuideHero />
            <QuickAccess />
            <UsefulInformation />
        </div>
    );
}
