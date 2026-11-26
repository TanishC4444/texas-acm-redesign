'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Play, Layers } from 'lucide-react';
import { instagramEmbedUrl, type InstagramPost } from '@/lib/instagram-data';
export default function InstagramFeed({
    compact = false,
    embedded = false,
}: {
    compact?: boolean;
    embedded?: boolean;
}) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        let active = true;
        let controller: AbortController | null = null;
        async function refresh() {
            if (document.hidden) return;
            controller?.abort();
            controller = new AbortController();
            try {
                const response = await fetch('/api/instagram', { signal: controller.signal });
                if (!response.ok) throw new Error();
                const data = await response.json();
                if (!active) return;
                if (data.status === 'connected') {
                    setPosts(data.posts);
                    setStatus('connected');
                } else {
                    setPosts([]);
                    setStatus('unavailable');
                }
            } catch (error) {
                if (active && !(error instanceof DOMException && error.name === 'AbortError')) {
                    setPosts([]);
                    setStatus('unavailable');
                }
            }
        }
        void refresh();
        const timer = setInterval(refresh, 900000);
        document.addEventListener('visibilitychange', refresh);
        return () => {
            active = false;
            controller?.abort();
            clearInterval(timer);
            document.removeEventListener('visibilitychange', refresh);
        };
    }, []);
    if (embedded) {
        const embeds = posts.slice(0, 3).flatMap((post) => {
            const src = instagramEmbedUrl(post.permalink);
            return src ? [{ ...post, src }] : [];
        });
        return (
            <section className="acm-instagram-feed" aria-labelledby="acm-instagram-feed-title">
                <div>
                    <h2 id="acm-instagram-feed-title">From Instagram</h2>
                    <a
                        className="rt-text-link"
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @texas_acm <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                </div>
                {embeds.length > 0 && (
                    <div className="acm-instagram-embeds">
                        {embeds.map((post, i) => (
                            <figure key={post.id}>
                                <iframe
                                    src={post.src}
                                    title={`Texas ACM Instagram post ${i + 1}`}
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                />
                                <figcaption>
                                    <a
                                        className="rt-text-link"
                                        href={post.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open post on Instagram
                                    </a>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                )}
            </section>
        );
    }
    if (compact && (status !== 'connected' || !posts.length))
        return (
            <section className="chapter-social-feature">
                <div>
                    <h2>@texas_acm</h2>
                    <p>Events, photos, and chapter updates.</p>
                </div>
                <a
                    href="https://www.instagram.com/texas_acm/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Instagram <ArrowUpRight size={24} />
                </a>
            </section>
        );
    return (
        <section className={`chapter-feed ${compact ? 'compact-feed' : ''}`}>
            <div className="chapter-feed-heading">
                <h2>
                    Fresh from
                    <br />
                    <em>the chapter.</em>
                </h2>
                <a
                    href="https://www.instagram.com/texas_acm/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Find Us on Instagram <ArrowUpRight size={18} />
                </a>
            </div>
            {status === 'loading' ? (
                <div className="feed-skeleton" role="status">
                    Checking the chapter feed…
                </div>
            ) : posts.length ? (
                <div className="chapter-posts">
                    {posts.map((post) => (
                        <a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chapter-post"
                        >
                            <div>
                                <img
                                    src={post.image}
                                    alt={post.caption.slice(0, 160) || 'Texas ACM Instagram post'}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                                {post.type === 'VIDEO' ? (
                                    <Play aria-label="Reel" />
                                ) : post.type === 'CAROUSEL_ALBUM' ? (
                                    <Layers aria-label="Multiple photos" />
                                ) : null}
                            </div>
                            <span>
                                <time dateTime={post.timestamp}>
                                    {new Date(post.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        timeZone: 'America/Chicago',
                                    })}
                                </time>
                                <ArrowUpRight size={18} />
                            </span>
                            <p>{post.caption || 'See the latest from Texas ACM.'}</p>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="chapter-feed-fallback">
                    <span aria-hidden="true">[ ↗ ]</span>
                    <h3>The latest is on Instagram.</h3>
                    <p>
                        {status === 'connected'
                            ? 'More chapter updates are on the way.'
                            : 'Check @texas_acm for current events, announcements, and photos.'}
                    </p>
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open the chapter feed ↗
                    </a>
                </div>
            )}
        </section>
    );
}
