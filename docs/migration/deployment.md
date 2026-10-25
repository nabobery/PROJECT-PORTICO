# Deploying PORTICO to Cloudflare Workers

**Status: prepared for review, not executed.** No Cloudflare account, credential, Worker, preview, route, custom domain, or DNS record was created or changed. Vercel remains production. Each step marked "approval" needs its own explicit authorization.

## What gets deployed

`pnpm build` produces one artifact:

- `dist/client/`: prerendered `index.html`, hashed JS and CSS, `public/` files, and the generated `_headers`. Workers Static Assets serves these without running the Worker.
- `dist/server/`: the Worker (`src/server.ts` wrapping TanStack Start's server entry) and the generated `dist/server/wrangler.json`. The Worker answers everything that is not a static file: the 404 page, `/api/leetcode-stats`, and any non-prerendered route.

The deploy environment is chosen at build time:

| Variable | Values | Effect |
| --- | --- | --- |
| `PORTICO_DEPLOY_ENV` | `preview` (default when unset), `production` | `preview`: `noindex, nofollow` meta, `X-Robots-Tag` on static and Worker responses, `Disallow: /` robots.txt, no sitemap. `production`: indexable, robots.txt with sitemap, `sitemap.xml`. Any other value fails the build. |

The canonical origin is the constant `PRODUCTION_ORIGIN` in `src/lib/site.ts` (`https://avinashchangrani.vercel.app` today). It is never taken from a request's Host header. Change it to `https://nabobery.dev` in a reviewed commit as part of the cutover.

The Worker needs no bindings, secrets, KV, R2, or D1.

## 1. Verify access (read-only, before any deployment)

1. Confirm the intended Cloudflare account and that scoped credentials already exist for this work. If they do not, stop and ask Avinash to set them up. Do not run `wrangler login` or create tokens as part of this procedure.
2. Confirm the Worker name. `portico` in `wrangler.jsonc` is a proposal and has not been checked for availability.
3. Confirm the project-local Wrangler version supports Worker Previews: `pnpm exec wrangler --version` (4.152.0 is pinned; Cloudflare's preview guide required at least 4.135.0 when last checked) and `pnpm exec wrangler preview --help`.

## 2. Build and check the preview artifact (local, already validated)

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm typecheck && pnpm test
pnpm build                      # preview variant
pnpm test:e2e                   # runs against vp preview on 127.0.0.1:4173
```

Expected: every command exits 0, and `dist/client/_headers` contains `X-Robots-Tag: noindex, nofollow`.

## 3. Publish a Cloudflare preview (approval required)

This publishes a reachable URL. Run it only after approval and after step 1.

```sh
pnpm exec wrangler preview --name portico-migration
```

Before running, re-read Cloudflare's [Worker Previews guide](https://developers.cloudflare.com/workers/previews/get-started/) and inspect `dist/server/wrangler.json`; add a `previews` block to `wrangler.jsonc` only if the pinned version requires it. Record both the stable Preview URL and the Unique Deployment URL.

Then verify that exact deployment:

```sh
PORTICO_E2E_BASE_URL=<preview URL> pnpm test:e2e
curl -sI <preview URL>/ | grep -i x-robots-tag          # noindex, nofollow
curl -sI <preview URL>/og-image.jpg | grep -i x-robots-tag
curl -s -o /dev/null -w '%{http_code}\n' <preview URL>/definitely-missing   # 404
```

The contact tests intercept FormSubmit and send nothing. Do not submit the real form without an agreed test sender and recipient.

Record the deployment identity, source SHA, build variant, and test results in `docs/migration/validation.md`. This is Gate C.

## 4. Production cutover (separate approval, not prepared as code)

Prerequisites: Gate C passed, content decisions resolved, and a read-only review of the current DNS zone, nameservers, apex and `www` records, mail records, DNSSEC, Vercel domains, and redirects. None of these were inspected.

Intended order after approval:

1. Change `PRODUCTION_ORIGIN` to the approved origin in a reviewed commit.
2. `pnpm build:production`, then run `PORTICO_EXPECT_ENV=production pnpm test:e2e` locally.
3. `pnpm exec wrangler deploy` for the tested artifact.
4. Attach the approved Workers Custom Domain. This changes DNS and can conflict with an existing CNAME; Spaceship stays the registrar.
5. Verify TLS, homepage, anchors, assets, metadata, robots.txt, sitemap, and the contact form path.
6. Enable reviewed redirects from old hosts. Hash fragments stay in the browser, so section IDs are kept in the markup.

Record each operation before starting the next. Rollback is in [rollback.md](rollback.md).
