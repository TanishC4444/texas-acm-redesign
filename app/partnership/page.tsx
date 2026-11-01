import CurrentPartners from '@/components/current-partners';
import PartnerWithUs from '@/components/partner-with-us';
import PartnershipHero from '@/components/partnership-hero';
import WhyPartnerWithUs from '@/components/why-partner-with-us';

export default function PartnershipPage() {
    return (
        <div className="legacy-content min-h-screen">
            <PartnershipHero />
            <WhyPartnerWithUs />
            <PartnerWithUs />
            <CurrentPartners />
        </div>
    );
}
