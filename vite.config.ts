import { defineConfig } from 'vite-plus'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveDeployEnv } from './src/lib/site.ts'

// Vitest loads this file too. The Cloudflare and Start plugins start a Worker
// runtime, which unit tests do not need, so they run only outside Vitest.
const isVitest = process.env.VITEST === 'true'
const deployEnv = resolveDeployEnv(process.env.PORTICO_DEPLOY_ENV)

export default defineConfig({
    resolve: {
        alias: { '@': import.meta.dirname },
    },
    define: {
        __PORTICO_DEPLOY_ENV__: JSON.stringify(deployEnv),
    },
    plugins: isVitest
        ? [react()]
        : [
              cloudflare({ viteEnvironment: { name: 'ssr' } }),
              tanstackStart({
                  prerender: { enabled: true, crawlLinks: false },
              }),
              react(),
              tailwindcss(),
          ],
    lint: {
        options: { typeAware: true, typeCheck: true },
        ignorePatterns: ['src/routeTree.gen.ts'],
    },
    fmt: {
        // Matches the former .prettierrc.json so the port adds no format churn.
        printWidth: 80,
        tabWidth: 4,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        ignorePatterns: [
            'src/routeTree.gen.ts',
            'pnpm-lock.yaml',
            'docs/**',
            'public/**',
            '*.md',
        ],
    },
    test: {
        include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
        environment: 'node',
    },
})
