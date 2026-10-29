import { expect, test, type Page } from '@playwright/test'

const SECTION_IDS = [
    'home',
    'about',
    'experience',
    'projects',
    'tech-radar',
    'competitive-stats',
    'contact',
]
const NAV_LINKS = [
    ['About', '#about'],
    ['Experience', '#experience'],
    ['Projects', '#projects'],
    ['Tech Stack', '#tech-radar'],
    ['CP Stats', '#competitive-stats'],
    ['Contact', '#contact'],
] as const
const FORM_ACTION = 'https://formsubmit.co/avinashchangrani99@gmail.com'

/** Fails the test on page errors, console errors, or hydration warnings. */
function watchConsole(page: Page) {
    const problems: string[] = []
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
    page.on('console', (msg) => {
        const text = msg.text()
        if (msg.type() === 'error' || /hydrat/i.test(text)) {
            problems.push(`${msg.type()}: ${text}`)
        }
    })
    return problems
}

/** Records any request that leaves the local preview origin. */
function watchExternalRequests(page: Page, baseURL: string) {
    const external: string[] = []
    const origin = new URL(baseURL).origin
    page.on('request', (req) => {
        if (new URL(req.url()).origin !== origin) external.push(req.url())
    })
    return external
}

async function revealSection(page: Page, id: string) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
}

test.describe('page structure', () => {
    test('preserves public sections and returns real 404s', async ({
        page,
        request,
    }) => {
        await page.goto('/')
        for (const id of SECTION_IDS) {
            await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
        }
        expect(
            (await request.get('/definitely-missing-portico-page')).status()
        ).toBe(404)
    })

    test('loads without console errors or third-party requests', async ({
        page,
        baseURL,
    }) => {
        const problems = watchConsole(page)
        const external = watchExternalRequests(page, baseURL!)
        await page.goto('/')
        for (const id of SECTION_IDS) await revealSection(page, id)
        await page.waitForTimeout(500)
        expect(problems).toEqual([])
        // No LeetCode/Codeforces calls: stats come from the dated snapshot.
        expect(external).toEqual([])
    })
})

test('a component failure preserves the document and can recover', async ({
    page,
}) => {
    await page.addInitScript(() => {
        // Fail a real child effect once; a reload can then recover normally.
        if (!sessionStorage.getItem('portico-test-canvas-failed')) {
            HTMLCanvasElement.prototype.getContext = () => {
                sessionStorage.setItem('portico-test-canvas-failed', 'true')
                throw new Error('Injected canvas setup failure')
            }
        }
    })
    await page.goto('/')
    await expect(
        page.getByRole('heading', { name: 'Something went wrong' })
    ).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('body')).toHaveClass(/font-sans/)
    expect(
        await page.locator('head link[rel="stylesheet"]').count()
    ).toBeGreaterThan(0)
    expect(await page.locator('script[type="module"]').count()).toBeGreaterThan(
        0
    )
    await page.getByRole('link', { name: 'Back to the homepage' }).click()
    await expect(page.locator('#home h1')).toContainText("Hi, I'm Avinash")
})

test.describe('navigation', () => {
    test('desktop nav links keep their hash targets', async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, 'desktop navigation is hidden on mobile widths')
        await page.goto('/')
        const nav = page.locator('header nav')
        for (const [name, href] of NAV_LINKS) {
            await expect(
                nav.getByRole('link', { name, exact: true })
            ).toHaveAttribute('href', href)
        }
        await nav.getByRole('link', { name: 'Projects', exact: true }).click()
        await expect(page).toHaveURL(/#projects$/)
        await expect(page.locator('#projects')).toBeInViewport()
    })

    test('hero calls to action point at the sections', async ({ page }) => {
        await page.goto('/')
        const hero = page.locator('#home')
        await expect(
            hero.getByRole('link', { name: 'View My Work' })
        ).toHaveAttribute('href', '#projects')
        await expect(
            hero.getByRole('link', { name: 'Get In Touch' })
        ).toHaveAttribute('href', '#contact')
        await expect(
            hero.getByRole('link', { name: 'Scroll down' })
        ).toHaveAttribute('href', '#about')
    })

    test('mobile menu works from the keyboard', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'the sheet menu exists only on mobile widths')
        await page.goto('/')
        const trigger = page.getByRole('button', { name: 'Open menu' })
        await trigger.focus()
        await page.keyboard.press('Enter')
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible()
        for (const [name, href] of NAV_LINKS) {
            await expect(
                dialog.getByRole('link', { name, exact: true })
            ).toHaveAttribute('href', href)
        }
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
        await expect(
            page.getByRole('button', { name: 'Open menu' })
        ).toBeFocused()

        await page.getByRole('button', { name: 'Open menu' }).click()
        await page
            .getByRole('dialog')
            .getByRole('link', { name: 'Contact', exact: true })
            .click()
        await expect(page.getByRole('dialog')).toBeHidden()
        await expect(page).toHaveURL(/#contact$/)
    })

    test('the back-to-top control is a keyboard-reachable button', async ({
        page,
    }) => {
        await page.goto('/#contact')
        await page.evaluate(() => window.scrollTo(0, 2000))
        const button = page.getByRole('button', { name: 'Back to top' })
        await expect(button).toBeVisible()
        await button.focus()
        await page.keyboard.press('Enter')
        await expect
            .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
            .toBeLessThan(50)
    })
})

