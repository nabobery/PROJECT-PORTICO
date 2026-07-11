'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const experiences = [
    {
        company: 'OnArrival',
        role: 'Software Engineer',
        date: 'Aug 2025 – Present',
        location: 'Bengaluru, IN',
        description: [
            'Architected a high-performance hotel search engine on Elasticsearch with dynamic faceted filtering, geo-spatial queries, and fuzzy NLP matching, driving ~15% uplift in booking conversions.',
            'Built a multi-tenant Auth Service in Ktor/Kotlin with JWT (RSA + HMAC-SHA256), per-org CORS, and Caffeine caching for sub-ms authorization, cutting B2B integration time by ~25%.',
            'Pioneered an MCP (Model Context Protocol) server enabling AI agents to execute conversational flight and hotel bookings, alongside a multi-LLM pipeline (Gemini, Groq) extracting structured data from unstructured hotel content.',
            'Delivered end-to-end payment gateway integrations and a React/OAuth admin dashboard, making B2B partner onboarding self-service.',
            'Instrumented OpenTelemetry metrics for third-party API health; hardened EKS with AWS Secrets Manager and built Prefect CI/CD pipelines for automated hotel data sync.',
        ],
        type: 'Professional',
    },
    {
        company: 'Binocs.co',
        role: 'SDE I',
        date: 'Jun 2024 – Aug 2025',
        location: 'Bengaluru, IN',
        description: [
            'Reduced analyst research time by ~40% by architecting a multi-agent RAG chatbot (Google ADK, LlamaIndex, pgvector) with SSE streaming, trigram query caching, and dynamic visualizations.',
            'Engineered SQL optimizations with CTEs and advanced joins, achieving a 7x improvement in API response times.',
            'Automated covenant compliance tracking across NBFC portfolios via an event-driven KPI service (AWS SNS/SQS) with AST-based formula evaluation.',
            'Accelerated investment memo generation from days to hours via an LLM pipeline (Docling/Textract, pgvector, Celery + SQS).',
            'Shipped full-stack financial features (Next.js + FastAPI): change-tracked statement recalculations, S3 Excel generation, bulk document processing.',
        ],
        type: 'Professional',
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
            'Developed a React-based micro frontend dashboard with Elasticsearch integration for fast log analysis.',
            'Implemented design patterns like Singleton, Factory, Builder, Observer, and Publisher-Subscriber for modularity and maintainability.',
        ],
        type: 'Professional',
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
        type: 'Academic',
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

                <div ref={ref} className="relative max-w-5xl mx-auto">
                    {/* Animated Timeline Line */}
                    <motion.div
                        className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border origin-top transform md:translate-x-px"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />

                    {experiences.map((experience, index) => (
                        <motion.div
                            key={`${experience.company}-${experience.role}-${index}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.2, // Card animation
                            }}
                            className="relative mb-12 md:mb-24"
                        >
                            {/* Animated Glowing Dot */}
                            <motion.div
                                className="absolute left-0 top-6 w-4 h-4 rounded-full bg-primary -ml-2 md:left-1/2 md:-ml-2 z-10"
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    boxShadow:
                                        '0 0 0px 0px rgba(59, 130, 246, 0)', // Assuming primary is blue-500. Adjust RGBA if your primary color is different.
                                }}
                                animate={
                                    isInView
                                        ? {
                                              opacity: 1,
                                              scale: 1,
                                              boxShadow: [
                                                  // Keyframes for pulsing glow
                                                  '0 0 0px 0px rgba(59, 130, 246, 0.4)',
                                                  '0 0 25px 10px rgba(59, 130, 246, 0.7)',
                                                  '0 0 0px 0px rgba(59, 130, 246, 0.4)',
                                              ],
                                          }
                                        : {
                                              opacity: 0,
                                              scale: 0.5,
                                              boxShadow:
                                                  '0 0 0px 0px rgba(59, 130, 246, 0)',
                                          }
                                }
                                transition={{
                                    opacity: {
                                        duration: 0.4,
                                        delay: 0.15 + index * 0.2,
                                    },
                                    scale: {
                                        duration: 0.4,
                                        delay: 0.15 + index * 0.2,
                                    },
                                    boxShadow: {
                                        duration: 1.5, // Duration for one full pulse
                                        delay: 0.15 + index * 0.2 + 0.4, // Start after dot appears
                                        repeat: Infinity, // Loop the pulse
                                        ease: 'easeInOut',
                                    },
                                }}
                            />

                            {/* Card Section */}
                            <motion.div
                                className="max-w-2xl mx-auto"
                                whileHover={{ y: -6 }} // Lift card on hover
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 15,
                                }}
                            >
                                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        {/* Mobile Date Display */}
                                        <div className="mb-2">
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
                                                {experience.type}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
