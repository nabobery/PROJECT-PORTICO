/**
 * Single source for origin, indexing policy, and document metadata.
 *
 * This module is imported by the app (src/routes/__root.tsx, src/server.ts) and
 * by scripts/generate-seo.mjs, which Node 24 runs with native type stripping.
 * Keep it free of path aliases, enums, and other non-erasable TypeScript.
 */

export type DeployEnv = 'production' | 'preview'

/**
 * The canonical origin. It stays on the current Vercel production host until a
 * separately approved cutover changes it (planned target: https://nabobery.dev).
 * It is never derived from a request Host header.
 */
export const PRODUCTION_ORIGIN = 'https://avinashchangrani.vercel.app'

/** Public HTML pages. Hash anchors are not pages and never go in the sitemap. */
export const PUBLIC_PAGES: readonly string[] = ['/']

export const PREVIEW_ROBOTS = 'noindex, nofollow'

export const SITE = {
    name: "Avinash Changrani's Portfolio",
    author: 'Avinash Changrani',
    title: 'Avinash Changrani | AI & Full-Stack Developer Portfolio (PORTICO)',
    description:
        "Explore Avinash Changrani's portfolio: an AI/ML and Full-Stack Software Engineer showcasing innovative projects, expertise in Next.js, React, Python, and more. Discover insights into dynamic rule engines, RAG pipelines, and scalable software solutions.",
    socialTitle: 'Avinash Changrani | AI & Full-Stack Developer Portfolio',
    socialDescription:
        'Discover innovative projects and expertise in AI/ML and Full-Stack development by Avinash Changrani.',
    keywords: [
        'Avinash Changrani',
        'Portfolio',
        'Next.js',
        'React',
        'TypeScript',
        'Full-Stack Developer',
        'Software Engineer',
        'AI',
        'Machine Learning',
        'Python',
        'Java',
        'Web Development',
        'PORTICO',
        'Software Development',
        'Tech Portfolio',
    ],
    authorUrl: 'https://github.com/nabobery',
    ogImage: {
        path: '/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: "Avinash Changrani's Portfolio Open Graph Image",
    },
    icon: '/portico.png',
    sameAs: [
        'https://github.com/nabobery',
        'https://www.linkedin.com/in/avinash-changrani/',
        'https://nabobery.github.io/',
    ],
} as const

/** Accepts only the two known values; anything else is a build error. */
export function resolveDeployEnv(value: string | undefined): DeployEnv {
    if (value === undefined || value === '') return 'preview'
    if (value === 'production' || value === 'preview') return value
    throw new Error(
        `PORTICO_DEPLOY_ENV must be "production" or "preview", received "${value}"`
    )
}

export function absoluteUrl(path: string): string {
    if (!path.startsWith('/')) {
        throw new Error(`Expected an absolute path, received "${path}"`)
    }
    return new URL(path, PRODUCTION_ORIGIN).toString()
}

export function robotsDirective(env: DeployEnv): string {
    return env === 'production'
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : PREVIEW_ROBOTS
}

export function robotsTxt(env: DeployEnv): string {
    if (env === 'preview') {
        return 'User-agent: *\nDisallow: /\n'
    }
    return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
}

export function sitemapXml(): string {
    const urls = PUBLIC_PAGES.map(
        (path) =>
            `  <url>\n    <loc>${escapeXml(absoluteUrl(path))}</loc>\n  </url>`
    ).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/**
 * Static asset headers for Workers Static Assets (`public/_headers`). Preview
 * builds attach X-Robots-Tag to every static response because prerendered HTML
 * and media are served without running the Worker.
 */
export function staticHeaders(env: DeployEnv): string {
    const lines = [
        '/*',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: strict-origin-when-cross-origin',
    ]
    if (env === 'preview') lines.push(`  X-Robots-Tag: ${PREVIEW_ROBOTS}`)
    lines.push(
        '',
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/fonts/*',
        '  Cache-Control: public, max-age=0, must-revalidate',
        ''
    )
    return lines.join('\n')
}

export function personJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE.author,
        jobTitle: 'Software Engineer',
        url: absoluteUrl('/'),
        sameAs: [...SITE.sameAs],
    }
}

/** JSON for a <script> element: `<` is escaped so content cannot close the tag. */
export function serializeJsonLd(value: unknown): string {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
}

export interface HeadMeta {
    meta: Array<Record<string, string>>
    links: Array<Record<string, string>>
}

export function documentHead(env: DeployEnv): HeadMeta {
    const canonical = absoluteUrl('/')
    const image = absoluteUrl(SITE.ogImage.path)
    return {
        meta: [
            { title: SITE.title },
            { name: 'description', content: SITE.description },
            { name: 'author', content: SITE.author },
            { name: 'keywords', content: SITE.keywords.join(',') },
            { name: 'robots', content: robotsDirective(env) },
            { property: 'og:title', content: SITE.socialTitle },
            { property: 'og:description', content: SITE.socialDescription },
            { property: 'og:url', content: canonical },
            { property: 'og:site_name', content: SITE.name },
            { property: 'og:locale', content: 'en_US' },
            { property: 'og:type', content: 'website' },
            { property: 'og:image', content: image },
            { property: 'og:image:type', content: SITE.ogImage.type },
            { property: 'og:image:width', content: String(SITE.ogImage.width) },
            {
                property: 'og:image:height',
                content: String(SITE.ogImage.height),
            },
            { property: 'og:image:alt', content: SITE.ogImage.alt },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: SITE.socialTitle },
            { name: 'twitter:description', content: SITE.socialDescription },
            { name: 'twitter:image', content: image },
            { name: 'twitter:image:alt', content: SITE.ogImage.alt },
        ],
        links: [
            { rel: 'canonical', href: canonical },
            { rel: 'icon', href: SITE.icon, type: 'image/png' },
            { rel: 'author', href: SITE.authorUrl },
        ],
    }
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}
