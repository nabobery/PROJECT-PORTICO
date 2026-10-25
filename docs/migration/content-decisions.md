# PORTICO content decisions and PR provenance

Plan Task 2. Recorded 25 October 2026 UTC. The port publishes only copy that is already live on `main` (`58f8827`). Everything below that changes what a visitor reads waits for Avinash's confirmation. Technical work does not depend on these answers.

## Decisions needed from Avinash

1. **Current role and employment dates.** Main still says "SDE I, Binocs.co, Jun 2024 - Present". PR 12 says Binocs ended Aug 2025 and adds "Software Engineer, OnArrival, Aug 2025 – Present". The live copy is kept until you confirm the dates and title. This is the most visible stale fact on the site.
2. **Quantified claims.** PR 12 adds about 15% booking-conversion uplift, about 25% faster B2B integration, sub-millisecond authorization, about 40% less analyst research time, 7x faster API responses, and "days to hours" memo generation. Main already publishes "80%" (KLA logging) and "mAP of 55.5" (pedestrian detection) and "3.67689" (Project WAR). Confirm each figure and whether it may be published, or tell us to drop or reword it.
3. **Years of experience and positioning.** PR 12's hero says "~2 years of experience" and repositions the title, description, and hero roles toward "Backend & AI Engineer | Search, MCP, Kotlin". Confirm the wording before it replaces the current copy and metadata.
4. **Project selection.** PR 12 replaces seven projects with Veo3 Workflow Agents, LyriFind, SignalPR, and fm-code. Choose the published set and whether any project is featured. All records currently have `featured: false`.
5. **Screenshots for new projects.** Each PR 12 project below points at another project's screenshot. Supply the correct image for each one you keep, or approve a text-only card (`imageId: null` is supported and tested).
6. **Redirect URL extension (PR 9).** Featured, archived, or omitted? Its `redirect-url-extension.png` does not exist in the PR. It needs a real screenshot or a text-only card.
7. **Competitive stats.** The default is now a dated snapshot. LeetCode and Codeforces show "Not available" because no authorized observation exists yet. CodeChef (96) and CSES (186 submissions) are the values hard-coded on main, labelled "Recorded May 8, 2025" from commit `26ea7e3`. Confirm current values with dates, or keep this state. A live service remains optional future scope (plan Task 9).
8. **Typography.** Headings were designed for Space Grotesk but have rendered in `system-ui` in production, because the CSS names `'Space Grotesk'` while `next/font` registered a generated family name. The port keeps today's rendering and stops downloading the unused faces. Loading Space Grotesk for headings would be a visible change; decide separately.
9. **Canonical origin at cutover.** Canonical, Open Graph, sitemap, and JSON-LD use `https://avinashchangrani.vercel.app` (one constant in `src/lib/site.ts`). The planned production origin is `https://nabobery.dev`; it changes only with the approved cutover. Also confirm the apex or `www` policy.
10. **Contact delivery test.** Mocked browser tests prove the form posts the same five fields to the same FormSubmit URL. They do not prove delivery. A real test needs an agreed sender, recipient, and handling.

## PR 12 file-by-file checklist

Head `492ef56bd803a5cf29209b07e72ded664cefb2d9`. Nothing was cherry-picked; each item was ported by hand or deferred.

| File | Change in PR 12 | Disposition in this port |
| --- | --- | --- |
| `app/layout.tsx` | Canonical, Twitter card, JPG OG image, Person JSON-LD, new title and description | **Ported:** canonical, Twitter tags, OG JPG, and Person JSON-LD (with `<` escaped) through `src/lib/site.ts`. **Deferred:** new title and description (decision 3). JSON-LD uses the neutral `jobTitle: "Software Engineer"`. |
| `app/robots.ts`, `app/sitemap.ts` | Next metadata routes | **Ported intent** as `scripts/generate-seo.mjs` from the same `site.ts` source, with a preview variant. No Next APIs retained. |
| `public/og-image.jpg` | 58 KB JPG replacing the 2 MB PNG | **Ported.** Verified 1200 × 630 JPEG. The old `/og-image.png` stays at its public path. |
| `package.json` | Direct `clsx`, `@radix-ui/react-{collapsible,dialog,slot,toggle}` | **Ported** as direct dependencies, resolved to the versions already locked on main. |
| `components/ui/sheet.tsx` | `SheetContentProps` as a type alias with `PropsWithChildren` | **Ported.** |
| `components/ui/animated-text.tsx` | `type: 'spring' as const` | **Ported.** |
| `components/sections/competitive-stats.tsx` | HTTPS CodeChef URL, spinner `repeat: Infinity` | **Ported** the URL. The spinner no longer exists because nothing loads at runtime. |
| `components/sections/about.tsx` | Heading levels h4/h5 to h3/h4; new bio | **Ported** the heading hierarchy. **Deferred** the bio (decisions 1-3). |
| `components/sections/experience.tsx` | OnArrival role, new Binocs bullets and end date, "Elasticsearch" spelling | **Deferred** (decisions 1-2). The one-word spelling fix is deferred with it to keep the experience copy identical to main until reviewed. |
| `components/sections/hero.tsx` | New roles, "~2 years" summary, "View selected work" | **Deferred** (decision 3). |
| `components/sections/contact.tsx` | New heading copy, removed intro paragraph | **Deferred** (decision 3). |
| `components/sections/tech-radar.tsx` | New "Core" category, removed Dart/MATLAB/Flutter/Netlify/Hugo | **Deferred** (decision 3). |
| `components/sections/projects.tsx` | New project set, "More on GitHub" link | **Deferred** (decisions 4-5). |
| `package-lock.json` | Lockfile changes | **Not used.** The port has one `pnpm-lock.yaml` converted from main's lockfile. |

### PR 12 image mismatches

| Project in PR 12 | Image it uses | Required action |
| --- | --- | --- |
| Veo3 Workflow Agents | `go-initializer.png` | Correct screenshot or text-only card |
| LyriFind | `athena.png` | Correct screenshot or text-only card |
| SignalPR | `maaKaVi.png` | Correct screenshot or text-only card |
| fm-code | `attribute-pedestrian-detection.png` | Correct screenshot or text-only card |
| Attribute-Based Pedestrian Detection | `before-you-sign.png` | Restore its own image |

All 12 images on main were viewed and match their projects. Their alt text now describes what each image shows instead of repeating the title (`src/content/media-sources.ts`).

## Other PRs

- **PR 11** (`f2bfa330`, CI actions): superseded by `.github/workflows/ci.yml` in this port, which pins actions by SHA, uses exact Node 24.22.1 and pnpm 11.28.8, a single frozen install, and non-mutating checks. Recommendation: close PR 11 once this PR merges. Not changed here.
- **PR 9** (`52800a28`, redirect extension): a content-selection decision (decision 6). Its manifest also downgrades several dependencies; that part is not used. Not changed here.
- No PR was merged, closed, or modified.

## Content kept unchanged from main

Hero, About, Experience, Projects, Tech Stack, and Contact copy; the 12 projects and their order; categories, including Athena's "Open Source" tag that has no filter tab and the "Mobile" tab with no projects; contact email and location; footer links. These are now typed records in `src/content/projects.ts` and `src/content/experience.ts`, extracted unchanged.
