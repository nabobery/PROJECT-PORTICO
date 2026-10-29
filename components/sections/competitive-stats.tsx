import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { FaBookOpen } from 'react-icons/fa'
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si'
import { Card, CardContent } from '@/components/ui/card'
import {
    competitiveStats,
    formatObservedOn,
    formatStatValue,
    type PlatformStat,
} from '@/src/content/competitive-stats'

const ICONS: Record<PlatformStat['id'], React.ElementType> = {
    leetcode: SiLeetcode,
    codeforces: SiCodeforces,
    codechef: SiCodechef,
    cses: FaBookOpen,
}

/**
 * Counts up to a known value once the card scrolls into view. The server and
 * no-JavaScript output show the final value; reduced motion skips counting.
 */
function Counter({ value, isInView }: { value: number; isInView: boolean }) {
    const [count, setCount] = useState(value)
    const shouldReduceMotion = useReducedMotion()
    const animated = useRef(false)

    useEffect(() => {
        if (!isInView || shouldReduceMotion || animated.current || value === 0)
            return
        animated.current = true
        const duration = Math.max(300, Math.min(1500, value * 8))
        let frame = 0
        const start = performance.now()
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration)
            setCount(Math.round(value * progress))
            if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(frame)
            setCount(value)
        }
    }, [isInView, shouldReduceMotion, value])

    return <span>{count}</span>
}

function StatCard({
    stat,
    index,
    isInView,
}: {
    stat: PlatformStat
    index: number
    isInView: boolean
}) {
    const Icon = ICONS[stat.id]
    const known = stat.stat.status === 'known'
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            data-platform={stat.id}
            data-stat-status={stat.stat.status}
        >
            <a
                href={stat.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full block"
                aria-label={`${stat.platformName} profile for @${stat.username}: ${formatStatValue(stat)} ${stat.label.toLowerCase()}`}
            >
                <Card className="border-border h-full bg-card overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                    <div
                        className="h-1.5"
                        style={{ backgroundColor: stat.color }}
                    />
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 motion-safe:group-hover:scale-110"
                            style={{ backgroundColor: `${stat.color}20` }}
                        >
                            <Icon
                                className="h-8 w-8"
                                style={{ color: stat.color }}
                            />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold font-heading text-card-foreground flex items-baseline">
                            {known && stat.stat.status === 'known' ? (
                                <>
                                    <Counter
                                        value={stat.stat.value}
                                        isInView={isInView}
                                    />
                                    {!stat.isSubmissionCount && (
                                        <span className="text-primary ml-1">
                                            +
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-muted-foreground text-xl md:text-2xl">
                                    Not available
                                </span>
                            )}
                        </h3>
                        <p className="text-sm mt-1 text-muted-foreground">
                            {stat.label} on {stat.platformName}
                        </p>
                        <p className="text-xs mt-2 text-muted-foreground">
                            @{stat.username}
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground">
                            {formatObservedOn(stat)}
                        </p>
                    </CardContent>
                </Card>
            </a>
        </motion.div>
    )
}

/**
 * Competitive programming section backed by a dated snapshot
 * (src/content/competitive-stats.ts). Each platform renders on its own, so an
 * unknown value on one card never hides the others.
 */
export default function CompetitiveStats() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

    return (
        <section
            ref={sectionRef}
            id="competitive-stats"
            className="py-16 bg-muted/20"
        >
            <div className="container mx-auto px-4 md:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-center font-heading text-foreground"
                >
                    Competitive Programming Stats
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {competitiveStats.map((stat, index) => (
                        <StatCard
                            key={stat.id}
                            stat={stat}
                            index={index}
                            isInView={isInView}
                        />
                    ))}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
                    Figures are a dated snapshot, not live data. Follow a card
                    to see the current profile.
                </p>
            </div>
        </section>
    )
}
