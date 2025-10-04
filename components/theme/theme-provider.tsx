'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

/**
 * ThemeProvider wrapper that respects `prefers-reduced-motion` and avoids
 * global layout animations which can cause jank or content flashes. It also
 * defaults `disableTransitionOnChange` to true to prevent CSS transition
 * flashes when theme toggles.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

        const setReduceMotionClass = (enabled: boolean) => {
            document.documentElement.classList.toggle('reduce-motion', enabled)
        }

        setReduceMotionClass(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setReduceMotionClass(e.matches)
        }

        // Feature-detect modern addEventListener/removeEventListener on MediaQueryList
        // and fall back to deprecated addListener/removeListener for older browsers.
        interface MediaQueryListLegacy extends MediaQueryList {
            addListener(listener: (event: MediaQueryListEvent) => void): void
            removeListener(listener: (event: MediaQueryListEvent) => void): void
        }

        const maybeLegacy =
            mediaQuery as unknown as Partial<MediaQueryListLegacy>

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }

        if (typeof maybeLegacy.addListener === 'function') {
            // Older browsers implement addListener/removeListener
            maybeLegacy.addListener!(handleChange)
            return () => maybeLegacy.removeListener!(handleChange)
        }

        // As a last resort, no-op cleanup
        return undefined
    }, [])

    // Ensure we disable the theme transition during toggles to avoid flash;
    // allow callers to override by passing `disableTransitionOnChange` in props.
    return (
        <NextThemesProvider
            {...props}
            disableTransitionOnChange={props.disableTransitionOnChange ?? true}
        >
            {children}
        </NextThemesProvider>
    )
}
