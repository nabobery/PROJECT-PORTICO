'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaLaptopCode, FaTrophy, FaChartLine, FaFire } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/card'

// Interfaces for API responses (will be refined)
interface LeetCodeStats {
    solvedProblem?: number
    totalSolved?: number // Another possible field name
    solved?: number // Yet another possible field name
}

// Codeforces API response interfaces
interface CodeforcesProblem {
    contestId?: number
    index?: string
    name?: string
    type?: string
    points?: number
    rating?: number
    tags?: string[]
}

interface CodeforcesPartyMember {
    handle: string
}

interface CodeforcesAuthor {
    contestId?: number
    members: CodeforcesPartyMember[]
    participantType: string // e.g., "PRACTICE", "CONTESTANT", "VIRTUAL"
    ghost?: boolean
    room?: number
    startTimeSeconds?: number
}

interface CodeforcesSubmission {
    id: number
    contestId?: number
    creationTimeSeconds: number
    relativeTimeSeconds: number
    problem: CodeforcesProblem
    author: CodeforcesAuthor
    programmingLanguage: string
    verdict?:
        | 'OK'
        | 'FAILED'
        | 'PARTIAL'
        | 'COMPILATION_ERROR'
        | 'RUNTIME_ERROR'
        | 'WRONG_ANSWER'
        | 'PRESENTATION_ERROR'
        | 'TIME_LIMIT_EXCEEDED'
        | 'MEMORY_LIMIT_EXCEEDED'
        | 'IDLENESS_LIMIT_EXCEEDED'
        | 'SECURITY_VIOLATED'
        | 'CRASHED'
        | 'INPUT_PREPARATION_CRASHED'
        | 'CHALLENGED'
        | 'SKIPPED'
        | 'TESTING'
        | 'REJECTED'
    testset: string
    passedTestCount: number
    timeConsumedMillis: number
    memoryConsumedBytes: number
    points?: number
}

interface CodeforcesUserStatusResponse {
    status: 'OK' | 'FAILED'
    result?: CodeforcesSubmission[]
    comment?: string
}

interface CodeChefStats {
    problem_fully_solved?: number
    // other fields as needed
}

interface CsesStats {
    submissionCount?: number // From the profile page directly
}

interface PlatformStat {
    icon: React.ElementType
    platformName: string
    username: string
    value: number | null // Store fetched value here
    label: string
    profileUrl: string
    color: string
    apiEndpoint?: string // For platforms with actual APIs
    isSubmissionCount?: boolean // To clarify if it's solved vs submissions
}

const initialPlatformStats: PlatformStat[] = [
    {
        icon: FaLaptopCode,
        platformName: 'LeetCode',
        username: 'Nabobery',
        value: null,
        label: 'Problems Solved',
        profileUrl: 'https://leetcode.com/u/Nabobery/',
        color: 'hsl(var(--chart-1))',
        apiEndpoint: 'https://alfa-leetcode-api.onrender.com/Nabobery/solved',
    },
    {
        icon: FaTrophy,
        platformName: 'Codeforces',
        username: 'nabobery',
        value: null,
        label: 'Problems Solved',
        profileUrl: 'https://codeforces.com/profile/nabobery',
        color: 'hsl(var(--chart-2))',
        // apiEndpoint for Codeforces will be constructed in fetch
    },
    {
        icon: FaFire,
        platformName: 'CodeChef',
        username: 'nabobery',
        value: null, // Will be fetched or fallback
        label: 'Problems Solved',
        profileUrl: 'http://codechef.com/users/nabobery',
        color: 'hsl(var(--chart-3))',
        // apiEndpoint for CodeChef if using a public one, or handled differently
    },
    {
        icon: FaChartLine,
        platformName: 'CSES',
        username: 'nabobery',
        value: 186, // Pre-filled as per original request
        label: 'Submissions',
        profileUrl: 'https://cses.fi/user/93357',
        color: 'hsl(var(--chart-4))',
        isSubmissionCount: true,
    },
]

// Re-usable Counter component (similar to achievements)
function Counter({ value, isInView }: { value: number; isInView: boolean }) {
    const [count, setCount] = useState(0) // Start count at 0

    useEffect(() => {
        if (value === null) {
            // Handle null value immediately
            setCount(0) // Or display 'N/A' if Counter returned string
            return
        }

        if (!isInView) {
            setCount(0) // Reset to 0 if not in view, so it animates from 0 when it comes into view
            return
        }

        let currentCount = 0 // Animation always starts from 0 when it comes into view
        const targetValue = value

        // Adjust duration: shorter for smaller numbers, capped for larger ones.
        // Make it slightly faster overall.
        const duration = Math.max(
            300,
            Math.min(1500, Math.abs(targetValue) * 8)
        )

        if (targetValue === 0) {
            setCount(0)
            return
        }

        const frameDuration = 1000 / 60 // Target 60 FPS
        const totalFrames = Math.round(duration / frameDuration)
        let frame = 0

        const timer = setInterval(() => {
            frame++
            const progress = frame / totalFrames
            currentCount = Math.round(targetValue * progress)

            if (frame >= totalFrames) {
                currentCount = targetValue // Ensure it ends exactly on target
                clearInterval(timer)
            }
            setCount(currentCount)
        }, frameDuration)

        return () => {
            clearInterval(timer)
        }
    }, [value, isInView])

    return <span>{value === null ? 'N/A' : count}</span>
}

