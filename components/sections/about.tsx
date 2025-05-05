'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
    Calendar,
    Code,
    GraduationCap,
    User,
    Briefcase,
    Heart,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const interests = [
    { icon: Code, label: 'Open Source' },
    { icon: GraduationCap, label: 'AI/ML Exploration' },
    { icon: Calendar, label: 'Tech Meetups' },
    { icon: Heart, label: 'Problem Solving (LeetCode)' },
]

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.3 })

    return (
        <section id="about" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-sm font-medium text-primary mb-3"
                    >
                        <User size={18} />
                        <span>About Me</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
                    >
                        My Journey as a Developer
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={
                            isInView
                                ? { opacity: 1, width: 120 }
                                : { opacity: 0, width: 0 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-1 bg-primary"
                    />
                </div>

                <div
                    ref={ref}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -50 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/30 p-1">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                            <Image
                                src="https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg"
                                alt="Developer portrait"
                                width={600}
                                height={600}
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-bold font-heading">
                                My Journey in Tech
                            </h3>

                            <p className="text-muted-foreground">
                                I&apos;m an AI/ML and Full-Stack Software
                                Engineer specializing in building intelligent,
                                scalable solutions. My experience spans
                                designing dynamic rule engines, RAG pipelines,
                                efficient background processing, and interactive
                                dashboards using technologies like Python, Java,
                                React, Next.js, and TypeScript.
                            </p>

                            <p className="text-muted-foreground">
                                I enjoy tackling complex problems, bridging the
                                gap between robust backend systems and engaging
                                frontend experiences, ensuring applications are
                                performant, maintainable, and user-friendly.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h4 className="text-lg font-semibold">Education</h4>
                            <div className="space-y-4 p-4 border rounded-lg bg-background">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="text-primary w-6 h-6" />
                                    <div>
                                        <h5 className="font-semibold">
                                            IIITDM Kancheepuram, Chennai, IN
                                        </h5>
                                        <p className="text-sm text-muted-foreground">
                                            Bachelor of Technology - Computer
                                            Science and Engineering
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Graduated: June 2024 | CGPA: 8.93 /
                                            10.0
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="space-y-4"
                        >
                            <h4 className="text-lg font-semibold">Interests</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {interests.map((interest, i) => (
                                    <motion.div
                                        key={interest.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={
                                            isInView
                                                ? { opacity: 1, x: 0 }
                                                : { opacity: 0, x: 20 }
                                        }
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.6 + i * 0.1,
                                        }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                                            <interest.icon size={20} />
                                        </div>
                                        <span className="font-medium text-sm">
                                            {interest.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
