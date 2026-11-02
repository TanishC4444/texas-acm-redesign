'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Play, Layers } from 'lucide-react';
import type { InstagramPost } from '@/lib/instagram-data';
export default function InstagramFeed({ compact = false }: { compact?: boolean }) {
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
            } catch {
                if (active) {
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
                    Find us on Instagram <ArrowUpRight size={18} />
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
