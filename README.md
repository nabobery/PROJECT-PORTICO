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

The migration from Next.js is documented in [docs/plans/](docs/plans/) and [docs/migration/](docs/migration/). Vercel serves production until a separately approved cutover.

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

- Portfolio data lives in typed modules: `src/content/projects.ts`, `src/content/experience.ts`, and `src/content/competitive-stats.ts`. Copy changes go through [docs/migration/content-decisions.md](docs/migration/content-decisions.md).
- Competitive-programming numbers are a dated snapshot. Each value is either recorded with a date and evidence or shown as "Not available". The page makes no requests to the platforms.
- To add or change an image: put the source file under `public/`, add or update its entry (with accurate alt text) in `src/content/media-sources.ts`, run `pnpm images`, and commit the source, `public/images/generated/`, and `src/content/media.generated.json`. `pnpm build` fails if they are out of date.
- `/api/leetcode-stats?username=nabobery` remains as a compatibility endpoint backed by the snapshot.

## Deployment

See [docs/migration/deployment.md](docs/migration/deployment.md) for the preview and production procedure and [docs/migration/rollback.md](docs/migration/rollback.md) for rollback. Nothing deploys automatically from this repository.

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
