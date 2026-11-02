const guidance = [
    {
        title: 'Academics',
        text: 'Review your degree plan and meet your academic advisor before registration.',
        links: [
            [
                'Degree plans',
                'https://www.cs.utexas.edu/undergraduate-program/academics/curriculum/degree-plans',
            ],
            ['Course syllabi', 'https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/'],
            [
                'Grade distributions',
                'https://reports.utexas.edu/spotlight-data/ut-course-grade-distributions',
            ],
        ],
    },
    {
        title: 'Research & honors',
        text: 'Explore undergraduate research, Turing Scholars, and dual-degree programs.',
        links: [
            ['Freshman Research Initiative', 'https://fri.cns.utexas.edu/students/apply-fall'],
            ['Turing Scholars', 'https://www.cs.utexas.edu/turing-scholars'],
            ['X + CS', 'https://www.cs.utexas.edu/undergraduate-program/x-cs-degree-program'],
        ],
    },
    {
        title: 'Graduate study',
        text: 'Learn about UT’s integrated BS/MS and online graduate programs.',
        links: [
            [
                'Integrated BS/MS',
                'https://www.cs.utexas.edu/undergraduate-program/academics/curriculum/5-year-cs-bsms',
            ],
            ['Online graduate programs', 'https://cdso.utexas.edu/'],
        ],
    },
    {
        title: 'Student support',
        text: 'Use office hours, form study groups, and seek support when you need it.',
        links: [['Counseling & Mental Health Center', 'https://healthyhorns.utexas.edu/cmhc/']],
    },
];
export default function UsefulInformation() {
    return (
        <div className="resource-guidance">
            {guidance.map((item) => (
                <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <ul>
                        {item.links.map(([label, url]) => (
                            <li key={url}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {label} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>
            ))}
        </div>
    );
}
