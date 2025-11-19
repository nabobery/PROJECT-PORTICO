'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
    FaLaptopCode,
    FaTrophy,
    FaChartLine,
    FaFire,
    FaBookOpen,
    FaRotate,
} from 'react-icons/fa6'
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Interfaces for API responses (will be refined)
interface LeetCodeStats {
    solvedProblem?: number
    totalSolved?: number // Another possible field name
    solved?: number // Yet another possible field name
}

// Interfaces for API responses
interface LeetCodeAcceptedQuestionCount {
    count: number
    difficulty: string
}

interface LeetCodeUserQuestionProgress {
    numAcceptedQuestions: LeetCodeAcceptedQuestionCount[]
    // other fields from GQL if needed, e.g., numFailedQuestions, numUntouchedQuestions
}

interface LeetCodeGraphQLData {
    userProfileUserQuestionProgressV2: LeetCodeUserQuestionProgress
}

interface LeetCodeGraphQLResponse {
    data?: LeetCodeGraphQLData
    errors?: Array<{ message: string }> // For GraphQL errors
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
    error?: string | null // Store error message per platform
    isRetrying?: boolean // Track if currently retrying
}

const initialPlatformStats: PlatformStat[] = [
    {
        icon: SiLeetcode,
        platformName: 'LeetCode',
        username: 'Nabobery',
        value: null,
        label: 'Problems Solved',
        profileUrl: 'https://leetcode.com/u/Nabobery/',
        color: '#FFA116',
    },
    {
        icon: SiCodeforces,
        platformName: 'Codeforces',
        username: 'nabobery',
        value: null,
        label: 'Problems Solved',
        profileUrl: 'https://codeforces.com/profile/nabobery',
        color: '#1F8ACB',
    },
    {
        icon: SiCodechef,
        platformName: 'CodeChef',
        username: 'nabobery',
        value: null, // Will be fetched or fallback
        label: 'Problems Solved',
        profileUrl: 'http://codechef.com/users/nabobery',
        color: '#D67325',
    },
    {
        icon: FaBookOpen,
        platformName: 'CSES',
        username: 'nabobery',
        value: 186, // Pre-filled as per original request
        label: 'Submissions',
        profileUrl: 'https://cses.fi/user/93357',
        color: '#29A38E',
        isSubmissionCount: true,
    },
]

// Utility function for retry logic with exponential backoff
async function fetchWithRetry(
    fetchFn: () => Promise<Response>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetchFn()
            return response
        } catch (error) {
            lastError = error as Error
            if (attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = baseDelay * Math.pow(2, attempt)
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError || new Error('Fetch failed after retries')
}

// Helper function to get user-friendly error messages
function getUserFriendlyErrorMessage(error: any, platformName: string): string {
    const errorMessage = error?.message || String(error)

    // Handle common error scenarios
    if (
        errorMessage.includes('404') ||
        errorMessage.includes('user not found')
    ) {
        return 'User not found'
    }
    if (errorMessage.includes('403')) {
        return 'API rate limited'
    }
    if (
        errorMessage.includes('500') ||
        errorMessage.includes('502') ||
        errorMessage.includes('503')
    ) {
        return 'Server unavailable'
    }
    if (
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to fetch')
    ) {
        return 'Network error'
    }
    if (errorMessage.includes('timeout')) {
        return 'Request timed out'
    }

    // Generic fallback
    return 'Failed to load stats'
}

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

// Simple Loader Component
function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-4">
            <motion.div
                style={{
                    width: 24,
                    height: 24,
                    border: '3px solid hsl(var(--primary))',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                }}
                animate={{ rotate: 360 }}
                transition={{
                    loop: Infinity,
                    ease: 'linear',
                    duration: 0.8,
                }}
            />
            <span className="ml-3 text-muted-foreground">Loading stats...</span>
        </div>
    )
}

