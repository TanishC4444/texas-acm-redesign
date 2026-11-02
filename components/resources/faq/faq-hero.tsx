import ChapterPageHero from '@/components/revamp/page-hero';
export default function FAQHero() {
    return (
        <ChapterPageHero
            title={'Frequently asked questions'}
            description={
                'Answers about membership, chapter events, and getting involved in Texas ACM.'
            }
            image={'acmhand25'}
            alt={'Texas ACM students at a campus organization fair'}
        />
    );
}
