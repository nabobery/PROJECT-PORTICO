import type { ReactNode } from 'react'
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
} from '@tanstack/react-router'
import { MotionConfig } from 'framer-motion'
import appCss from '../styles/globals.css?url'
import { DEPLOY_ENV } from '../deploy-env.ts'
import { documentHead, personJsonLd, serializeJsonLd } from '../lib/site.ts'
import { ThemeProvider } from '@/components/theme/theme-provider'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { CursorRipple } from '@/components/ui/cursor-ripple'
import { NotFound } from '../components/not-found.tsx'
import { RouteError } from '../components/route-error.tsx'

export const Route = createRootRoute({
    head: () => {
        const head = documentHead(DEPLOY_ENV)
        return {
            meta: [
                { charSet: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                ...head.meta,
            ],
            links: [
                {
                    rel: 'preload',
                    href: '/fonts/inter-latin-wght-normal.woff2',
                    as: 'font',
                    type: 'font/woff2',
                    crossOrigin: 'anonymous',
                },
                { rel: 'stylesheet', href: appCss },
                ...head.links,
            ],
        }
    },
    component: RootComponent,
    notFoundComponent: NotFound,
    errorComponent: RouteError,
})

const NO_SCRIPT_CSS =
    '[style*="opacity:0"]{opacity:1!important;transform:none!important}'

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

/**
 * Document shell ported from app/layout.tsx. next-themes renders the single
 * pre-paint theme script, so the layout's duplicate inline script is gone.
 */
function RootDocument({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
                {/* Without JavaScript, entrance animations never run; show their
                    server-rendered start state at full opacity instead. */}
                <noscript>
                    <style>{NO_SCRIPT_CSS}</style>
                </noscript>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(personJsonLd()),
                    }}
                />
            </head>
            <body className="bg-background font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    {/* Honors prefers-reduced-motion for every framer-motion animation. */}
                    <MotionConfig reducedMotion="user">
                        <CursorRipple />
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <Toaster />
                    </MotionConfig>
                </ThemeProvider>
                <Scripts />
            </body>
        </html>
    )
}
