import Campaign from '@/components/runtime/campaign';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!['cs-week', 'elections'].includes(slug)) notFound();
    return <Campaign slug={slug} />;
}
