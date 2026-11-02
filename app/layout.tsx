import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/app/studio.css';
import '@/app/universe.css';
import '@/app/experience.css';
import VisualControls from '@/components/revamp/visual-controls';
import '@/app/fonts.css';
import { SiteHeader, SiteFooter } from '@/components/revamp/site-shell';
import { Toaster } from '@/components/ui/toaster';
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.texasacm.org'),
    title: { default: 'Texas ACM — Your people. Your next big thing.', template: '%s | Texas ACM' },
    description:
        'Your people in computer science at UT Austin. Explore Texas ACM events, student resources, and a community open to every major.',
    openGraph: {
        title: 'Texas ACM — Your people. Your next big thing.',
        description: 'A little curiosity. A lot of community. Find your people at UT Austin.',
        images: ['/home-page-slides/acmformal25.jpg'],
        type: 'website',
    },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try { const t = localStorage.getItem('acm-theme'); const d = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.dataset.theme = d ? 'dark' : 'light'; document.documentElement.classList.toggle('dark', d); } catch {}`,
                    }}
                />
            </head>
            <body>
                {process.env.NODE_ENV === 'development' &&
                    process.env.NEXT_PUBLIC_FIGMA_CAPTURE === '1' && (
                        <script async src="https://mcp.figma.com/mcp/html-to-design/capture.js" />
                    )}
                <SiteHeader />
                <main id="main-content" tabIndex={-1}>
                    {children}
                </main>
                <SiteFooter />
                <VisualControls />
                <Toaster />
            </body>
        </html>
    );
}
