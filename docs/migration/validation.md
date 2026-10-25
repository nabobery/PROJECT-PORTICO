# Local validation (Gate B evidence)

Recorded 25 October 2026 UTC on the cloud session container. This is local and CI-equivalent evidence only. No Cloudflare preview or production deployment exists, so every deployed-environment check is **pending**.

## Environment

| Item | Value |
| --- | --- |
| Node | 24.22.1 (from `.node-version`) |
| pnpm | 11.28.8 (from `packageManager`) |
| Browser | Chromium build 1243 (pre-installed), driven by `@playwright/test` 1.64.1 through `PW_CHROMIUM_EXECUTABLE` |
| Server under test | `vp preview --host 127.0.0.1 --port 4173` (workerd through the Cloudflare Vite plugin), started by Playwright's `webServer` |
| Network | Only the npm registry and GitHub are reachable. Google Fonts, nodejs.org, the Vercel site, and nabobery.dev are blocked. |

## CI-equivalent run from a clean clone

`git clone` of the branch at `d32c21c1e9561327d9b3e9daa3ed3e8202023415`, then the steps of `.github/workflows/ci.yml` with `pnpm exec vp ...` in place of the global `vp` CLI (not installed here):

| Step | Command | Exit | Time |
| --- | --- | --- | --- |
| Install | `pnpm install --frozen-lockfile` | 0 | 3 s (warm pnpm store) |
| Toolchain | `pnpm exec vp toolchain` | 0 | 1 s |
| Static checks | `pnpm run check` | 0 (0 errors, 13 warnings) | 9 s |
| Type check | `pnpm run typecheck` | 0 | 2 s |
| Unit tests | `pnpm run test` | 0 (45 tests) | 3 s |
| Preview build | `pnpm run build` | 0 | 7 s |
| Browser tests | `pnpm run test:e2e` | 0 (70 passed, 2 skipped) | 49 s |
| Production build | `PORTICO_DEPLOY_ENV=production pnpm run build` | 0 | 6 s |
| Production metadata | `PORTICO_EXPECT_ENV=production pnpm exec playwright test tests/e2e/metadata.spec.ts --project=desktop-chromium` | 0 | 7 s |
| No mutation | `git diff --exit-code` | 0 | |

One commit followed (`fe83545`, reduced-motion glow fix and its test). On the working tree for that commit: `pnpm check` 0 errors, `pnpm typecheck` 0, `pnpm test` 45 passed, `pnpm test:e2e` 72 passed and 2 skipped. The two skips are by design: the desktop-navigation test is skipped on the mobile project and the mobile-menu test on the desktop project.

The 13 lint warnings are all in files the port did not otherwise change (unused imports in `tech-radar.tsx`, `about.tsx`, `projects.tsx`, `footer.tsx`; unused parameters and floating promises in `animated-text.tsx`, `calendar.tsx`, `chart.tsx`). They are left for a separate cleanup to keep this diff focused.

GitHub Actions has not run the new workflow yet; it runs when the PR opens. Local runs do not prove the hosted runner's `setup-vp` behavior.

## Tests that fail before the fix

- **Browser suite against the Next baseline.** `PORTICO_E2E_BASE_URL=http://127.0.0.1:3100 pnpm exec playwright test --project=desktop-chromium` against `next start` at `58f8827`: 21 failed, 14 passed, 1 skipped. Failing tests: raw HTML content (empty typed span), canonical and social metadata, JSON-LD, OG JPG path, preview `X-Robots-Tag`, robots meta, robots.txt and sitemap, 404 page text and link, owner-only API username, sanitized 503, console errors and live provider requests, back-to-top button, reduced-motion navigation, no-JavaScript content, prepared media and alt text, image failure fallback, broken requests, independent stats cards (two tests), and HTTPS profile links.
- **Unit-test mutations.** Each was reverted after observing the failure: an unknown LeetCode value set to `0` failed "every shipped record is valid"; a duplicated project id failed "ids are unique"; removing `<` escaping from `serializeJsonLd` failed "serialization cannot close the script element".
- **Variant cross-check.** Running the preview-variant metadata tests against a production build failed the three indexing tests, as intended.
- **Reduced-motion glow.** The new timeline test failed on `d32c21c` (box-shadow still changing) and passes on `fe83545`.
- **Image check.** `node scripts/prepare-images.mjs --check` exited 1 before derivatives existed and 0 afterwards.

## Behavior covered

