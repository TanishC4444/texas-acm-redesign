import { PageIntro, RouteLink } from '@/components/runtime/primitives';
export default function NotFound() {
    return (
        <div className="rt-page">
            <PageIntro
                label="404"
                title="Page not found."
                description="Press ⌘K to search."
                action={<RouteLink href="/">Go home</RouteLink>}
            />
        </div>
    );
}
