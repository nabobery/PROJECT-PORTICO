import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { CursorRipple } from '@/components/ui/cursor-ripple'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://avinashchangrani.vercel.app'),
    title: 'Avinash Changrani | AI & Full-Stack Developer Portfolio (PORTICO)',
    description:
        "Explore Avinash Changrani's portfolio: an AI/ML and Full-Stack Software Engineer showcasing innovative projects, expertise in Next.js, React, Python, and more. Discover insights into dynamic rule engines, RAG pipelines, and scalable software solutions.",
    keywords: [
        'Avinash Changrani',
        'Portfolio',
        'Next.js',
        'React',
        'TypeScript',
        'Full-Stack Developer',
        'Software Engineer',
        'AI',
        'Machine Learning',
        'Python',
        'Java',
        'Web Development',
        'PORTICO',
        'Software Development',
        'Tech Portfolio',
    ],
    authors: [
        { name: 'Avinash Changrani', url: 'https://github.com/nabobery' },
    ],
    openGraph: {
        title: 'Avinash Changrani | AI & Full-Stack Developer Portfolio',
        description:
            'Discover innovative projects and expertise in AI/ML and Full-Stack development by Avinash Changrani.',
        url: 'https://avinashchangrani.vercel.app',
        siteName: "Avinash Changrani's Portfolio",
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: "Avinash Changrani's Portfolio Open Graph Image",
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    icons: {
        icon: '/portico.png',
    },
    robots: {
        // Optional: good for SEO
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

/**
 * Root layout component that establishes the document structure, global fonts, and theming.
 *
 * Renders the <html> and <body> elements with configured font classes, injects a pre-hydration script to apply the preferred color scheme to avoid theme flash, and composes the page with ThemeProvider, CursorRipple, Navbar, main content area, Footer, and Toaster.
 *
 * @param children - Page content to render inside the layout's main area
 * @returns The root HTML structure as a React element
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    inter.className,
                    inter.variable,
                    poppins.variable,
                    spaceGrotesk.variable,
                    'bg-background font-sans antialiased'
                )}
            >
                {/* Prevent theme flash on first paint: initialize class before hydration */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "(function(){try{var s='theme';var t=localStorage.getItem(s)||'system';var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||(t==='system'&&m);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();",
                    }}
                />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <CursorRipple />
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
