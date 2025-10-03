'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

/**
 * Render a hydration-safe theme toggle button that switches the app between light and dark themes.
 *
 * Delays theme-dependent attributes and animations until after the component is mounted to avoid
 * hydration mismatches. On click, toggles the theme between `'light'` and `'dark'`. After mount,
 * the control exposes `aria-pressed`, updates its `aria-label` and `title` to reflect the target
 * action, and visually indicates state with a rotating container and a crossfade between sun and
 * moon icons.
 *
 * @returns The Button JSX element that toggles the theme and includes animated sun/moon icons; when mounted, `aria-pressed` reflects whether the theme is dark.
 */
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // improve keyboard affordance and persistent aria-label
    const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')

    useEffect(() => {
        setMounted(true)
    }, [])

    // only use theme-dependent attributes/animation after mount to avoid hydration mismatches
    const isDark = mounted ? theme === 'dark' : false

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