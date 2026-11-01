import AtoZHero from '@/components/resources/atoz/atoz-hero';
import AtoZContent from '@/components/resources/atoz/atoz-content';
import DisclaimerBanner from '@/components/resources/atoz/disclaimer-banner';

export default function AtoZPage() {
    return (
        <div className="legacy-content min-h-screen">
            <AtoZHero />
            {/* <DisclaimerBanner /> */}
            <AtoZContent />
        </div>
    );
}
