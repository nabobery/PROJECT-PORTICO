# PORTICO migration research record

This reference records the evidence available on 25 October 2026 UTC. The implementation procedure is [the migration plan](2026-10-25-tanstack-start-cloudflare.md). Source review establishes recommendations, not a working dependency combination.

## Repository and machine evidence

The Fleet source is `/Users/avinashchangrani/personal/fleet` on Avinash's Mac. Its `AGENTS.md`, `machines/personal-dev-01.json`, `projects/nabobery-profile.json`, operations runbook, GitHub runbook, security review, and scoped GitHub skill identify the personal coding machine and workspace convention. The profile repository is a location example, not PORTICO's project configuration.

The provider reported these facts during this task:

| Item | Observation |
| --- | --- |
| Machine | `personal-dev-01` |
| Provider ID | `m_agquw2m5tu4kimi4owyednwk5i` |
| Live hostname | `instabox-personal-dev-01` |
| Coding identity | `agent`, UID 1001, home `/data/agent` |
| Transport used | Authenticated Mac `instabox exec`, normal TLS verification, `sudo -n -iu agent` for coding commands |
| Lifecycle | Initially paused. Resume operation `op_agqxgan3nhoh4jmussrhpzjyme` succeeded. Live revision 15, running and ready, no pending operation |
| Workspace | `/data/agent/projects`, confirmed before clone |
| Checkout | `/data/agent/projects/PROJECT-PORTICO` |
| Remote | `https://github.com/nabobery/PROJECT-PORTICO.git` |
| Branch and HEAD | `main`, `58f8827934cbc9fefb77d1fb7e43bbdfb73a3df7` |
| Initial checkout state | New clone, clean, no existing PORTICO directory or work overwritten |
| Installed runtime observed | Node `v22.23.3`, Git `2.47.3`. Neither was changed |
| Repository instructions | No repository `AGENTS.md` or `.agents/skills` files found |
| Global instructions | Mac and VM `.codex/AGENTS.md` read. The VM requires architecture and production/test flow diagrams for multi-step plans |

An identity-check attempt during restore returned `operation_conflict`. It did not run. After provider readiness was confirmed, the identity check and clone succeeded. No security warning was bypassed, SSH agent forwarded, credential created, or credential content read.

The Mac Fleet checkout already had unrelated edits in machine records and OnArrival review documentation. Those files were not changed. Normal HTTPS Git and the VM's existing owner-routing helper supplied repository access. Read-only PR metadata was refreshed with `/data/agent/.local/bin/fleet-github gh nabobery pr list --repo nabobery/PROJECT-PORTICO ...`.

## Open PR evidence

These heads were refreshed through GitHub on the Mac and through the VM helper after clone. All target `main`.

