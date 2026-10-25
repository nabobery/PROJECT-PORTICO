# Toolchain proof (Gate A)

Recorded 25 October 2026 UTC. The proof ran as an isolated experiment in a scratch directory outside the repository before any application file changed (plan Task 3). The same combination was then carried into the repository unchanged.

## Selected versions

Versions come from npm registry metadata on 25 October 2026, not guessed compatibility.

| Component | Version | Why this version |
| --- | --- | --- |
| Node.js (build, CI) | **24.22.1** "Krypton" LTS | Latest 24.x. Its bundled changelog marks it a security release (2026-10-21; CVE-2026-105481 to 106074 and 111497). Satisfies Vite+'s `^24.11.0`. Pinned in `.node-version`. |
| pnpm | **11.28.8** | Latest pnpm 11 release (2026-10-22). Pinned in `packageManager`. pnpm 12 exists but is not referenced by the Vite+ guides used here. |
| vite-plus | **1.4.0** | Latest (2026-10-23). Bundles Vite 8.3.5, Rolldown 1.2.15, Vitest 5.0.5, Oxlint 1.89.0, oxlint-tsgolint 7.0.2004, Oxfmt 0.74.0. |
| `vite` | `npm:@voidzero-dev/vite-plus-core@1.4.0` | Alias required by the [Vite+ local CLI guide](https://viteplus.dev/guide/local-cli); also enforced by a `pnpm-workspace.yaml` override. |
| `vitest` | 5.0.5 (override only) | Matches `pnpm exec vp toolchain`. Lockfile contains one Vitest. |
| @tanstack/react-start | 1.169.4 | Peer `vite >=8.0.0`. |
| @tanstack/react-router | 1.170.46 | |
| @cloudflare/vite-plugin | 1.65.0 | Peer `vite ^6.1 \|\| ^7 \|\| ^8`, `wrangler ^4.152.0`. |
| wrangler | 4.152.0 | Meets the Worker Previews minimum of 4.135.0 noted in the research record. |
| @vitejs/plugin-react | 6.1.2 | Peer `vite ^8.0.0`. |
| react, react-dom | 19.3.1 | Main locked 19.2.3. |
| typescript | 7.0.2 | Provides `tsc`; `tsc --noEmit` is retained alongside `vp check`. |
| tailwindcss, @tailwindcss/vite | 4.3.3 | Main locked 4.1.5 with PostCSS; the Vite integration replaces PostCSS and autoprefixer. |
| @playwright/test | 1.64.1 | |
| sharp | 0.35.5 | Build-time image derivatives only (`pnpm images`). The build itself does not run it. |

Other runtime libraries (Radix, framer-motion 12.9.2, next-themes 0.4.6, typed.js, react-icons) keep the versions locked on main. `pnpm import` converted `package-lock.json` once; `pnpm install` then added the new packages.

## Commands and results

Run from the experiment directory with Node 24.22.1 and pnpm 11.28.8 on `PATH`. The VM's global Node 22.22.0 was not replaced; Node 24 came from the official `node-linux-x64@24.22.1` npm package because `nodejs.org` is blocked here.

| Check | Command | Result |
| --- | --- | --- |
| Toolchain | `pnpm exec vp toolchain` | Exit 0. One Vite core and Vitest 5.0.5. |
| Build with prerender | `pnpm build` (`vp build`) | Exit 0. Client and server bundles in `dist/client`, `dist/server`; `[prerender] - /`. |
| Preview in workerd | `pnpm exec vp preview --host 127.0.0.1 --port 4173` | `/` 200 from Static Assets (`cf-cache-status: HIT`); `/definitely-missing` **404**; `/api/ping` server route 200 JSON. |
| Hydration | Chromium click test | Button state updated after hydration; no console errors. |
| Component HMR | Edit `src/routes/index.tsx` under `vp dev` | `(client) hmr update`; new text shown and component state kept. |
| Server-route edit | Edit `src/routes/api/ping.ts` under `vp dev` | `(ssr) hmr update virtual:cloudflare/worker-entry`; next request returned the new body. |
| Dev 404 | `vp dev`, request a missing path | 404. |
| Static checks | `pnpm exec vp check` | Exit 0 once formatted. A deliberate `string` to `number` assignment failed with `typescript(TS2322)`, proving `typeAware` plus `typeCheck` run. |
| Type check | `pnpm exec tsc --noEmit` | Exit 0; reported the same TS2322 on the deliberate error. |
| Unit tests | `pnpm exec vp test run` | Exit 0 after the fix below. |

## Compatibility findings and adaptations

- **Vitest loads `vite.config.ts`, and the Cloudflare plugin then starts a Worker runtime.** `vp test` failed at startup (`ReferenceError: module is not defined`). The configuration adds the Cloudflare and Start plugins only when `process.env.VITEST` is not `'true'`. Unit tests run in Node with the React plugin only.
- **pnpm 11 blocks dependency install scripts by default.** `esbuild`, `workerd`, and `sharp` are approved explicitly under `allowBuilds` in `pnpm-workspace.yaml`. Everything else stays blocked.
- **Formatter parity.** Oxfmt needs `printWidth: 80`, `tabWidth: 4`, `semi: false`, `singleQuote: true`, and `trailingComma: 'es5'` to match the former `.prettierrc.json`. Four untouched UI files still differ in how a multi-line `interface ... extends` is wrapped; that reformat is a separate formatting-only commit.
- **Miniflare logs `Unable to fetch the Request.cf object!`** because this environment blocks Cloudflare's metadata endpoint. It falls back to a placeholder and does not affect the build or tests.
- **Wrangler entry.** The repository uses a small custom entry, `src/server.ts`, that wraps `@tanstack/react-start/server-entry` to add `X-Robots-Tag` on preview builds. Static Assets serve prerendered HTML without the Worker, so preview headers for those responses come from a generated `public/_headers`.
- **Compatibility flag.** `compatibility_date` is the tested `2026-10-25`. `nodejs_compat` is kept explicitly, as in Cloudflare's TanStack Start guide; at this date it is also the default. Production runs in workerd, not Node 24.
- **Nitro, Pages, and a Node server were not used.** The direct `@cloudflare/vite-plugin` path worked as documented.

## Sources reopened

- Cloudflare, [TanStack Start on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) (updated 13 October 2026): plugin order, `ssr` environment, Wrangler seed, prerendering.
- TanStack, [Build from scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) and [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).
- Vite+, [Project-local CLI](https://viteplus.dev/guide/local-cli), [Check](https://viteplus.dev/guide/check), and [CI](https://viteplus.dev/guide/ci).
- `voidzero-dev/setup-vp` `action.yml` at v1.22.0 (`cab1ab9e`): `node-version-file`, `cache`, `run-install` inputs.
