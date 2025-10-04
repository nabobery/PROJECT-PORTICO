'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaAlignRight, FaCode } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ThemeToggle from '@/components/theme/theme-toggle'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLockScroll } from '@/lib/use-lock-scroll'

const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Tech Stack', href: '#tech-radar' },
    { name: 'CP Stats', href: '#competitive-stats' },
    // { name: 'Blog', href: '#blog' }, // Commented out Blog link
    { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY
            setScrollPosition(position)

            // Find the current active section based on scroll position
            const sections = navItems.map((item) => item.href.substring(1))
            for (const section of sections.reverse()) {
                const element = document.getElementById(section)
                if (element && position >= element.offsetTop - 200) {
                    setActiveSection(section)
                    break
                }
            }
        }

        handleScroll() // Initial check
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock scroll when mobile menu is open
    useLockScroll(isMenuOpen)

    // Handle ESC key to close menu
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isMenuOpen])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrollPosition > 50
                    ? 'bg-background/80 backdrop-blur-md shadow-sm py-4'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 safe-area">
                <nav className="flex items-center justify-between overflow-visible">
                    {/* Logo */}
                    <Link
                        href="#"
                        className="text-xl font-bold flex items-center gap-2 font-heading"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: 0.1,
                            }}
                            className="relative"
                        >
                            <FaCode className="h-8 w-8 text-primary" />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Avinash Changrani
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex gap-6">
                            {navItems.map((item, i) => (
                                <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'text-sm font-medium relative hover:text-primary transition-colors',
                                            activeSection ===
                                                item.href.substring(1)
                                                ? 'text-primary'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        {item.name}
                                        {activeSection ===
                                            item.href.substring(1) && (
                                            <motion.span
                                                layoutId="activeSection"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 380,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                        <ThemeToggle />
                        <Button asChild>
                            <Link href="#contact">Get in Touch</Link>
                        </Button>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex items-center gap-4 md:hidden safe-area-inset-right">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={
                                        isMenuOpen ? 'Close menu' : 'Open menu'
                                    }
                                    aria-expanded={isMenuOpen}
                                >
                                    <span className="relative z-50">
                                        <FaAlignRight className="h-6 w-6" />
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[280px] sm:w-[350px]"
                            >
                                <nav
                                    className="flex flex-col gap-6"
                                    aria-label="Mobile navigation"
                                >
                                    {/* Mobile Navigation Links */}
                                    <ul className="flex flex-col gap-4">
                                        {navItems.map((item, i) => (
                                            <motion.li
                                                key={item.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * i }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        'block py-3 text-lg font-medium text-center hover:text-primary transition-colors',
                                                        activeSection ===
                                                            item.href.substring(
                                                                1
                                                            )
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground'
                                                    )}
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    {item.name}
                                                </Link>
                                            </motion.li>
                                        ))}
                                        <motion.li
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mt-2"
                                        >
                                            <Button
                                                asChild
                                                className="w-full"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <Link href="#contact">
                                                    Get in Touch
                                                </Link>
                                            </Button>
                                        </motion.li>
                                    </ul>

                                    {/* Theme Toggle in Mobile Menu */}
                                    <div className="border-t pt-6">
                                        <div className="flex justify-center">
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </div>
        </header>
    )
}
