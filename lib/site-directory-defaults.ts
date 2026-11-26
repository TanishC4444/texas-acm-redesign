import { faqItems } from '@/lib/runtime-faq';
import { glossarySections, termId } from '@/lib/runtime-glossary';
import { currentPartners } from '@/lib/runtime-partners';
import { officers } from '@/lib/officers';
import { allForms } from '@/lib/forms-data';
import { normalizeDeadline } from '@/lib/runtime-forms';
import { directoryEntry, type DirectoryEntry, type DirectoryKind } from '@/lib/site-directory';

const seenTerms = new Map<string, number>();
const glossary = glossarySections.flatMap(({ title, items }) =>
    items.map((item) => {
        const base = 'term-' + termId(item.term);
        const count = (seenTerms.get(base) ?? 0) + 1;
        seenTerms.set(base, count);
        return directoryEntry('glossary', count === 1 ? base : `${base}-${count}`, item.term, {
            description: item.description,
            category: title,
            url:
                'url' in item && typeof item.url === 'string'
                    ? item.url.replace(/^http:\/\//, 'https://')
                    : '',
        });
    }),
);

export const defaultsByKind: Record<DirectoryKind, DirectoryEntry[]> = {
    glossary,
    faq: faqItems.map(({ question, answer }) =>
        directoryEntry('faq', 'faq-' + termId(question), question, { description: answer }),
    ),
    link: [
        ['guide', 'CS Guide', 'Find your footing in UT Computer Science.', '/cs-guide'],
        ['atoz', 'CS A–Z', 'Look up courses, tools, and campus terms.', '/atoz'],
        ['forms', 'Forms', 'Find chapter applications and submissions.', '/forms'],
        [
            'resume-book',
            'Resume book',
            'Submit your resume through the UTCS portal.',
            'https://apps.cs.utexas.edu/resume/index.scgi',
        ],
        ['faq', 'FAQ', 'Get answers about joining and taking part.', '/faq'],
    ].map(([id, title, description, url]) =>
        directoryEntry('link', id, title, { description, url }),
    ),
    contact: [
        directoryEntry('contact', 'chapter-contact', 'Chapter questions', {
            url: 'mailto:pres@texasacm.org',
        }),
        directoryEntry('contact', 'corporate-contact', 'Partnerships & ambassadors', {
            url: 'mailto:corporate@texasacm.org',
        }),
        directoryEntry('contact', 'club-contact', 'CS club collaboration', {
            url: 'mailto:pres@texasacm.org',
        }),
    ],
    partner: [
        ...currentPartners.map(({ name, logo, tier, url }) =>
            directoryEntry('partner', 'partner-' + termId(name), name, {
                image: logo,
                category: tier,
                url,
            }),
        ),
        directoryEntry('partner', 'partner-paycom', 'Paycom', {
            image: '/partners/paycom.png',
            category: 'Banner only',
            url: 'https://www.paycom.com',
        }),
        directoryEntry('partner', 'partner-dell', 'Dell Technologies', {
            image: '/partners/dell.png',
            category: 'Banner only',
            url: 'https://www.dell.com',
        }),
        directoryEntry('partner', 'partner-visa', 'Visa', {
            image: '/network-comp/visa.png',
            category: 'Banner only',
            url: 'https://www.visa.com',
        }),
    ],
    officer: officers.map(({ name, image, position, bio, socials }) =>
        directoryEntry('officer', 'profile-' + termId(name), name, {
            description: bio,
            category: position,
            image:
                '/studio/officers/' +
                image
                    .split('/')
                    .pop()!
                    .replace(/\.[^.]+$/, '') +
                '.webp',
            links: socials.map(({ url }) => url.replace(/^http:\/\//, 'https://')).join('\n'),
        }),
    ),
    form: allForms.map((form) =>
        directoryEntry('form', 'form-' + termId(form.title), form.title, {
            description: form.description,
            url: form.link.href,
            category: normalizeDeadline(form.internalDeadline) ?? '',
        }),
    ),
};
