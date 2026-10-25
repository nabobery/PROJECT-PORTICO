import { describe, expect, test } from 'vite-plus/test'
import {
    PRODUCTION_ORIGIN,
    absoluteUrl,
    documentHead,
    personJsonLd,
    resolveDeployEnv,
    robotsTxt,
    serializeJsonLd,
    sitemapXml,
    staticHeaders,
} from './site.ts'

describe('deploy environment', () => {
    test('unset defaults to preview so an unconfigured build is never indexed', () => {
        expect(resolveDeployEnv(undefined)).toBe('preview')
        expect(resolveDeployEnv('')).toBe('preview')
    })

    test('unknown values fail the build', () => {
        expect(() => resolveDeployEnv('prod')).toThrow(/PORTICO_DEPLOY_ENV/)
    })
})

describe('origin', () => {
    test('absolute URLs use the single production origin', () => {
        expect(absoluteUrl('/og-image.jpg')).toBe(
            `${PRODUCTION_ORIGIN}/og-image.jpg`
        )
    })

    test('relative paths are rejected', () => {
        expect(() => absoluteUrl('og-image.jpg')).toThrow()
    })
})

describe('document head', () => {
    const find = (env: 'production' | 'preview', key: string) =>
        documentHead(env).meta.find((m) => m.name === key || m.property === key)
            ?.content

    test('production is indexable and preview is not', () => {
        expect(find('production', 'robots')).toMatch(/^index, follow/)
        expect(find('preview', 'robots')).toBe('noindex, nofollow')
    })

    test('exactly one canonical link, at the production origin', () => {
        for (const env of ['production', 'preview'] as const) {
            const canonical = documentHead(env).links.filter(
                (l) => l.rel === 'canonical'
            )
            expect(canonical).toEqual([
                { rel: 'canonical', href: `${PRODUCTION_ORIGIN}/` },
            ])
        }
    })

    test('social images are absolute and match the 1200x630 JPG', () => {
        expect(find('production', 'og:image')).toBe(
            `${PRODUCTION_ORIGIN}/og-image.jpg`
        )
        expect(find('production', 'twitter:image')).toBe(
            `${PRODUCTION_ORIGIN}/og-image.jpg`
        )
        expect(find('production', 'og:image:width')).toBe('1200')
        expect(find('production', 'og:image:height')).toBe('630')
    })
})

describe('JSON-LD', () => {
    test('Person data points at the canonical origin', () => {
        expect(personJsonLd()).toMatchObject({
            '@type': 'Person',
            url: `${PRODUCTION_ORIGIN}/`,
        })
    })

    test('serialization cannot close the script element', () => {
        const out = serializeJsonLd({ name: '</script><script>alert(1)' })
        expect(out).not.toContain('<')
        expect(JSON.parse(out)).toEqual({ name: '</script><script>alert(1)' })
    })
})

describe('robots, sitemap, headers', () => {
    test('production robots allows crawling and names the sitemap', () => {
        expect(robotsTxt('production')).toBe(
            `User-agent: *\nAllow: /\n\nSitemap: ${PRODUCTION_ORIGIN}/sitemap.xml\n`
        )
    })

    test('preview robots disallows everything and names no sitemap', () => {
        expect(robotsTxt('preview')).toBe('User-agent: *\nDisallow: /\n')
    })

    test('the sitemap lists only real pages, no anchors or dates', () => {
        const xml = sitemapXml()
        expect(xml).toContain(`<loc>${PRODUCTION_ORIGIN}/</loc>`)
        expect(xml).not.toContain('#')
        expect(xml).not.toContain('lastmod')
        expect(xml.match(/<url>/g)).toHaveLength(1)
    })

    test('preview static headers carry X-Robots-Tag; production does not', () => {
        expect(staticHeaders('preview')).toContain(
            'X-Robots-Tag: noindex, nofollow'
        )
        expect(staticHeaders('production')).not.toContain('X-Robots-Tag')
    })
})
