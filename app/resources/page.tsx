import SectionRedirect from '@/components/runtime/section-redirect';

export default function Resources() {
    return (
        <SectionRedirect
            fallback="/#resources"
            label="Go to student resources"
            destinations={{
                guide: '/cs-guide',
                atoz: '/atoz',
                resume: '/#resume-book',
                forms: '/forms',
                faq: '/faq',
            }}
        />
    );
}
