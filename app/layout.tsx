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
    title: 'Code & Development Maestro | Portfolio',
    description:
        'Professional portfolio showcasing coding expertise and development projects',
}

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
