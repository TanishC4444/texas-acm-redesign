import FAQ from '@/components/resources/faq/faq';
import FAQHero from '@/components/resources/faq/faq-hero';

export default function FAQPage() {
    return (
        <div className="legacy-content min-h-screen">
            <FAQHero />
            <FAQ />
        </div>
    );
}
