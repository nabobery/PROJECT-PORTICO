'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Code, Users, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const achievements = [
    {
        icon: Code,
        value: 150,
        label: 'Projects Completed',
        color: 'hsl(var(--chart-1))',
    },
    {
        icon: Users,
        value: 80,
        label: 'Happy Clients',
        color: 'hsl(var(--chart-2))',
    },
    {
        icon: Award,
        value: 15,
        label: 'Awards Received',
        color: 'hsl(var(--chart-3))',
    },
    {
        icon: Star,
        value: 8,
        label: 'Years Experience',
        color: 'hsl(var(--chart-4))',
    },
]

function Counter({ value, isInView }: { value: number; isInView: boolean }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = value
        const duration = 2000

        if (isInView && start < end) {
            let timer = setInterval(() => {
                start += 1
                const progress = start / end
                const increment = Math.ceil(progress * end)
                setCount(increment)

                if (increment >= end) {
                    clearInterval(timer)
                    setCount(end)
                }
            }, duration / end)

            return () => {
                clearInterval(timer)
            }
        }
    }, [value, isInView])

    return <span>{count}</span>
}

export default function Achievements() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.3 })

    return (
        <section id="achievements" className="py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div ref={ref} className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card className="border-border h-full overflow-hidden group">
                                    <div
                                        className="h-1.5"
                                        style={{
                                            backgroundColor: achievement.color,
                                        }}
                                    />
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                                            style={{
                                                backgroundColor: `${achievement.color}10`,
                                            }}
                                        >
                                            <achievement.icon
                                                className="h-8 w-8"
                                                style={{
                                                    color: achievement.color,
                                                }}
                                            />
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold font-heading">
                                            <Counter
                                                value={achievement.value}
                                                isInView={isInView}
                                            />
                                            <span className="text-primary">
                                                +
                                            </span>
                                        </h3>

                                        <p className="text-muted-foreground text-sm">
                                            {achievement.label}
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
