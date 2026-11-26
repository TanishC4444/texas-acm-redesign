import ChapterPageHero from '@/components/revamp/page-hero';
export default function CalendarHero() {
    return (
        <ChapterPageHero
            photoSlot="community"
            title={'Chapter calendar'}
            description={
                'Your live chapter calendar. Workshops, tech talks, and time with your people.'
            }
            image={'familyfeud25'}
            alt={'Students at Texas ACM Family Feud'}
        />
    );
}