| PR | Current head | State | Recommended disposition |
| --- | --- | --- | --- |
| [12, professional positioning and metadata](https://github.com/nabobery/PROJECT-PORTICO/pull/12) | `492ef56bd803a5cf29209b07e72ded664cefb2d9` | Open, not draft | Preserve content and useful fixes. Port accepted changes once, with a provenance checklist. Do not merge Next-specific SEO APIs into the final Start app |
| [11, CI actions](https://github.com/nabobery/PROJECT-PORTICO/pull/11) | `f2bfa330f88f9bb90408ac84210fd2d6339e8efb` | Open, not draft | Rework or supersede through a separately authorized PR decision. It changes checkout/setup-node v4 to v6 and removes the explicit Node 20 setting. It still runs `npm install` and mutating lint. It does not establish Node 24 support |
| [9, redirect extension](https://github.com/nabobery/PROJECT-PORTICO/pull/9) | `52800a2837d88a9ab42cc6f7dd8c7f1b95206488` | Open draft | Decide featured versus archive. Reuse the one project record intentionally. Its referenced `redirect-url-extension.png` is absent |

GitHub reports historical lint and Vercel success for all three heads. Those checks ran in July 2026, April 2026, and October 2025 respectively. No new lint, build, browser test, or deployment ran in this task. PR 12 has no submitted reviews. CodeRabbit and Codex comments say their review limits were reached, so green bot status is not substantive review evidence.

PR 12 contains useful OnArrival and experience updates, a revised project selection, hero/about/contact/skills copy, canonical and social metadata, Person JSON-LD, robots, sitemap, a smaller OG JPG, direct `clsx` and Radix dependencies, and motion/Sheet/spinner fixes. Its SEO URLs still use `avinashchangrani.vercel.app`.

The PR 12 project image mismatches are directly visible in its branch:

| Project | Incorrect image assignment |
| --- | --- |
| Veo3 Workflow Agents | `public/images/projects/go-initializer.png` |
| LyriFind | `public/images/projects/athena.png` |
| SignalPR | `public/images/projects/maaKaVi.png` |
| fm-code | `public/images/projects/attribute-pedestrian-detection.png` |
| Attribute-Based Pedestrian Detection | `public/images/projects/before-you-sign.png` |

Employment dates, current role wording, approximate years of experience, and quantitative claims need Avinash's confirmation before publication. Examples include about 15% booking uplift, about 25% integration improvement, sub-millisecond authorization, about 40% research reduction, and 7x API improvement. Existing internship and project metrics also require confirmation. PR text is not independent evidence of those claims.

## Code facts refreshed against the clone

`app/page.tsx` composes Hero, About, Experience, Projects, TechRadar, CompetitiveStats, Contact, and ScrollProgress. Testimonials, Blog, Process, and Achievements are disabled. Active section IDs are `home`, `about`, `experience`, `projects`, `tech-radar`, `competitive-stats`, and `contact`.

`app/layout.tsx` supplies Next metadata, three Google font families through `next/font`, a theme initialization script, ThemeProvider, Navbar, Footer, CursorRipple, and Toaster. The theme wrapper uses `next-themes` and manages reduced-motion state. `next-themes` is not automatically incompatible with Start. Two initialization paths need a hydration and first-paint check.

`next/link` occurs in `components/layout/navbar.tsx`, `components/layout/footer.tsx`, and `components/sections/hero.tsx`. `next/image` occurs in About, Projects, and the disabled Blog. `next.config.mjs` sets `images.unoptimized: true` and ignores lint during builds. Several source PNGs exceed 1 MB. `go-backend-journey.png` and the current OG PNG are about 2 MB each.

`app/api/leetcode-stats/route.ts` accepts arbitrary usernames and posts GraphQL without a timeout, response schema validation, or cache policy. It exposes upstream error bodies. `components/sections/competitive-stats.tsx` requests up to 10,000 Codeforces submissions per visitor. It has shared error state that can hide all cards. CodeChef values are hardcoded. The recommended initial replacement is a dated, source-backed snapshot with unknown values shown honestly.

Contact is an HTML `POST` form to FormSubmit, with name, email, subject, message, and `_subject`. It is not a Next server action. Delivery, provider configuration, and authorized end-to-end test handling have not been verified.

`package.json` has Next dev/build/start commands, `next lint --fix`, `npx prettier --write .`, Husky, and lint-staged. It has no dedicated typecheck or test command. It declares Next `^15.3.8`, React `^19.1.2`, Tailwind `^4.1.5`, and TypeScript `^5`. These are manifest ranges, not a current security assessment.

`tsconfig.json` includes the Next plugin and `.next` types, uses root aliases, and targets ES2017. `components.json` has `rsc: true` and points at `app/globals.css`. That stylesheet imports Tailwind, references `tailwind.config.ts`, and contains stale `#__next` styling. Tailwind's plugin uses CommonJS `require`, and `postcss.config.js` uses `module.exports`. ESM conversion must handle both. `.husky/pre-commit` hardcodes npm and Next lint.

## Primary framework and deployment sources

The following pages were reopened on 25 October 2026. Exact package versions remain untested.

- [Cloudflare's TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) documents the direct plugin, the `ssr` Vite environment, the default Start server entry, local preview, and removal of a competing Nitro adapter. Its example explicitly retains `nodejs_compat`.
- [Cloudflare's Vite plugin](https://developers.cloudflare.com/workers/local-development/vite-plugin/) is the local Workers development path. A Node-only dev server is insufficient evidence for the deployed runtime.
- [Workers Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) distinguishes supported APIs from partial implementations and stubs. Current documentation says dates on or after `2026-08-04` enable Node compatibility by default. The retained flag in the framework example is valid but redundant at that date. Recheck behavior with the selected Wrangler version. Node 24 remains the build runtime, not the production runtime.
- [Cloudflare prerender support](https://developers.cloudflare.com/changelog/post/2025-12-19-tanstack-start-prerendering/) and [Start static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) support build-time HTML through the Start plugin. Prerender data must not require live upstream availability.
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) covers the combined static and Worker deployment. Routing and status codes still need local and deployed verification.
- [Worker Previews](https://developers.cloudflare.com/workers/previews/) and [Preview setup](https://developers.cloudflare.com/workers/previews/get-started/) describe preview deployments before production. The current setup page requires project-local Wrangler 4.135.0 or later and documents `wrangler preview`, a `previews` configuration block, a stable Preview URL, and a Unique Deployment URL. This must be validated with the selected toolchain.
- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) requires an active Cloudflare zone. Adding a domain changes DNS and can conflict with an existing CNAME. Registrar choice is separate. Spaceship can remain registrar. Neither current zone state nor Vercel/domain configuration was inspected.
- [Start migration from Next](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js) describes translating framework boundaries while preserving behavior. Next conventions do not transfer automatically.
- [Start from scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) documents route and router setup, ESM, and React plugin order. Prefer ordinary Start routes for this site rather than experimental RSC features.

## Primary toolchain sources

- [Vite+ creation](https://viteplus.dev/guide/create) supports standalone projects and framework templates. Do not scaffold over PORTICO. The compatibility proof is a small future experiment, not permission to replace repository history.
- [Vite+ migration rules](https://viteplus.dev/guide/migrate-rules) require review of rewritten manifests, imports, configuration, and lockfiles. Existing Vite/Vitest projects need their documented prerequisites. PORTICO currently uses Next, so automatic migration alone cannot perform this framework conversion.
- [Vite+ package management](https://viteplus.dev/guide/package-management) selects the package manager from project declarations and lockfiles. Use exact `packageManager: pnpm@...` and one `pnpm-lock.yaml`.
- [Vite+ local CLI](https://viteplus.dev/guide/local-cli) requires aligned Vite core aliases and the bundled Vitest version for manual installation. The guide specifically records separate Vite copies causing Start 404s. Preserve framework plugin import identities while importing `defineConfig` from `vite-plus`.
- [Vite+ check](https://viteplus.dev/guide/check) requires both `lint.options.typeAware` and `typeCheck` for type checks. Retain `tsc --noEmit` initially to compare diagnostics.
- [Vite+ tests](https://viteplus.dev/guide/test) currently documents Node `^22.18.0 || ^24.11.0 || >=26.0.0`. The chosen Node 24 line must be at least 24.11.0. Pin one current security-patched, tested 24.x patch in development and CI.
- [Vite+ CI](https://viteplus.dev/guide/ci) says to pin an exact setup-vp release or commit SHA. Its old `v1` tag no longer receives updates. Setup installs dependencies by default. Disable that installation if an explicit frozen-install step follows, to avoid installing twice.
- [Vite+ environment management](https://viteplus.dev/guide/env) separates runtime and package-manager selection. A configuration-only `pnpm-workspace.yaml` can hold Vite+ aliases without making the app a monorepo.

## Portfolio references and transferable patterns

- [Anthony Fu's projects content](https://github.com/antfu/antfu.me/blob/main/pages/projects.md) separates categorized, Git-managed content from rendering. Adopt that separation and a current-focus selection.
- [Brittany Chiang v4 featured work](https://github.com/bchiang7/v4/blob/main/src/components/sections/featured.js) curates work, prepares responsive images, and respects reduced motion. This is an older Gatsby version, not a proposed technology stack.
- [Shu Ding's site](https://github.com/shuding/shud.in) and [MDX components](https://github.com/shuding/shud.in/blob/main/mdx-components.tsx) illustrate reusable technical-writing layouts. Its Next-specific implementation is not directly portable. MDX is optional only when actual writing exists.

These examples inform typed content, curated case studies, and build-time media. They do not justify a CMS, guestbook, live counters, or a claim that every reference is actively maintained.

## Requested skills and scope

All seven exact Mac skill paths were readable under `/Users/avinashchangrani/personal/dotfiles/skills/`:

- `writing-plans/SKILL.md`
- `technical-writing/SKILL.md`
- `documentation-writer/SKILL.md`
- `using-superpowers/SKILL.md`
- `cloudflare/SKILL.md`
- `tanstack-start/SKILL.md`, named `tanstack-start-best-practices`
- `vite/SKILL.md`

Additional guidance read includes `unslop`, `verification-before-completion`, Fleet's `scoped-github`, TanStack hydration and server-route rules, Vite environment guidance, and Cloudflare Workers/Static Assets references. Current primary documentation takes precedence over stale reference examples.

The plan is a how-to for a skilled engineer who lacks repository context. This file is its evidence reference. The user supplied the scope and requested the complete document, so no extra outline-approval round is introduced. The writing-plans header, exact paths, short steps, dependencies, and expected validation outcomes apply. Its suggested worktree, commits, subagents, and execution handoff do not expand this documentation-only authorization.

Only this research record and the linked plan are task deliverables. No app dependencies, implementation, commit, push, PR mutation, deployment, DNS change, or credential enrollment is authorized or performed by this task.
