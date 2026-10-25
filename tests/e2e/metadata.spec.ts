import { expect, test } from '@playwright/test'

const ENV =
    process.env.PORTICO_EXPECT_ENV === 'production' ? 'production' : 'preview'
const ORIGIN = 'https://avinashchangrani.vercel.app'
const SECTION_IDS = [
    'home',
    'about',
    'experience',
    'projects',
    'tech-radar',
    'competitive-stats',
    'contact',
]

test.describe('raw HTML response', () => {
    test('contains the portfolio content before any JavaScript runs', async ({
        request,
    }) => {
        const res = await request.get('/')
        expect(res.status()).toBe(200)
        expect(res.headers()['content-type']).toContain('text/html')
        const html = await res.text()
        expect(html).toContain(
            '<title>Avinash Changrani | AI &amp; Full-Stack Developer Portfolio (PORTICO)</title>'
        )
        expect(html).toMatch(/<h1[^>]*>Hi, I&#x27;m Avinash,/)
        expect(html).toContain('Problem Solver')
        expect(html).toMatch(/<nav[^>]*>/)
        for (const id of SECTION_IDS) expect(html).toContain(`id="${id}"`)
        expect(html).toContain(
            'action="https://formsubmit.co/avinashchangrani99@gmail.com"'
        )
    })

    test('has one canonical URL and absolute social metadata', async ({
        request,
    }) => {
        const html = await (await request.get('/')).text()
        expect(html.match(/rel="canonical"/g)).toHaveLength(1)
        expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/"/>`)
        expect(html).toMatch(
            /<meta name="description" content="Explore Avinash Changrani/
        )
        expect(html).toContain(`<meta property="og:url" content="${ORIGIN}/"/>`)
        expect(html).toContain(
            `<meta property="og:image" content="${ORIGIN}/og-image.jpg"/>`
        )
        expect(html).toContain(
            '<meta property="og:image:width" content="1200"/>'
        )
        expect(html).toContain(
            '<meta property="og:image:height" content="630"/>'
        )
        expect(html).toContain(
            '<meta name="twitter:card" content="summary_large_image"/>'
        )
        expect(html).toContain(
            `<meta name="twitter:image" content="${ORIGIN}/og-image.jpg"/>`
        )
        expect(html).toContain(
            '<link rel="icon" href="/portico.png" type="image/png"/>'
        )
        expect(html).not.toMatch(/workers\.dev|localhost|127\.0\.0\.1/)
    })

    test('embeds parseable Person JSON-LD', async ({ request }) => {
        const html = await (await request.get('/')).text()
        const match = html.match(
            /<script type="application\/ld\+json">([^<]*)<\/script>/
        )
        expect(match).not.toBeNull()
        const data = JSON.parse(match![1])
        expect(data).toMatchObject({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Avinash Changrani',
            url: `${ORIGIN}/`,
        })
    })

    test('the social image and icon exist at their public paths', async ({
        request,
    }) => {
        const og = await request.get('/og-image.jpg')
        expect(og.status()).toBe(200)
        expect(og.headers()['content-type']).toBe('image/jpeg')
        expect((await request.get('/portico.png')).status()).toBe(200)
        // Old public path retained until callers and redirects are reviewed.
        expect((await request.get('/og-image.png')).status()).toBe(200)
    })
})

test.describe(`indexing policy (${ENV} build)`, () => {
    test('HTML robots meta matches the build', async ({ request }) => {
        const html = await (await request.get('/')).text()
        if (ENV === 'preview') {
            expect(html).toContain(
                '<meta name="robots" content="noindex, nofollow"/>'
            )
        } else {
            expect(html).toMatch(/<meta name="robots" content="index, follow/)
        }
    })

    test('X-Robots-Tag covers static and Worker responses', async ({
        request,
    }) => {
        const responses = {
            'prerendered HTML': await request.get('/'),
            'static image': await request.get('/og-image.jpg'),
            'Worker 404': await request.get('/definitely-missing-portico-page'),
            'Worker API': await request.get('/api/leetcode-stats'),
        }
        for (const [name, res] of Object.entries(responses)) {
            const tag = res.headers()['x-robots-tag']
            if (ENV === 'preview') expect(tag, name).toBe('noindex, nofollow')
            else expect(tag, name).toBeUndefined()
        }
    })

    test('robots.txt and sitemap.xml match the build', async ({ request }) => {
        const robots = await request.get('/robots.txt')
        expect(robots.status()).toBe(200)
        const sitemap = await request.get('/sitemap.xml')
        if (ENV === 'preview') {
            expect(await robots.text()).toBe('User-agent: *\nDisallow: /\n')
            expect(sitemap.status()).toBe(404)
        } else {
            expect(await robots.text()).toContain(
                `Sitemap: ${ORIGIN}/sitemap.xml`
            )
            expect(sitemap.status()).toBe(200)
            const xml = await sitemap.text()
            expect(xml).toContain(`<loc>${ORIGIN}/</loc>`)
            expect(xml).not.toContain('#')
        }
    })

    test('build-only files are not served', async ({ request }) => {
        expect((await request.get('/_headers')).status()).toBe(404)
    })
})

test.describe('HTTP status behavior', () => {
    test('unknown paths are real 404 pages, not the homepage', async ({
        request,
    }) => {
        for (const path of [
            '/definitely-missing-portico-page',
            '/about',
            '/projects/athena',
        ]) {
            const res = await request.get(path)
            expect(res.status(), path).toBe(404)
            const html = await res.text()
            expect(html, path).toContain('Page not found')
            expect(html, path).not.toContain('id="competitive-stats"')
        }
    })

    test('missing media is a 404', async ({ request }) => {
        expect(
            (
                await request.get('/images/projects/not-a-real-image.png')
            ).status()
        ).toBe(404)
        expect(
            (await request.get('/images/generated/not-real-480.webp')).status()
        ).toBe(404)
    })

    test('the 404 page is usable in a browser', async ({ page }) => {
        const res = await page.goto('/definitely-missing-portico-page')
        expect(res?.status()).toBe(404)
        await expect(
            page.getByRole('heading', { name: 'Page not found' })
        ).toBeVisible()
        await page.getByRole('link', { name: 'Back to the homepage' }).click()
        await expect(page.locator('#home')).toBeVisible()
    })
})

test.describe('GET /api/leetcode-stats compatibility endpoint', () => {
    test('requires the username', async ({ request }) => {
        const res = await request.get('/api/leetcode-stats')
        expect(res.status()).toBe(400)
        expect(await res.json()).toEqual({ error: 'Username is required' })
    })

    test('rejects any username but the owner', async ({ request }) => {
        const res = await request.get(
            '/api/leetcode-stats?username=someone-else'
        )
        expect(res.status()).toBe(400)
    })

    test('reports the unknown snapshot as a sanitized 503', async ({
        request,
    }) => {
        const res = await request.get('/api/leetcode-stats?username=nabobery')
        expect(res.status()).toBe(503)
        expect(res.headers()['cache-control']).toBe('no-store')
        const body = await res.json()
        expect(body.error).toBe('LeetCode statistics are not available')
        expect(JSON.stringify(body)).not.toMatch(/details|stack/)
    })
})
