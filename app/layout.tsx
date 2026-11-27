import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/app/studio.css';

import '@/app/machine.css';
import '@/app/runtime.css';
import '@/app/vibrant.css';
import '@/app/authority.css';
import '@/app/refinement.css';
import '@/app/signal.css';
import '@/app/chapter-motion.css';
import RouteMotion from '@/components/runtime/route-motion';
import 'lenis/dist/lenis.css';
import localFont from 'next/font/local';
import { SiteDirectoryProvider } from '@/components/runtime/site-directory';
import RuntimeProvider from '@/components/runtime/provider';
import { RuntimeDock } from '@/components/runtime/shell';
import { settingsScript } from '@/lib/runtime-settings';
const geist = localFont({
    src: '../public/fonts/runtime-geist.woff2',
    variable: '--font-geist',
    display: 'swap',
    weight: '100 900',
});
const geistMono = localFont({
    src: '../public/fonts/runtime-geist-mono.woff2',
    variable: '--font-geist-mono',
    display: 'swap',
    weight: '100 900',
});
import { SitePhotosProvider } from '@/components/revamp/site-photos';
import SiteAnalytics from '@/components/revamp/site-analytics';

import { SiteSoundProvider } from '@/components/revamp/site-sound';
import '@/app/fonts.css';

import { Toaster } from '@/components/ui/toaster';
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.texasacm.org'),
    title: { default: 'Texas ACM — UT Austin', template: '%s | Texas ACM' },
    description:
        'The UT Austin student chapter of the Association for Computing Machinery. Chapter events, student resources, industry connections, and community.',
    openGraph: {
        title: 'Texas ACM — UT Austin',
        description:
            'Academic events, industry connections, and student community at The University of Texas at Austin.',
        images: ['/home-page-slides/acmformal25.jpg'],
        type: 'website',
    },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="dark" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: settingsScript,
                    }}
                />
            </head>
            <body className={`runtime-app ${geist.variable} ${geistMono.variable}`}>
                {process.env.NODE_ENV === 'development' && (
                    <script async src="https://mcp.figma.com/mcp/html-to-design/capture.js" />
                )}
                <RuntimeProvider>
                    <SiteSoundProvider>
                        <SitePhotosProvider>
                            <SiteDirectoryProvider>
                                <SiteAnalytics />

                                <RuntimeDock />
                                <RouteMotion />
                                <main id="main-content" tabIndex={-1}>
                                    {children}
                                </main>
                                <Toaster />
                            </SiteDirectoryProvider>
                        </SitePhotosProvider>
                    </SiteSoundProvider>
                </RuntimeProvider>
            </body>
        </html>
    );
}
