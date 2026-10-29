# PROJECT-PORTICO 🚀

**PORTICO** stands for **P**ortfolio **O**ffering **R**elevant **T**alents, **I**nsights, and **C**reative **O**utput.

## About 🎯

This repository hosts the codebase for my interactive portfolio website. PORTICO is designed to be more than just a static collection of work; it's an engaging platform built to showcase my skills, share the stories and processes behind my projects, and cultivate a strong online presence. The primary goal is to bridge my professional journey with future opportunities and collaborations by offering an insightful and dynamic look into my capabilities and creative output. This interactive experience aims to leave a lasting impression and clearly demonstrate my passion for development and design. ✨

## Tech Stack 🛠️

- **[TanStack Start](https://tanstack.com/start) with React and TypeScript.** The homepage is prerendered to static HTML at build time; the rest is server-rendered.
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/) with Static Assets**, through the direct `@cloudflare/vite-plugin`. Local development and preview run in workerd, the Workers runtime.
- **[Tailwind CSS 4](https://tailwindcss.com/)** through `@tailwindcss/vite`.
- **[Vite+](https://viteplus.dev/)** (`vp`): Vite 8, Oxlint with type-aware checks, Oxfmt, and Vitest. Playwright runs the browser tests.
- **Node.js 24.22.1** and **pnpm 11.28.8** for local and CI builds (`.node-version`, `packageManager`). Production runs in workerd, not Node.

Vercel continues to serve production until the Cloudflare deployment and domain cutover are validated.

## Local development

Prerequisites: Node 24.22.1 and pnpm 11.28.8 (for example `corepack enable` or `vp env use`).

```sh
pnpm install          # installs dependencies; approved build scripts: esbuild, sharp, workerd
pnpm dev              # http://localhost:5173 in workerd, with HMR
```

| Command | What it does |
| --- | --- |
| `pnpm check` | Format check, lint, and type-aware lint (`vp check`). Changes nothing. |
| `pnpm exec vp check --fix` | Applies formatting and lint fixes. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm test` | Unit tests (`vp test run`). |
| `pnpm build` | Verifies prepared images, writes robots/sitemap/headers, and builds the **preview** variant (`noindex`). |
| `pnpm build:production` | Same, for the indexable production variant. |
| `pnpm preview` | Serves `dist/` in workerd on `http://127.0.0.1:4173`. |
| `pnpm test:e2e` | Playwright against `pnpm preview`. Build first. Set `PORTICO_EXPECT_ENV=production` after `build:production`. |
| `pnpm images` | Regenerates responsive image derivatives after a source image changes. |
| `pnpm cf-typegen` | Generates Worker types (`worker-configuration.d.ts`, git-ignored). |

The pre-commit hook runs `pnpm check` and `pnpm typecheck`.

## Content and media

- Portfolio data lives in typed modules: `src/content/projects.ts`, `src/content/experience.ts`, and `src/content/competitive-stats.ts`. Review employment dates, metrics, and project screenshots before publishing content changes.
- Competitive-programming numbers are a dated snapshot. Each value is either recorded with a date and evidence or shown as "Not available". The page makes no requests to the platforms.
- To add or change an image: put the source file under `public/`, add or update its entry (with accurate alt text) in `src/content/media-sources.ts`, run `pnpm images`, and commit the source, `public/images/generated/`, and `src/content/media.generated.json`. `pnpm build` fails if they are out of date.
- `/api/leetcode-stats?username=nabobery` remains as a compatibility endpoint backed by the snapshot.

## Deployment

Nothing deploys automatically from this repository. Confirm the Cloudflare account and Worker name before publishing. The Worker uses Static Assets without database or storage bindings.

Builds default to the preview variant: HTML and HTTP headers carry `noindex, nofollow`, robots.txt disallows crawling, and no sitemap is published. `PORTICO_DEPLOY_ENV=production` selects the indexable variant. The canonical origin is set in `src/lib/site.ts`; update the independent expected origin in `tests/e2e/metadata.spec.ts` when changing it.

Validate a preview build locally:

```sh
pnpm exec playwright install chromium
pnpm check && pnpm typecheck && pnpm test
pnpm build
pnpm test:e2e
```

`pnpm build` produces static files in `dist/client/` and the Worker with its generated Wrangler configuration in `dist/server/`. Wrangler follows `.wrangler/deploy/config.json` to that generated configuration. Configure preview settings before building, and rebuild after configuration changes.

After deployment approval, publish a preview with `pnpm exec wrangler preview --name portico-migration`. Record the Unique Deployment URL and use it for validation, since the stable Preview URL can move:

```sh
set -eu
preview_url='https://<unique-deployment-host>'
PORTICO_E2E_BASE_URL="$preview_url" pnpm test:e2e
for path in / /og-image.jpg; do
    headers=$(curl --fail --silent --show-error --dump-header - --output /dev/null "$preview_url$path")
    printf '%s\n' "$headers" | tr -d '\r' | grep -Fxi 'X-Robots-Tag: noindex, nofollow'
done
status=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$preview_url/definitely-missing")
test "$status" = 404
```

For an approved production release, run `pnpm build:production` and `PORTICO_EXPECT_ENV=production pnpm test:e2e`, then deploy the validated artifact with `pnpm exec wrangler deploy`. Custom domains, DNS changes, and redirects require a separate cutover. Preserve the current Vercel deployment and domain configuration until that cutover is verified. A Worker version rollback restores code but does not undo DNS or redirect changes.

Contact tests intercept FormSubmit and send no messages. Real delivery must be checked separately.

## Project Structure 📁

- `src/routes/`: TanStack Start routes (`__root.tsx` document shell, `index.tsx` homepage, `api/`).
- `src/content/`, `src/lib/`: typed content, media manifest, and site/SEO configuration.
- `components/`: reusable UI components, organized into `sections/`, `ui/`, `theme/`, and `layout/`.
- `scripts/`: image preparation and SEO file generation.
- `tests/e2e/`: Playwright tests.

## Live 🌐

Visit the live version [here](https://avinashchangrani.vercel.app/)

## Author ✨

[Avinash Changrani](https://github.com/nabobery)