export default function CompetitiveStats() {
    const sectionRef = useRef(null) // Rename ref for clarity and attach to section
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

    const [stats, setStats] = useState<PlatformStat[]>(initialPlatformStats)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            setError(null)
            console.log(
                'CompetitiveStats: Starting to fetch API data with animations active...'
            )

            const updatedStatsPromises = initialPlatformStats.map(
                async (platform) => {
                    if (
                        platform.platformName === 'LeetCode' &&
                        platform.apiEndpoint
                    ) {
                        try {
                            console.log(
                                `Fetching LeetCode data from ${platform.apiEndpoint}...`
                            )
                            const response = await fetch(platform.apiEndpoint)
                            if (!response.ok) {
                                throw new Error(
                                    `API error ${response.status}: ${response.statusText}`
                                )
                            }
                            const data: LeetCodeStats = await response.json()
                            console.log('LeetCode API Response:', data)
                            const solvedCount =
                                data.solvedProblem ??
                                data.totalSolved ??
                                data.solved
                            if (typeof solvedCount !== 'number') {
                                console.error(
                                    'LeetCode API did not return a valid number for solved problems. Response:',
                                    data
                                )
                                throw new Error(
                                    'LeetCode API response malformed for solved count'
                                )
                            }
                            return { ...platform, value: solvedCount }
                        } catch (e: any) {
                            console.error(
                                `Failed to fetch LeetCode stats for ${platform.username}:`,
                                e
                            )
                            setError(
                                (prev) =>
                                    `${prev ?? ''} LeetCode: ${e.message}. `
                            )
                            return { ...platform, value: null }
                        }
                    }
                    if (platform.platformName === 'Codeforces') {
                        try {
                            const apiUrl = `https://codeforces.com/api/user.status?handle=${platform.username}&from=1&count=10000` // Fetch a large number of submissions
                            console.log(
                                `Fetching Codeforces data from ${apiUrl}...`
                            )
                            const response = await fetch(apiUrl)
                            if (!response.ok) {
                                const errorText = await response.text() // Try to get more details on error
                                throw new Error(
                                    `API error ${response.status}: ${response.statusText}. Response: ${errorText}`
                                )
                            }
                            const data: CodeforcesUserStatusResponse =
                                await response.json()

                            if (data.status !== 'OK' || !data.result) {
                                console.error(
                                    'Codeforces API did not return OK status or missing result. Response:',
                                    data
                                )
                                throw new Error(
                                    `Codeforces API error: ${
                                        data.comment ||
                                        'Unknown error or no submissions found'
                                    }`
                                )
                            }

                            const solvedProblems = new Set<string>()
                            data.result.forEach((submission) => {
                                // Ensure problem exists and has necessary identifiers
                                if (
                                    submission.problem &&
                                    submission.verdict === 'OK'
                                ) {
                                    if (
                                        submission.problem.contestId &&
                                        submission.problem.index
                                    ) {
                                        solvedProblems.add(
                                            `${submission.problem.contestId}-${submission.problem.index}`
                                        )
                                    } else if (submission.problem.name) {
                                        // Fallback to problem name if contestId/index are missing
                                        solvedProblems.add(
                                            submission.problem.name
                                        )
                                    }
                                }
                            })
                            const solvedCount = solvedProblems.size
                            console.log(
                                `Codeforces solved count for ${platform.username}: ${solvedCount}`
                            )
                            return { ...platform, value: solvedCount }
                        } catch (e: any) {
                            console.error(
                                `Failed to fetch Codeforces stats for ${platform.username}:`,
                                e
                            )
                            setError(
                                (prev) =>
                                    `${prev ?? ''} Codeforces: ${e.message}. `
                            )
                            return { ...platform, value: null }
                        }
                    }
                    if (platform.platformName === 'CodeChef') {
                        return { ...platform, value: 96 }
                    }
                    if (platform.platformName === 'CSES') {
                        return platform
                    }
                    return platform
                }
            )

            try {
                const allStats = await Promise.all(updatedStatsPromises)
                setStats(allStats)
            } catch (e: any) {
                console.error('Error processing all stats promises:', e)
                setError(
                    (prev) =>
                        `${
                            prev ?? ''
                        } General: Failed to process all platform data. `
                )
            }
            setIsLoading(false)
            console.log(
                'CompetitiveStats: API data fetching complete with animations active.'
            )
        }

        fetchStats()
    }, [])

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

                {isLoading && (
                    <p className="text-center text-muted-foreground">
                        Loading stats...
                    </p>
                )}
                {error && (
                    <p className="text-center text-destructive">
                        Error loading stats: {error}
                    </p>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.platformName}
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
                                <a
                                    href={stat.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-full block"
                                >
                                    <Card className="border-border h-full bg-card overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                                        <div
                                            className="h-1.5"
                                            style={{
                                                backgroundColor: stat.color,
                                            }}
                                        />
                                        <CardContent className="p-6 flex flex-col items-center text-center">
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                                style={{
                                                    backgroundColor: `${stat.color}20`,
                                                }}
                                            >
                                                <stat.icon
                                                    className="h-8 w-8"
                                                    style={{
                                                        color: stat.color,
                                                    }}
                                                />
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-bold font-heading text-card-foreground">
                                                {stat.value !== null ? (
                                                    <Counter
                                                        value={stat.value}
                                                        isInView={isInView}
                                                    />
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        N/A
                                                    </span>
                                                )}
                                                {stat.value !== null &&
                                                    !stat.isSubmissionCount && (
                                                        <span className="text-primary">
                                                            +
                                                        </span>
                                                    )}
                                            </h3>
                                            <p className="text-sm mt-1 text-muted-foreground">
                                                {stat.label} on{' '}
                                                {stat.platformName}
                                            </p>
                                            <p className="text-xs mt-2 text-muted-foreground">
                                                @{stat.username}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
