import AboutHero from '@/components/about-hero';
import WhatWeDo from '@/components/what-we-do';
import OfficerHero from '@/components/officer-hero';
import OfficerTeam from '@/components/officer-team';
import AcmNetwork from '@/components/ui/acm-network';

export default function AboutPage() {
    return (
        <div className="legacy-content min-h-screen">
            <AboutHero />
            <WhatWeDo />
            <OfficerHero />
            <OfficerTeam />
        </div>
    );
}
