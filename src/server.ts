import handler from '@tanstack/react-start/server-entry'
import { DEPLOY_ENV } from './deploy-env.ts'
import { PREVIEW_ROBOTS } from './lib/site.ts'

/**
 * Worker entry. Static Assets answers prerendered HTML and files directly; this
 * handler serves everything else (SSR, the 404 page, /api/*). Preview builds
 * add X-Robots-Tag here because public/_headers only covers static responses.
 */
export default {
    async fetch(request: Request, ...rest: unknown[]): Promise<Response> {
        const response = await (
            handler.fetch as (
                request: Request,
                ...rest: unknown[]
            ) => Promise<Response>
        )(request, ...rest)
        if (DEPLOY_ENV !== 'preview') return response
        const headers = new Headers(response.headers)
        headers.set('X-Robots-Tag', PREVIEW_ROBOTS)
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        })
    },
}
