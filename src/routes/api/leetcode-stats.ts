import { createFileRoute } from '@tanstack/react-router'
import { leetCodeStatsResponse } from '../../content/competitive-stats.ts'

/**
 * Compatibility endpoint for the former Next route of the same path. It reads
 * the dated snapshot and never calls LeetCode, so it has no upstream timeout,
 * error-body leak, or arbitrary-username proxying.
 */
export const Route = createFileRoute('/api/leetcode-stats')({
    server: {
        handlers: {
            GET: ({ request }) => {
                const username = new URL(request.url).searchParams.get(
                    'username'
                )
                const { status, body } = leetCodeStatsResponse(username)
                return Response.json(body, {
                    status,
                    headers: {
                        'Cache-Control':
                            status === 200
                                ? 'public, max-age=3600'
                                : 'no-store',
                    },
                })
            },
        },
    },
})
