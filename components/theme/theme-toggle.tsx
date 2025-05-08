'use client'

import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-full h-10 w-10"
            aria-label="Toggle theme"
        >
            <motion.div
                animate={{ rotate: theme === 'light' ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="relative h-6 w-6"
            >
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: theme === 'light' ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaSun className="h-5 w-5" />
                </motion.div>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: theme === 'light' ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaMoon className="h-5 w-5" />
                </motion.div>
            </motion.div>
        </Button>
    )
}
