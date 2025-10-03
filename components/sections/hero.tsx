'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Typed from 'typed.js'
import Link from 'next/link'
import { FaArrowDown, FaTerminal } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { ParticleCanvas } from '@/components/ui/particle-canvas'

/**
 * Render the hero section of the homepage with background particles, an animated intro badge, a typed-role headline, descriptive text, and action buttons.
 *
 * Initializes a Typed.js typing animation for the role label and cleans it up on unmount; all motion respects the user's reduced-motion preference.
 *
 * @returns The JSX element for the hero section.
 */
export default function Hero() {
    const typedRef = useRef<HTMLSpanElement>(null)
    const typedInstance = useRef<Typed | null>(null)
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        if (typedRef.current) {
            const options = {
                strings: [
                    'Problem Solver',
                    'Full-Stack Developer',
                    'AI/ML Engineer',
                    'Software Architect',
                ],
                typeSpeed: 70,
                backSpeed: 40,
                backDelay: 1200,
                loop: true,
                cursorChar: '|',
            }
            typedInstance.current = new Typed(typedRef.current, options)
        }
        return () => {
            typedInstance.current?.destroy()
        }
    }, [])

    return (
        <section
            id="home"
            className="relative overflow-hidden min-h-screen flex items-center pt-20 md:pt-0"
        >
            <div className="absolute inset-0 z-0">
                <ParticleCanvas />

                {/* overlay between canvas and content to improve text contrast */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none z-[5]"
                >
                    {/* Desktop: subtle gradient overlay; use CSS variables so dark/light are controlled in globals.css */}
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent to-white/10 dark:to-black/60" />
                    {/* Mobile: slightly stronger translucent layer for readability */}
                    <div className="md:hidden absolute inset-0 bg-white/10 dark:bg-black/60" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl">
                    <div className="flex flex-col gap-6 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.5,
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 self-center md:self-start"
                        >
                            <FaTerminal size={16} />
                            <span className="text-sm font-medium">
                                Ready to code something amazing
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.5,
                                delay: shouldReduceMotion ? 0 : 0.1,
                            }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight"
                        >
                            Hi, I&apos;m Avinash, <br className="md:hidden" />a{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                <span ref={typedRef}></span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.5,
                                delay: shouldReduceMotion ? 0 : 0.2,
                            }}
                            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0"
                        >
                            Passionate AI/ML and Full-Stack Engineer dedicated
                            to building intelligent, scalable solutions.
                            Experienced in developing robust applications and
                            systems using diverse technologies.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.5,
                                delay: shouldReduceMotion ? 0 : 0.3,
                            }}
                            className="flex flex-wrap gap-4 justify-center md:justify-start"
                        >
                            <Button size="lg" asChild>
                                <Link href="#projects">View My Work</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="#contact">Get In Touch</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    delay: shouldReduceMotion ? 0 : 1,
                    duration: shouldReduceMotion ? 0 : 0.5,
                }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            >
                <Link href="#about" aria-label="Scroll down">
                    <motion.div
                        animate={
                            shouldReduceMotion ? { y: 0 } : { y: [0, 8, 0] }
                        }
                        transition={
                            shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                  }
                        }
                    >
                        <FaArrowDown className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" />
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    )
}