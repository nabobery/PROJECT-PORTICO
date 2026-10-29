import { describe, expect, test } from 'vite-plus/test'
import {
    competitiveStats,
    formatObservedOn,
    formatStatValue,
    leetCodeStatsResponse,
    validatePlatformStat,
    type PlatformStat,
} from './competitive-stats.ts'

const base: PlatformStat = {
    id: 'leetcode',
    platformName: 'LeetCode',
    username: 'Nabobery',
    label: 'Problems Solved',
    profileUrl: 'https://leetcode.com/u/Nabobery/',
    color: '#FFA116',
    isSubmissionCount: false,
    stat: { status: 'unknown', value: null, observedOn: null, reason: 'test' },
}

// Explicit test-only value; not a real observation.
const knownFixture: PlatformStat = {
    ...base,
    stat: {
        status: 'known',
        value: 123,
        observedOn: '2026-01-02',
        evidence: 'profile-observation',
        evidenceRef: 'test fixture',
    },
}

describe('snapshot records', () => {
    test('every shipped record is valid', () => {
        for (const stat of competitiveStats) validatePlatformStat(stat)
    })

    test('each platform appears once', () => {
        const ids = competitiveStats.map((s) => s.id)
        expect(new Set(ids).size).toBe(ids.length)
        expect(ids).toEqual(['leetcode', 'codeforces', 'codechef', 'cses'])
    })

    test('values without an authorized observation stay unknown', () => {
        const byId = Object.fromEntries(competitiveStats.map((s) => [s.id, s]))
        expect(byId.leetcode.stat.status).toBe('unknown')
        expect(byId.codeforces.stat.status).toBe('unknown')
    })

    test('known values carry a date and evidence reference', () => {
        for (const stat of competitiveStats) {
            if (stat.stat.status !== 'known') continue
            expect(stat.stat.observedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            expect(stat.stat.evidenceRef.length).toBeGreaterThan(0)
        }
    })
})

describe('validation', () => {
    test('an unknown value carrying a number is rejected', () => {
        expect(() =>
            validatePlatformStat({
                ...base,
                stat: {
                    status: 'unknown',
                    value: 0 as unknown as null,
                    observedOn: null,
                    reason: 'test',
                },
            })
        ).toThrow(/unknown value/)
    })

    test('a known value without a date is rejected', () => {
        expect(() =>
            validatePlatformStat({
                ...knownFixture,
                stat: { ...knownFixture.stat, observedOn: '' } as never,
            })
        ).toThrow(/observation date/)
    })

    test('an insecure profile URL is rejected', () => {
        expect(() =>
            validatePlatformStat({
                ...base,
                profileUrl: 'http://example.com',
            })
        ).toThrow(/HTTPS/)
    })
})

describe('display', () => {
    test('unknown renders as Not available, never 0', () => {
        expect(formatStatValue(base)).toBe('Not available')
        expect(formatObservedOn(base)).toBe('Not yet recorded')
    })

    test('a known solved count renders with its date', () => {
        expect(formatStatValue(knownFixture)).toBe('123+')
        expect(formatObservedOn(knownFixture)).toBe('Recorded Jan 2, 2026')
    })

    test('submission counts have no plus sign', () => {
        expect(
            formatStatValue({ ...knownFixture, isSubmissionCount: true })
        ).toBe('123')
    })
})

describe('GET /api/leetcode-stats', () => {
    test('a missing username is a 400', () => {
        expect(leetCodeStatsResponse(null)).toEqual({
            status: 400,
            body: { error: 'Username is required' },
        })
    })

    test('any username but the owner is a 400', () => {
        expect(leetCodeStatsResponse('someone-else').status).toBe(400)
    })

    test('the owner username is accepted case-insensitively', () => {
        expect(leetCodeStatsResponse('nabobery', knownFixture).status).toBe(200)
    })

    test('a missing snapshot is a sanitized 503', () => {
        const res = leetCodeStatsResponse('Nabobery', null)
        expect(res.status).toBe(503)
        expect(res.body).toEqual({
            error: 'LeetCode statistics are not available',
            source: null,
            observedOn: null,
        })
        expect(JSON.stringify(res.body)).not.toMatch(/stack|details/i)
    })

    test('an unknown snapshot is a 503, not a fabricated count', () => {
        expect(leetCodeStatsResponse('Nabobery', base).status).toBe(503)
    })

    test('a known snapshot keeps the former GraphQL response shape', () => {
        const res = leetCodeStatsResponse('Nabobery', knownFixture)
        expect(res.body).toMatchObject({
            data: {
                userProfileUserQuestionProgressV2: {
                    numAcceptedQuestions: [{ difficulty: 'ALL', count: 123 }],
                },
            },
            observedOn: '2026-01-02',
        })
    })
})
