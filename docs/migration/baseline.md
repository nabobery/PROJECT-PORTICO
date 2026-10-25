# PORTICO baseline before the TanStack Start port

Recorded 25 October 2026 UTC for plan Task 1. It describes `main` at `58f8827934cbc9fefb77d1fb7e43bbdfb73a3df7`, the Next.js app that the port replaces.

## Repository state

| Item | Value |
| --- | --- |
| Remote | `https://github.com/nabobery/PROJECT-PORTICO` |
| Working branch | `feat/portico-tanstack-cloudflare`, started at `66639bc2be41c7351b8c93ca5714a06bf09aa9fa` (main plus the two plan documents) |
| Working tree at start | Clean. No other task owned changes. |
| Checkout | Cloud session container, `/home/user/PROJECT-PORTICO`. This differs from the research record's VM checkout; the repository identity and SHAs match. |

Main and PR heads were refreshed through the GitHub API at the start of this work. They are unchanged from the research record:

| Ref | Head | State |
| --- | --- | --- |
| `main` | `58f8827934cbc9fefb77d1fb7e43bbdfb73a3df7` | |
| PR 12 `presence-audit-updates` | `492ef56bd803a5cf29209b07e72ded664cefb2d9` | Open |
| PR 11 `chore/bump-actions-node24` | `f2bfa330f88f9bb90408ac84210fd2d6339e8efb` | Open |
| PR 9 `chore/update-projects-experience` | `52800a2837d88a9ab42cc6f7dd8c7f1b95206488` | Open draft |

## How the baseline was observed

The deployed site (`avinashchangrani.vercel.app`) and `nabobery.dev` are blocked by this environment's network policy, so the baseline comes from a local production build of `58f8827` in a separate scratch worktree.

1. `npm ci` (Node 22.22.0, npm 10.9.4) succeeded.
2. `next build` failed. `next/font/google` could not download Inter, Poppins, or Space Grotesk because Google Fonts is blocked. This confirms that the current build depends on a live font service.
3. In the scratch worktree only, the three `next/font/google` calls were replaced with empty class names. With that change `next build` succeeded, and `next start` served the app on `127.0.0.1:3100`. Fonts therefore fell back to local system fonts in the baseline screenshots. Nothing else was changed.
4. `next dev` was also tried. It rendered the page but threw `SyntaxError: Invalid or unexpected token` in the browser and never hydrated, so it was not used.

Screenshots use Chromium (Playwright 1.63 bundled build 1243), reduced motion, and 1440 × 900 desktop or 390 × 844 mobile viewports. LeetCode and Codeforces requests were blocked by the network, as they would be for any visitor whose browser cannot reach them. No contact form was submitted.

Section screenshots are in [screenshots/](screenshots/) as `baseline-<viewport>-<scheme>-<section>.jpg`. The matching `port-*` files come from the new build under the same conditions.

## Behavior inventory

### Sections and anchors

Rendered in this order: `section#home`, `#about`, `#experience`, `#projects`, `#tech-radar`, `#competitive-stats`, `#contact`. Testimonials, Blog, Process, and Achievements exist in `components/sections/` but are commented out of `app/page.tsx`.

Navigation links: `#about`, `#experience`, `#projects`, `#tech-radar`, `#competitive-stats`, `#contact`, plus the `#` logo link and "Get in Touch" (`#contact`). Hero links: `#projects`, `#contact`, `#about` (scroll arrow).

### Public paths

| Path | Status | Notes |
| --- | --- | --- |
| `/` | 200 | Static prerender |
| `/api/leetcode-stats` | 400 without `username` | Proxies any username to LeetCode GraphQL |
| `/robots.txt`, `/sitemap.xml` | 404 | Not present on main |
| `/og-image.png` | 200, 2,043,828 bytes | Actual size 1536 × 1024; metadata claims 1200 × 630 |
| `/portico.png` | 200 | Favicon |
| `/developer-portrait.jpeg` | 200, 133,046 bytes | 687 × 1016 |
| `/images/projects/*.png` | 200 | 12 project images, listed below |
| `/next.svg`, `/vercel.svg` | 200 | Unreferenced Next starter files |
| Unknown path | 404 | Next not-found page |

Project images and natural sizes: go-initializer 1837 × 956, athena 1502 × 868, maaKaVi 2880 × 1528, attribute-pedestrian-detection 1102 × 552, before-you-sign 1350 × 647, spotify-downloader 1751 × 731, advent-of-code 1241 × 912, go-backend-journey 1536 × 1024, project-mads 1024 × 1024, exAImination 1697 × 828, maze-solver-using-ai 920 × 885, project-war 1024 × 1024. Each image was viewed and matches its project on main. Alt text was the project title.

### External links

GitHub repositories and live demos for the 12 projects, `https://github.com/nabobery/`, `https://linkedin.com/in/avinash-changrani`, `https://nabobery.github.io/`, `mailto:avinashchangrani99@gmail.com`, and the four competitive-programming profiles (the CodeChef link used `http://codechef.com/...`).

### Contact form

`POST https://formsubmit.co/avinashchangrani99@gmail.com` with fields `_subject` (hidden, `New Contact Form Submission from Portfolio!`), `name` (required), `email` (required, `type=email`), `subject` (required), `message` (required). Success and failure pages are FormSubmit's own. Delivery and provider configuration have not been verified.

### Metadata (raw HTML)

Title `Avinash Changrani | AI & Full-Stack Developer Portfolio (PORTICO)`, description, author, keywords, `robots` and `googlebot` index/follow, Open Graph and Twitter tags pointing at `https://avinashchangrani.vercel.app/og-image.png`, icon `/portico.png`. No canonical link, no JSON-LD, no robots.txt or sitemap.

### Observed defects carried into the port as fixes

- **Reduced motion hides navigation.** With `prefers-reduced-motion: reduce`, the navbar logo and desktop links stay at `opacity: 0`. The component swaps its animation props after hydration, so the initial hidden state is never animated away (visible in `baseline-desktop-light-home.jpg`).
- **No-JavaScript content is invisible.** Every section's framer-motion wrapper is server-rendered at `opacity: 0`, and the typed role span is empty until Typed.js runs.
- **One provider failure hides all stats.** When LeetCode and Codeforces are unreachable, the section shows only `Error loading stats: LeetCode: API error 500 ... Codeforces: Failed to fetch` and none of the four cards (`baseline-desktop-dark-competitive-stats.jpg`). Each visit requests up to 10,000 Codeforces submissions.
- **The back-to-top control is a `div`** with a click handler and no keyboard access.
- **Fonts.** Headings use `var(--font-heading)` = `'Space Grotesk', system-ui`, but `next/font` registers the face under a generated family name, so headings render in `system-ui` unless the visitor has Space Grotesk installed. `lib/styles.css`, the only user of `--font-space`, is not imported. Poppins is downloaded but never used.

## Baseline automated checks

The new browser suite was run against this baseline server to show which behaviors the port changes (`PORTICO_E2E_BASE_URL=http://127.0.0.1:3100 pnpm exec playwright test --project=desktop-chromium`). Result: 21 failed, 14 passed, 1 skipped. Failures cover the missing canonical, JSON-LD, robots and sitemap, preview indexing headers, the 404 page text, the API contract, live third-party requests and console errors, the reduced-motion and no-JavaScript defects, the non-keyboard back-to-top control, image alt text and prepared media, and the stats behavior. The contact-form, hash-navigation, theme, and filter-keyboard tests passed on both versions. The mobile-menu test is skipped at desktop width. The full failing-test list is in [validation.md](validation.md).

Security status of the Next dependencies was not assessed.
