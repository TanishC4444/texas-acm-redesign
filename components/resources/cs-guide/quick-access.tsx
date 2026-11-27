import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
const guideSections = [
    {
        theme: 'Getting Started at UTCS',
        description: 'Everything you need to know to get through your first year in UTCS.',
        links: [
            { name: 'Creating a CS Account', href: 'https://www.cs.utexas.edu/faq/691' },
            {
                name: 'SSHing into the Computer Labs',
                href: 'https://www.cs.utexas.edu/facilities/documentation/ssh-keys-cs-mac-and-linux',
            },
        ],
    },
    {
        theme: 'Career & Internships',
        description:
            'Prepare for your career with resume help, interview practice, and internship search strategies.',
        links: [
            {
                name: 'Resume Resources',
                href: 'https://careerservices.cns.utexas.edu/resources/resumes',
            },
            { name: 'CNS 12Twenty Portal', href: 'https://utexas.12twenty.com/dashboard/' },
        ],
    },
    {
        theme: 'CS Community',
        description: 'Connect with peers and get involved in the CS community at UT Austin.',
        links: [
            {
                name: 'List of CS/Tech Orgs',
                href: 'https://www.cs.utexas.edu/undergraduate-program/student-engagement-and-support/student-organizations',
            },
            { name: 'UTCS Calendar', href: 'https://apps.cs.utexas.edu/calendar/' },
        ],
    },
    {
        theme: 'Research',
        description: 'Find research groups, undergraduate opportunities, and UTCS publications.',
        links: [
            {
                name: 'Undergraduate Research Resources',
                href: 'https://www.cs.utexas.edu/undergraduate-program/student-engagement-and-support/undergraduate-research',
            },
            { name: 'UTCS Publications', href: 'https://www.cs.utexas.edu/research/publications' },
        ],
    },
];

export default function QuickAccess() {
    return (
        <div className="guide-directory">
            {guideSections.map((section, i) => (
                <article key={section.theme}>
                    <div className="guide-directory-title">
                        <span>0{i + 1}</span>
                        <h3>{section.theme}</h3>
                    </div>
                    <div>
                        <p>{section.description}</p>
                        <ul>
                            {section.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.name}
                                        <ArrowUpRight size={15} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            ))}
        </div>
    );
}
