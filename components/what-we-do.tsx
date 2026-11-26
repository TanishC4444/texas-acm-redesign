import { Building2, BookOpen, Users } from 'lucide-react';
const pillars = [
    {
        name: 'Industry',
        Icon: Building2,
        text: 'Company tech talks, professional workshops, our resume book, and the ACM Corporate Banquet.',
        href: '/events#industry',
    },
    {
        name: 'Academics',
        Icon: BookOpen,
        text: 'Technical workshops, guest speakers, hackathons, and Pancakes with Professors.',
        href: '/events#academics',
    },
    {
        name: 'Community',
        Icon: Users,
        text: 'Game nights, retreats, mentorship, and CS Week. A community beyond the classroom.',
        href: '/events#community',
    },
];
export default function WhatWeDo() {
    return (
        <section className="chapter-pillars studio-section">
            <h2>Three pillars. One chapter.</h2>
            <p>
                Texas ACM supports the academic, professional, and social development of UT Austin
                students.
            </p>
            <div className="chapter-pillar-grid">
                {pillars.map(({ name, Icon, text, href }) => (
                    <a href={href} key={name}>
                        <Icon size={40} aria-hidden="true" />
                        <h3>{name}</h3>
                        <p>{text}</p>
                        <span>Explore events ↗</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
