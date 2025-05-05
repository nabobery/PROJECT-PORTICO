'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const experiences = [
    {
        company: 'Binocs.co',
        role: 'SDE I',
        date: 'Jun 2024 - Present',
        location: 'Bengaluru, IN',
        description: [
            'Designed and implemented a configurable rule engine using Abstract Syntax Trees (ASTs) for dynamic financial calculations, enabling real-time updates and seamless recalculations.',
            'Engineered scalable background processing pipelines with SNS/SQS and stage-based microservices for efficient task coordination.',
            'Built a Retrieval-Augmented Generation (RAG) chatbot pipeline using pgvector for vector-based embeddings and fuzzy search.',
            'Developed an automated regression testing framework deployed via Docker and Kubernetes.',
            'Engineered a flexible data processing system for dynamic unit conversions and nested data handling.',
        ],
        icon: Briefcase,
    },
    {
        company: 'KLA',
        role: 'Software Engineer Intern',
        date: 'May 2023 - Oct 2023',
        location: 'Chennai, IN',
        description: [
            'Enhanced system performance by 80% using asynchronous logging and a publisher-subscriber model with Disruptor Framework and log4j.',
            'Created interactive log visualizations with TypeScript, React, Plotly for actionable system insights.',
            'Built a flexible framework using a rule-based context engine to parse and extract data from various log files.',
            'Developed a React-based micro frontend dashboard with Elastic Search integration for fast log analysis.',
            'Implemented design patterns like Singleton, Factory, Builder, Observer, and Publisher-Subscriber for modularity and maintainability.',
        ],
        icon: Briefcase,
    },
    {
        company: 'IIITDM Kancheepuram',
        role: 'Teaching Assistant',
        date: 'Mar 2024 - May 2024',
        location: 'Chennai, IN',
        description: [
            'Supervised and assisted students in CS1006 Data Structures and Algorithms Practice and CS2010 Computer Organization and Architecture practice courses.',
            'Provided guidance in formulating, improving, and debugging code for weekly coding assignments.',
        ],
        icon: GraduationCap,
    },
]

export default function Experience() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

    return (
        <section id="experience" className="py-20">
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
                        <Briefcase size={18} />
                        <span>Work Experience</span>
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
                        My Professional Journey
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

                <div ref={ref} className="relative max-w-3xl mx-auto">
                    {/* Timeline Line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:translate-x-px" />

                    {experiences.map((experience, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.2,
                            }}
                            className={`relative mb-12 md:mb-24 ${
                                index % 2 === 0
                                    ? 'md:pl-12'
                                    : 'md:pr-12 md:ml-auto'
                            }`}
                            style={{ maxWidth: '85%' }}
                        >
                            {/* Timeline Circle */}
                            <div
                                className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary -ml-2 md:-ml-2"
                                style={{
                                    transform: 'translateX(-4px)',
                                    [index % 2 === 0
                                        ? 'marginLeft'
                                        : 'marginRight']: 0,
                                }}
                            />

                            {/* Period Badge */}
                            <div
                                className={`absolute top-5 hidden md:block ${
                                    index % 2 === 0 ? '-left-32' : '-right-32'
                                }`}
                            >
                                <span className="text-sm font-medium text-muted-foreground">
                                    {experience.date}
                                </span>
                            </div>

                            {/* Experience Card */}
                            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div className="md:hidden mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {experience.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                                        {experience.role}
                                    </h3>

                                    <p className="text-muted-foreground mb-4">
                                        {experience.company}
                                    </p>

                                    <p className="mb-4">
                                        {experience.location}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <h4 className="text-sm font-semibold">
                                            Key Achievements:
                                        </h4>
                                        <ul className="space-y-2">
                                            {experience.description.map(
                                                (achievement, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span className="text-primary mt-1">
                                                            •
                                                        </span>
                                                        <span className="text-sm">
                                                            {achievement}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">
                                            {experience.icon.name}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
