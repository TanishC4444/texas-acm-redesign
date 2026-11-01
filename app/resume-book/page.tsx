import ResumeBook from '@/components/resources/resume-book/resume-book';
import ResumeBookHero from '@/components/resources/resume-book/resume-book-hero';

export default function ResumeBookPage() {
    return (
        <div className="legacy-content min-h-screen">
            <ResumeBookHero />
            <ResumeBook />
        </div>
    );
}
