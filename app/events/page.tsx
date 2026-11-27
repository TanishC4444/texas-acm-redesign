import SectionRedirect from '@/components/runtime/section-redirect';

export default function Events() {
    return (
        <SectionRedirect
            fallback="/#calendar"
            label="Go to the calendar"
            destinations={{
                industry: '/#industry',
                academics: '/#academics',
                community: '/#community',
            }}
        />
    );
}
