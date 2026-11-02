import { NextResponse } from 'next/server';
import { normalizeInstagramPosts } from '@/lib/instagram-data';
export const runtime = 'nodejs';
const empty = () =>
    NextResponse.json(
        { status: 'unavailable', posts: [] },
        { headers: { 'Cache-Control': 'no-store' } },
    );
export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const account = process.env.INSTAGRAM_USER_ID;
    const version = process.env.INSTAGRAM_API_VERSION;
    if (!token || !account || !/^\d+$/.test(account) || !version || !/^v\d+\.\d+$/.test(version))
        return empty();
    const host =
        process.env.INSTAGRAM_LOGIN_TYPE === 'facebook'
            ? 'graph.facebook.com'
            : 'graph.instagram.com';
    const options = {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(8000),
    };
    try {
        // Refuse a misconfigured account rather than publishing another account's media.
        const profileResponse = await fetch(
            `https://${host}/${version}/${account}?fields=username`,
            options,
        );
        if (!profileResponse.ok) return empty();
        const profile = await profileResponse.json();
        if (profile.username?.toLowerCase() !== 'texas_acm') return empty();
        const response = await fetch(
            `https://${host}/${version}/${account}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12`,
            { ...options, signal: AbortSignal.timeout(8000) },
        );
        if (!response.ok) return empty();
        const payload = await response.json();
        if (!Array.isArray(payload.data)) return empty();
        return NextResponse.json(
            { status: 'connected', posts: normalizeInstagramPosts(payload.data) },
            { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } },
        );
    } catch {
        // Never expose provider responses, credentials, or request URLs to visitors/logs.
        return empty();
    }
}
