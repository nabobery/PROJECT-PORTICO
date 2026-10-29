/**
 * Dated competitive-programming snapshot. The homepage renders these values
 * directly; no visitor request reaches LeetCode, Codeforces, CodeChef, or CSES,
 * and the build never depends on those services being available.
 *
 * A value is either `null` (not observed by an authorized check, shown as
 * "Not available") or a number with the date and evidence it came from.
 * Never replace an unknown value with 0 or an estimate.
 */

export type StatEvidence =
    /** Copied from earlier site source; not re-checked against the profile. */
    | 'repository-record'
    /** Read from the public profile during an authorized check. */
    | 'profile-observation'

export interface KnownStat {
    status: 'known'
    value: number
    /** ISO date (YYYY-MM-DD) when the value was observed or recorded. */
    observedOn: string
    evidence: StatEvidence
    /** Where the value came from, e.g. a commit or profile URL. */
    evidenceRef: string
}

export interface UnknownStat {
    status: 'unknown'
    value: null
    observedOn: null
    reason: string
}

export type StatValue = KnownStat | UnknownStat

export interface PlatformStat {
    id: 'leetcode' | 'codeforces' | 'codechef' | 'cses'
    platformName: string
    username: string
    label: string
    profileUrl: string
    color: string
    /** True when the value counts submissions rather than solved problems. */
    isSubmissionCount: boolean
    stat: StatValue
}

const NOT_YET_OBSERVED =
    'Live per-visitor fetching was removed. No authorized snapshot has been taken yet.'

export const OWNER_LEETCODE_USERNAME = 'Nabobery'

export const competitiveStats: readonly PlatformStat[] = [
    {
        id: 'leetcode',
        platformName: 'LeetCode',
        username: OWNER_LEETCODE_USERNAME,
        label: 'Problems Solved',
        profileUrl: 'https://leetcode.com/u/Nabobery/',
        color: '#FFA116',
        isSubmissionCount: false,
        stat: {
            status: 'unknown',
            value: null,
            observedOn: null,
            reason: NOT_YET_OBSERVED,
        },
    },
    {
        id: 'codeforces',
        platformName: 'Codeforces',
        username: 'nabobery',
        label: 'Problems Solved',
        profileUrl: 'https://codeforces.com/profile/nabobery',
        color: '#1F8ACB',
        isSubmissionCount: false,
        stat: {
            status: 'unknown',
            value: null,
            observedOn: null,
            reason: NOT_YET_OBSERVED,
        },
    },
    {
        id: 'codechef',
        platformName: 'CodeChef',
        username: 'nabobery',
        label: 'Problems Solved',
        // PR 12 fix: HTTPS and the canonical www host.
        profileUrl: 'https://www.codechef.com/users/nabobery',
        color: '#D67325',
        isSubmissionCount: false,
        stat: {
            status: 'known',
            value: 96,
            observedOn: '2025-05-08',
            evidence: 'repository-record',
            evidenceRef:
                'commit 26ea7e3 (hard-coded in the former stats component)',
        },
    },
    {
        id: 'cses',
        platformName: 'CSES',
        username: 'nabobery',
        label: 'Submissions',
        profileUrl: 'https://cses.fi/user/93357',
        color: '#29A38E',
        isSubmissionCount: true,
        stat: {
            status: 'known',
            value: 186,
            observedOn: '2025-05-08',
            evidence: 'repository-record',
            evidenceRef:
                'commit 26ea7e3 (hard-coded in the former stats component)',
        },
    },
]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Throws when a record could mislead: fabricated zero, missing date, bad URL. */
export function validatePlatformStat(stat: PlatformStat): void {
    if (!stat.profileUrl.startsWith('https://')) {
        throw new Error(`${stat.id}: profile URL must use HTTPS`)
    }
    const value = stat.stat
    if (value.status === 'known') {
        if (!Number.isInteger(value.value) || value.value < 0) {
            throw new Error(
                `${stat.id}: known value must be a non-negative integer`
            )
        }
        if (!ISO_DATE.test(value.observedOn)) {
            throw new Error(
                `${stat.id}: known value needs an ISO observation date`
            )
        }
        if (value.evidenceRef.trim() === '') {
            throw new Error(
                `${stat.id}: known value needs an evidence reference`
            )
        }
    } else if (value.value !== null || value.observedOn !== null) {
        throw new Error(
            `${stat.id}: unknown value must not carry a number or date`
        )
    }
}

/** Visible value text. Unknown stays unknown; it is never rendered as 0. */
export function formatStatValue(stat: PlatformStat): string {
    if (stat.stat.status === 'unknown') return 'Not available'
    return stat.isSubmissionCount
        ? String(stat.stat.value)
        : `${stat.stat.value}+`
}

export function formatObservedOn(stat: PlatformStat): string {
    if (stat.stat.status === 'unknown') return 'Not yet recorded'
    // Formatted by hand so server (workerd) and browser output always match.
    const [year, month, day] = stat.stat.observedOn.split('-').map(Number)
    return `Recorded ${MONTHS[month - 1]} ${day}, ${year}`
}

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

/**
 * Response for GET /api/leetcode-stats. Returns the former GraphQL-shaped body
 * only for a source-backed snapshot; otherwise a sanitized 503.
 */
export function leetCodeStatsResponse(
    username: string | null,
    snapshot: PlatformStat | null = competitiveStats.find(
        (s) => s.id === 'leetcode'
    ) ?? null
): { status: number; body: unknown } {
    if (!username) {
        return { status: 400, body: { error: 'Username is required' } }
    }
    if (username.toLowerCase() !== OWNER_LEETCODE_USERNAME.toLowerCase()) {
        return {
            status: 400,
            body: { error: 'Only the portfolio owner username is supported' },
        }
    }
    if (!snapshot || snapshot.stat.status !== 'known') {
        return {
            status: 503,
            body: {
                error: 'LeetCode statistics are not available',
                source: snapshot?.profileUrl ?? null,
                observedOn: null,
            },
        }
    }
    return {
        status: 200,
        body: {
            data: {
                userProfileUserQuestionProgressV2: {
                    // The snapshot records a total, not a per-difficulty split.
                    numAcceptedQuestions: [
                        { difficulty: 'ALL', count: snapshot.stat.value },
                    ],
                },
            },
            source: snapshot.profileUrl,
            observedOn: snapshot.stat.observedOn,
        },
    }
}