export default function CompetitiveStats() {
    const sectionRef = useRef(null) // Rename ref for clarity and attach to section
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

    const [stats, setStats] = useState<PlatformStat[]>(initialPlatformStats)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch stats for a specific platform
    const fetchPlatformStats = async (
        platform: PlatformStat
    ): Promise<PlatformStat> => {
        if (platform.platformName === 'LeetCode') {
            try {
                const response = await fetchWithRetry(
                    () =>
                        fetch(
                            `/api/leetcode-stats?username=${platform.username}`
                        ),
                    3,
                    1000
                )

                if (!response.ok) {
                    const errorBody = await response.text()
                    throw new Error(
                        `API error ${response.status}: ${response.statusText}. Body: ${errorBody}`
                    )
                }
                const data: LeetCodeGraphQLResponse = await response.json()

                if (data.errors && data.errors.length > 0) {
                    throw new Error(
                        `GraphQL error: ${data.errors
                            .map((e) => e.message)
                            .join(', ')}`
                    )
                }

                if (
                    !data.data ||
                    !data.data.userProfileUserQuestionProgressV2 ||
                    !data.data.userProfileUserQuestionProgressV2
                        .numAcceptedQuestions
                ) {
                    console.error(
                        'LeetCode GraphQL API did not return the expected data structure. Response:',
                        data
                    )
                    throw new Error(
                        'LeetCode GraphQL API response malformed for solved count'
                    )
                }

                const solvedCount =
                    data.data.userProfileUserQuestionProgressV2.numAcceptedQuestions.reduce(
                        (sum, item) => sum + item.count,
                        0
                    )

                if (typeof solvedCount !== 'number') {
                    console.error(
                        'LeetCode API did not return a valid number for solved problems. Calculated sum:',
                        solvedCount,
                        'Original data:',
                        data.data.userProfileUserQuestionProgressV2
                            .numAcceptedQuestions
                    )
                    throw new Error(
                        'LeetCode API response malformed for solved count (after sum)'
                    )
                }
                return {
                    ...platform,
                    value: solvedCount,
                    error: null,
                    isRetrying: false,
                }
            } catch (e: any) {
                console.error(
                    `Failed to fetch LeetCode stats for ${platform.username}:`,
                    e
                )
                const userFriendlyError = getUserFriendlyErrorMessage(
                    e,
                    platform.platformName
                )
                return {
                    ...platform,
                    value: null,
                    error: userFriendlyError,
                    isRetrying: false,
                }
            }
        }

        if (platform.platformName === 'Codeforces') {
            try {
                const apiUrl = `https://codeforces.com/api/user.status?handle=${platform.username}&from=1&count=10000`

                const response = await fetchWithRetry(
                    () => fetch(apiUrl),
                    3,
                    1000
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(
                        `API error ${response.status}: ${response.statusText}. Response: ${errorText}`
                    )
                }
                const data: CodeforcesUserStatusResponse = await response.json()

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
                    if (submission.problem && submission.verdict === 'OK') {
                        if (
                            submission.problem.contestId &&
                            submission.problem.index
                        ) {
                            solvedProblems.add(
                                `${submission.problem.contestId}-${submission.problem.index}`
                            )
                        } else if (submission.problem.name) {
                            solvedProblems.add(submission.problem.name)
                        }
                    }
                })
                const solvedCount = solvedProblems.size
                return {
                    ...platform,
                    value: solvedCount,
                    error: null,
                    isRetrying: false,
                }
            } catch (e: any) {
                console.error(
                    `Failed to fetch Codeforces stats for ${platform.username}:`,
                    e
                )
                const userFriendlyError = getUserFriendlyErrorMessage(
                    e,
                    platform.platformName
                )
                return {
                    ...platform,
                    value: null,
                    error: userFriendlyError,
                    isRetrying: false,
                }
            }
        }

        if (platform.platformName === 'CodeChef') {
            return { ...platform, value: 96, error: null }
        }

        if (platform.platformName === 'CSES') {
            return platform
        }

        return platform
    }

    // Retry fetch for a specific platform
    const handleRetry = async (platformName: string) => {
        setStats((prevStats) =>
            prevStats.map((stat) =>
                stat.platformName === platformName
                    ? { ...stat, isRetrying: true, error: null }
                    : stat
            )
        )

        const platform = stats.find((s) => s.platformName === platformName)
        if (!platform) return

        const updatedPlatform = await fetchPlatformStats(platform)

        setStats((prevStats) =>
            prevStats.map((stat) =>
                stat.platformName === platformName ? updatedPlatform : stat
            )
        )
    }

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)

            const updatedStatsPromises = initialPlatformStats.map((platform) =>
                fetchPlatformStats(platform)
            )

            // Process all promises - individual errors are already handled per platform
            const allStats = await Promise.all(updatedStatsPromises)
            setStats(allStats)
            setIsLoading(false)
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

                {isLoading && <LoadingSpinner />}

                {!isLoading && (
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
                                <Card className="border-border h-full bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div
                                        className="h-1.5"
                                        style={{
                                            backgroundColor: stat.color,
                                        }}
                                    />
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300"
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

                                        {stat.error ? (
                                            <>
                                                <div className="text-2xl md:text-3xl font-bold font-heading text-destructive mb-2">
                                                    Error
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-3">
                                                    {stat.error}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleRetry(
                                                            stat.platformName
                                                        )
                                                    }}
                                                    disabled={stat.isRetrying}
                                                    className="mt-auto"
                                                >
                                                    {stat.isRetrying ? (
                                                        <>
                                                            <motion.div
                                                                animate={{
                                                                    rotate: 360,
                                                                }}
                                                                transition={{
                                                                    duration: 1,
                                                                    repeat: Infinity,
                                                                    ease: 'linear',
                                                                }}
                                                                className="mr-2"
                                                            >
                                                                <FaRotate className="h-3 w-3" />
                                                            </motion.div>
                                                            Retrying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaRotate className="mr-2 h-3 w-3" />
                                                            Retry
                                                        </>
                                                    )}
                                                </Button>
                                                <a
                                                    href={stat.profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline mt-2"
                                                >
                                                    View Profile
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-3xl md:text-4xl font-bold font-heading text-card-foreground flex items-baseline">
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={
                                                                stat.value !==
                                                                null
                                                                    ? stat.value
                                                                    : 'loading'
                                                            }
                                                            initial={{
                                                                opacity: 0,
                                                                y: 10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                        >
                                                            {stat.value !==
                                                            null ? (
                                                                <Counter
                                                                    value={
                                                                        stat.value
                                                                    }
                                                                    isInView={
                                                                        isInView
                                                                    }
                                                                />
                                                            ) : (
                                                                <span className="text-muted-foreground">
                                                                    N/A
                                                                </span>
                                                            )}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                    {stat.value !== null &&
                                                        !stat.isSubmissionCount && (
                                                            <span className="text-primary ml-1">
                                                                +
                                                            </span>
                                                        )}
                                                </h3>
                                                <p className="text-sm mt-1 text-muted-foreground">
                                                    {stat.label} on{' '}
                                                    {stat.platformName}
                                                </p>
                                                <a
                                                    href={stat.profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs mt-2 text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    @{stat.username}
                                                </a>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
