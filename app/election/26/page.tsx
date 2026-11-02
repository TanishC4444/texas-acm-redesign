// app/events/page.tsx
import Candidates2627 from '@/components/resources/election/Candidates2627';
import ElectionHero from '@/components/resources/election/ElectionHero';

export default async function ElectionPage() {
    return (
        <div className="legacy-content min-h-screen">
            <ElectionHero />
            <Candidates2627 />
        </div>
    );
}