| Area | Evidence |
| --- | --- |
| Raw HTML and metadata | Title, H1 with static "Problem Solver", nav, all seven section IDs, form action, one canonical, description, OG and Twitter tags with absolute 1200 × 630 JPG, icon, parseable Person JSON-LD. No preview or loopback origin in metadata. |
| Indexing | Preview: `noindex, nofollow` meta, `X-Robots-Tag` on prerendered HTML, a static image, a Worker 404, and the Worker API; robots.txt `Disallow: /`; no sitemap. Production: indexable meta, no `X-Robots-Tag`, robots.txt with sitemap, one-URL sitemap without anchors or dates. `/_headers` is not served. |
| HTTP status | `/definitely-missing-portico-page`, `/about`, `/projects/athena`, missing PNG and missing WebP all return 404; the 404 page links home. |
| API | `/api/leetcode-stats` 400 without username, 400 for another user, 503 with `no-store` and no upstream details for the owner (snapshot unknown). |
| Navigation and keyboard | Hash links keep their targets and scroll; hero links; mobile sheet opens with Enter, closes with Escape and returns focus, closes after a link; filter tabs move with arrow keys; back-to-top is a focusable button. |
| Theme | Dark system preference applied before `DOMContentLoaded`; saved light overrides dark system; toggle persists across reload; throwing `localStorage` still renders without page errors. One theme script in the HTML. |
| Reduced motion | Navbar logo and links visible; headline static with no typed cursor; no cursor ripples; timeline glow stops. |
| No JavaScript | Headings visible at opacity 1, full headline, email link, and the form present. |
| Media | `<picture>` with AVIF and WebP `srcset`, intrinsic `width`/`height`, `loading="lazy"`, descriptive alt; an aborted image shows its alt text and other cards stay; no 4xx responses or broken images after scrolling the page. |
| Stats | Four cards render independently; LeetCode and Codeforces say "Not available" (never 0); CodeChef 96 and CSES 186 show "Recorded May 8, 2025"; blocking provider sites changes nothing; profile links are HTTPS; no third-party requests on page load. |
| Contact (FormSubmit intercepted) | POST carries exactly `_subject`, `name`, `email`, `subject`, `message`; a provider 500 is shown as the provider's page; empty and malformed submissions are blocked by browser validation with no request sent. **Real delivery is unverified.** |
| Console | No page errors, console errors, or hydration warnings in production preview. In `vp dev`, no hydration warnings; two dev-only warnings remain (below). |

## Visual comparison

Per-section screenshots of the baseline and the port, desktop and mobile, light and dark, with reduced motion, are in [screenshots/](screenshots/). Layout, spacing, colors, and copy match. Intended differences: the navbar is visible under reduced motion, the stats section shows four dated cards instead of one error line, and project images are served as responsive derivatives. The baseline used system fonts because its build could not download Google Fonts; the port uses the self-hosted Inter for body text, as production Next did.

## Performance comparison

Same machine, same Chromium, loopback, no throttling, LeetCode/Codeforces blocked for both, full page scrolled to load lazy media. LCP and CLS are medians of three runs.

| Metric | Baseline (Next, `next start`) | Port (`vp preview`) |
| --- | --- | --- |
| LCP desktop / mobile | 976 ms / 980 ms | 968 ms / 996 ms |
| CLS desktop / mobile | 0.176 / 0.007 | 0.186 / 0.007 |
| Images transferred, desktop / mobile (DPR 3) | 8,600 KB / 8,600 KB | 140 KB / 415 KB |
| JavaScript, compressed | 231 KB (gzip, as transferred) | 230 KB (gzip of `index` 188 KB + `routes` 42 KB; preview served it uncompressed, 686 KB) |
| CSS, compressed | 13 KB | 13 KB gzip |
| HTML, compressed | 21 KB | 24 KB gzip |
| Fonts | none (blocked in baseline) | 48 KB Inter WOFF2 |

The desktop CLS of about 0.18 appears in both versions under the scripted scroll and was not introduced by the port. Its source was not investigated. These numbers are local measurements to compare against, not targets. The JavaScript bundle triggers Vite's 500 KB chunk warning; code splitting is a possible follow-up.

## Known limitations

- `vp dev` logs "Attempting to mix Motion versions 12.9.1 with 12.9.2": main's locked `framer-motion@12.9.2` depends on `motion-dom@12.9.1`. Pre-existing; not changed.
- `vp dev` logs that the preloaded font was not used within a few seconds; the production preview does not.
- Miniflare logs `Unable to fetch the Request.cf object!` here because Cloudflare's metadata endpoint is blocked.
- No Content-Security-Policy existed before or is added now. If one is added, it needs `form-action https://formsubmit.co`.
- Contrast and touch-target sizes were reviewed visually against the baseline, not measured with a tool.

## Pending (not authorized in this task)

- Cloudflare Worker Preview deployment and the same suite against its URLs (plan Task 14, Gate C).
- Production deployment, custom domain, DNS, redirects, and rollback rehearsal (plan Task 15, Gate D).
- Real FormSubmit delivery test.
- Content confirmation (Gate B's last item): see [content-decisions.md](content-decisions.md).

Gate B status: every technical item is met locally; "all published experience claims and project screenshots are confirmed" remains open until Avinash confirms the copy that main already publishes.
