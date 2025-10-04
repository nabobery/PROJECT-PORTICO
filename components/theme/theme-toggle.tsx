'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

/**
 * Render a circular button that toggles the application theme between light and dark with animated sun/moon icons.
 *
 * The button updates accessible attributes (aria-label, title and `aria-pressed` after hydration) to reflect the current theme and avoids theme-dependent rendering until the component has mounted to prevent hydration mismatches.
 *
 * @returns A JSX element: a themed toggle button that switches the UI theme and animates between sun and moon icons.
 */
export default function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // improve keyboard affordance and persistent aria-label
    // Toggle should act on the effective/resolved theme so it behaves correctly
    // when `theme === 'system'. Use the resolved/effective theme (which falls
    // back to `theme` if resolvedTheme isn't available) to decide the new value.
    const toggle = () => {
        const resolved = resolvedTheme ?? theme
        setTheme(resolved === 'light' ? 'dark' : 'light')
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    // only use theme-dependent attributes/animation after mount to avoid hydration mismatches
    // Prefer the resolvedTheme so that when `theme === 'system'` we reflect the actual
    // effective theme (light/dark) the user sees. Fall back to `theme` if resolvedTheme
    // is not yet available.
    const effectiveTheme = mounted ? (resolvedTheme ?? theme) : undefined
    const isDark = effectiveTheme === 'dark'

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="rounded-full h-10 w-10"
            {...(mounted ? { 'aria-pressed': isDark } : {})}
            aria-label={
                mounted
                    ? isDark
                        ? 'Switch to light theme'
                        : 'Switch to dark theme'
                    : 'Toggle theme'
            }
            title={
                mounted
                    ? isDark
                        ? 'Switch to light theme'
                        : 'Switch to dark theme'
                    : 'Toggle theme'
            }
        >
            <motion.div
                animate={{ rotate: mounted ? (isDark ? 180 : 0) : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="relative h-6 w-6"
            >
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: mounted ? (isDark ? 0 : 1) : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaSun className="h-5 w-5" />
                </motion.div>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mounted ? (isDark ? 1 : 0) : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaMoon className="h-5 w-5" />
                </motion.div>
            </motion.div>
        </Button>
    )
}
