import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests run against the Cloudflare-backed production preview
 * (`vp preview`, workerd via the Cloudflare Vite plugin) on loopback.
 *
 * - Build first: `pnpm build` (preview variant) or `pnpm build:production`.
 * - PORTICO_EXPECT_ENV tells the metadata tests which variant was built
 *   (default: preview).
 * - PORTICO_E2E_BASE_URL points the suite at an already-running server
 *   instead of starting one, e.g. an authorized Cloudflare preview URL.
 * - PW_CHROMIUM_EXECUTABLE overrides the browser binary when Playwright's
 *   own download is unavailable.
 */
const externalBaseUrl = process.env.PORTICO_E2E_BASE_URL
const port = 4173
const baseURL = externalBaseUrl ?? `http://127.0.0.1:${port}`
const executablePath = process.env.PW_CHROMIUM_EXECUTABLE || undefined

export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never' }]]
        : [['list']],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        launchOptions: { executablePath },
    },
    projects: [
        {
            name: 'desktop-chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: { executablePath },
            },
        },
        {
            name: 'mobile-chromium',
            use: { ...devices['Pixel 7'], launchOptions: { executablePath } },
        },
    ],
    webServer: externalBaseUrl
        ? undefined
        : {
              command: `pnpm exec vp preview --host 127.0.0.1 --port ${port} --strictPort`,
              url: baseURL,
              reuseExistingServer: !process.env.CI,
              timeout: 120_000,
          },
})