test.describe('theme', () => {
    test('follows a dark system preference before hydration', async ({
        browser,
    }) => {
        const context = await browser.newContext({ colorScheme: 'dark' })
        const page = await context.newPage()
        await page.addInitScript(() => {
            document.addEventListener('DOMContentLoaded', () => {
                ;(window as unknown as { __firstClass: string }).__firstClass =
                    document.documentElement.className
            })
        })
        await page.goto('/')
        expect(
            await page.evaluate(
                () =>
                    (window as unknown as { __firstClass: string }).__firstClass
            )
        ).toContain('dark')
        await context.close()
    })

    test('a saved light choice overrides a dark system preference', async ({
        browser,
    }) => {
        const context = await browser.newContext({ colorScheme: 'dark' })
        const page = await context.newPage()
        await page.addInitScript(() => localStorage.setItem('theme', 'light'))
        await page.goto('/')
        await expect(page.locator('html')).toHaveClass(/light/)
        await expect(page.locator('html')).not.toHaveClass(/dark/)
        await context.close()
    })

    test('toggling persists across reloads', async ({ page, isMobile }) => {
        await page.emulateMedia({ colorScheme: 'light' })
        await page.goto('/')
        if (isMobile)
            await page.getByRole('button', { name: 'Open menu' }).click()
        const toggle = page
            .getByRole('button', { name: 'Switch to dark theme' })
            .first()
        await toggle.click()
        await expect(page.locator('html')).toHaveClass(/dark/)
        expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
            'dark'
        )
        await page.reload()
        await expect(page.locator('html')).toHaveClass(/dark/)
    })

    test('denied localStorage still renders the page', async ({ page }) => {
        const problems = watchConsole(page)
        await page.addInitScript(() => {
            Object.defineProperty(window, 'localStorage', {
                get() {
                    throw new DOMException('denied', 'SecurityError')
                },
            })
        })
        await page.goto('/')
        await expect(page.locator('h1')).toContainText("Hi, I'm Avinash")
        expect(problems.filter((p) => p.startsWith('pageerror'))).toEqual([])
    })
})

test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('navigation stays visible and the headline stays static', async ({
        page,
        isMobile,
    }) => {
        await page.goto('/')
        // Regression: the Next version left the logo and links at opacity 0.
        await expect(
            page.locator('header').getByText('Avinash Changrani')
        ).toBeVisible()
        if (!isMobile) {
            await expect(
                page
                    .locator('header nav')
                    .getByRole('link', { name: 'About', exact: true })
            ).toBeVisible()
        }
        await page.waitForTimeout(1500)
        await expect(page.locator('h1')).toContainText('Problem Solver')
        await expect(page.locator('.typed-cursor')).toHaveCount(0)
        expect(await page.locator('body > .ripple').count()).toBe(0)
    })

    test('stats icons do not scale on hover', async ({ page }) => {
        await page.goto('/')
        const icon = page.locator('[data-platform="leetcode"] .rounded-full')
        await revealSection(page, 'competitive-stats')
        await icon.hover()
        await page.waitForTimeout(400) // Let the existing 300 ms hover transition finish.
        await expect
            .poll(() => icon.evaluate((el) => getComputedStyle(el).scale))
            .toMatch(/^(none|1)$/)
    })

    test('the experience timeline glow does not loop', async ({ page }) => {
        await page.goto('/')
        await revealSection(page, 'experience')
        const dot = page.locator('#experience .rounded-full.bg-primary').first()
        await page.waitForTimeout(2500)
        const first = await dot.evaluate((el) => getComputedStyle(el).boxShadow)
        await page.waitForTimeout(600)
        const second = await dot.evaluate(
            (el) => getComputedStyle(el).boxShadow
        )
        expect(second).toBe(first)
    })
})

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('content, links, and the form are readable', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('h1')).toContainText(
            "Hi, I'm Avinash, a Problem Solver"
        )
        for (const heading of [
            'My Journey as a Developer',
            'My Professional Journey',
            'My Recent Work',
            'Competitive Programming Stats',
            'Get In Touch',
        ]) {
            const h2 = page.getByRole('heading', { level: 2, name: heading })
            await expect(h2).toBeVisible()
            expect(
                await h2.evaluate((el) => getComputedStyle(el).opacity)
            ).toBe('1')
        }
        await expect(
            page.getByRole('link', { name: 'avinashchangrani99@gmail.com' })
        ).toHaveAttribute('href', 'mailto:avinashchangrani99@gmail.com')
        await expect(page.locator(`form[action="${FORM_ACTION}"]`)).toHaveCount(
            1
        )
    })
})

