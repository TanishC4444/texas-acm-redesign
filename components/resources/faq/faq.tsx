const faqItems = [
    {
        question: 'What is ACM/Texas ACM?',
        answer: "The Association for Computing Machinery (ACM) is the world's largest scientific computing organization. Texas ACM is the student chapter at UT Austin, focused on promoting interest in computer science and providing resources for CS students.",
    },
    {
        question: 'Do I need to be a CS major to join?',
        answer: 'No! While we primarily serve CS students, we welcome members from all majors who are interested in computing and technology.',
    },
    {
        question: 'Are there membership dues?',
        answer: 'Membership is completely free! There are no dues or fees to join Texas ACM.',
    },
    {
        question: 'How can I get more involved?',
        answer: 'The best way to get more involved is to attend our events! From there, you can ask an officer about leading an initiative and apply for officer positions when they open up.',
    },
    {
        question: 'Does ACM help with internships and jobs?',
        answer: 'Yes! We host company info sessions, resume workshops, and networking events specifically designed to help members secure internships and full-time positions. We also have a resume book that companies can access to find candidates. On top of that, leading an initiative or being an officer looks great on your resume and can help you build valuable skills.',
    },
    {
        question: 'Where do I apply to be an officer?',
        answer: 'Officer applications for Junior positions open at the beginning of each fall semester. In the Spring, we hold elections for the Executive Board. After elections, applications for Senior and internal officer positions open near the end of the Spring semester.',
    },
    {
        question: 'How do ACM elections work?',
        answer: 'ACM elections use ranked-choice voting. To vote, you must have attended at least 3 ACM events in the same academic year. For more specific questions, reach out to the executive team.',
    },
];

export default function FAQ() {
    return (
        <div className="resource-faq">
            {faqItems.map((item) => (
                <article key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                </article>
            ))}
        </div>
    );
}
