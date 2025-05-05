'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    LightbulbIcon,
    Code,
    Paintbrush,
    BarChart3,
    Rocket,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const processSteps = [
    {
        icon: LightbulbIcon,
        title: 'Discovery',
        description:
            'Understanding requirements, research, and gathering insights to establish project goals.',
        color: 'hsl(var(--chart-1))',
    },
    {
        icon: Paintbrush,
        title: 'Design',
        description:
            'Creating wireframes, prototypes, and visual designs with a focus on user experience.',
        color: 'hsl(var(--chart-2))',
    },
    {
        icon: Code,
        title: 'Development',
        description:
            'Writing clean, efficient, and maintainable code following best practices and standards.',
        color: 'hsl(var(--chart-3))',
    },
    {
        icon: BarChart3,
        title: 'Testing',
        description:
            'Thorough testing for bugs, performance issues, and ensuring compatibility across devices.',
        color: 'hsl(var(--chart-4))',
    },
    {
        icon: Rocket,
        title: 'Deployment',
        description:
            'Launching the project with proper CI/CD pipelines and post-launch monitoring.',
        color: 'hsl(var(--chart-5))',
    },
]

export default function Process() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

    return (
        <section id="process" className="py-20 bg-muted/30">
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
                        <LightbulbIcon size={18} />
                        <span>Development Process</span>
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
                        How I Work
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

                <div ref={ref} className="max-w-5xl mx-auto">
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">
                        {/* Process timeline line */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 md:top-1/2 md:left-0 md:translate-y-1/2 md:translate-x-0 h-[calc(100%-4rem)] md:h-0.5 md:w-full bg-border z-0 hidden md:block" />

                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                className="relative z-10 md:flex-1"
                                initial={{ opacity: 0, y: 50 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 50 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2 + index * 0.1,
                                }}
                            >
                                <Card className="h-full bg-background border-border overflow-hidden">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="mb-4 relative">
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: `${step.color}10`,
                                                }}
                                            >
                                                <step.icon
                                                    className="h-8 w-8"
                                                    style={{
                                                        color: step.color,
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
                                                <span className="text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