test.describe('projects', () => {
    test('category filters work and cards use prepared media', async ({
        page,
    }) => {
        await page.goto('/')
        await revealSection(page, 'projects')
        const section = page.locator('#projects')
        const cards = section.locator('h3')
        await expect(cards).toHaveCount(12)
        await section.getByRole('tab', { name: 'AI/ML' }).click()
        await expect(cards).toHaveText([
            'Athena',
            'Attribute-Based Pedestrian Detection',
            'exAImination',
            'Maze Solver AI',
        ])
        await section.getByRole('tab', { name: 'All' }).click()
        await expect(cards).toHaveCount(12)

        const img = section.locator('img').first()
        await expect(img).toHaveAttribute('loading', 'lazy')
        await expect(img).toHaveAttribute('width', /\d+/)
        await expect(img).toHaveAttribute('height', /\d+/)
        await expect(img).toHaveAttribute(
            'alt',
            'Screenshot of the go-initializer project generator form'
        )
        await expect(
            section.locator('picture source[type="image/avif"]').first()
        ).toHaveAttribute('srcset', /480w/)
    })

    test('filter tabs are reachable from the keyboard', async ({ page }) => {
        await page.goto('/')
        await revealSection(page, 'projects')
        const tabs = page.locator('#projects').getByRole('tab')
        await tabs.first().focus()
        await page.keyboard.press('ArrowRight')
        await expect(tabs.nth(1)).toBeFocused()
        await page.keyboard.press('Enter')
        await expect(tabs.nth(1)).toHaveAttribute('data-state', 'active')
    })

    test('a failed image leaves readable alt text and other cards intact', async ({
        page,
    }) => {
        await page.route('**/images/generated/athena-*', (route) =>
            route.abort()
        )
        await page.goto('/')
        // Lazy images load only near the viewport, so scroll to the card itself.
        await page
            .locator('#projects h3', { hasText: 'Athena' })
            .scrollIntoViewIfNeeded()
        const fallback = page.locator('[data-media-failed="athena"]')
        await expect(fallback).toBeVisible()
        await expect(fallback).toHaveText(/Athena's neural network builder/)
        await expect(
            page.locator(
                '#projects img[alt^="Screenshot of the go-initializer"]'
            )
        ).toHaveCount(1)
    })

    test('loaded images have no broken requests', async ({ page }) => {
        const failed: string[] = []
        page.on('response', (res) => {
            if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`)
        })
        await page.goto('/')
        for (const id of SECTION_IDS) await revealSection(page, id)
        await page.waitForLoadState('networkidle')
        expect(failed).toEqual([])
        const broken = await page.$$eval('img', (imgs) =>
            imgs
                .filter((img) => img.complete && img.naturalWidth === 0)
                .map((img) => img.currentSrc || img.src)
        )
        expect(broken).toEqual([])
    })
})

test.describe('competitive stats', () => {
    test('each platform renders independently from the snapshot', async ({
        page,
    }) => {
        await page.goto('/')
        await revealSection(page, 'competitive-stats')
        const section = page.locator('#competitive-stats')
        await expect(section.locator('[data-platform]')).toHaveCount(4)
        for (const id of ['leetcode', 'codeforces']) {
            const card = section.locator(`[data-platform="${id}"]`)
            await expect(card).toHaveAttribute('data-stat-status', 'unknown')
            await expect(card).toContainText('Not available')
            await expect(card).not.toContainText(/\b0\b/)
        }
        await expect(
            section.locator('[data-platform="codechef"]')
        ).toContainText('96')
        await expect(
            section.locator('[data-platform="codechef"]')
        ).toContainText('Recorded May 8, 2025')
        await expect(section.locator('[data-platform="cses"]')).toContainText(
            '186'
        )
        await expect(section).not.toContainText('Error loading stats')
    })

    test('blocked provider sites cannot affect the section', async ({
        page,
    }) => {
        await page.route(
            /leetcode\.com|codeforces\.com|codechef\.com|cses\.fi/,
            (route) => route.abort()
        )
        await page.goto('/')
        await revealSection(page, 'competitive-stats')
        await expect(
            page.locator('#competitive-stats [data-platform]')
        ).toHaveCount(4)
    })

    test('profile links use HTTPS', async ({ page }) => {
        await page.goto('/')
        const hrefs = await page
            .locator('#competitive-stats a')
            .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
        expect(hrefs).toEqual([
            'https://leetcode.com/u/Nabobery/',
            'https://codeforces.com/profile/nabobery',
            'https://www.codechef.com/users/nabobery',
            'https://cses.fi/user/93357',
        ])
    })
})

test.describe('contact form (FormSubmit intercepted, nothing is sent)', () => {
    async function fill(page: Page) {
        await revealSection(page, 'contact')
        const form = page.locator(`form[action="${FORM_ACTION}"]`)
        await form.getByLabel('Name').fill('Test Sender')
        await form.getByLabel('Email').fill('test@example.com')
        await form.getByLabel('Subject').fill('Test subject')
        await form.getByLabel('Message').fill('Test message body')
        return form
    }

    test('posts the existing field names to FormSubmit', async ({ page }) => {
        let posted: URLSearchParams | null = null
        await page.route(FORM_ACTION, async (route) => {
            expect(route.request().method()).toBe('POST')
            posted = new URLSearchParams(route.request().postData() ?? '')
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: '<h1>Intercepted FormSubmit success</h1>',
            })
        })
        await page.goto('/')
        const form = await fill(page)
        await form.getByRole('button', { name: 'Send Message' }).click()
        await expect(
            page.getByText('Intercepted FormSubmit success')
        ).toBeVisible()
        expect(posted).not.toBeNull()
        expect(Object.fromEntries(posted!)).toEqual({
            _subject: 'New Contact Form Submission from Portfolio!',
            name: 'Test Sender',
            email: 'test@example.com',
            subject: 'Test subject',
            message: 'Test message body',
        })
    })

    test('a provider error is shown by the provider, not hidden', async ({
        page,
    }) => {
        await page.route(FORM_ACTION, (route) =>
            route.fulfill({
                status: 500,
                contentType: 'text/html',
                body: '<h1>Intercepted FormSubmit error</h1>',
            })
        )
        await page.goto('/')
        const form = await fill(page)
        const [response] = await Promise.all([
            page.waitForResponse(FORM_ACTION),
            form.getByRole('button', { name: 'Send Message' }).click(),
        ])
        expect(response.status()).toBe(500)
        await expect(
            page.getByText('Intercepted FormSubmit error')
        ).toBeVisible()
    })

    test('required fields block an empty submission', async ({ page }) => {
        let requests = 0
        await page.route(FORM_ACTION, (route) => {
            requests += 1
            return route.abort()
        })
        await page.goto('/')
        await revealSection(page, 'contact')
        const form = page.locator(`form[action="${FORM_ACTION}"]`)
        await form.getByRole('button', { name: 'Send Message' }).click()
        expect(
            await form
                .getByLabel('Name')
                .evaluate(
                    (el) => (el as HTMLInputElement).validity.valueMissing
                )
        ).toBe(true)
        await form.getByLabel('Name').fill('Test Sender')
        await form.getByLabel('Email').fill('not-an-email')
        await form.getByRole('button', { name: 'Send Message' }).click()
        expect(
            await form
                .getByLabel('Email')
                .evaluate(
                    (el) => (el as HTMLInputElement).validity.typeMismatch
                )
        ).toBe(true)
        expect(requests).toBe(0)
        await expect(page).toHaveURL(/127\.0\.0\.1|localhost|\//)
    })
})
