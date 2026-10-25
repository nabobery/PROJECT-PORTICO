# Rolling back the Cloudflare migration

**Status: prepared for review, not executed.** Gate D (production verified, rollback demonstrably available) is pending.

## Before DNS changes

Vercel is still production. A failed Cloudflare preview needs no rollback: leave Vercel and DNS as they are, fix the branch, and publish a new preview after approval. Reverting this PR on `main` restores the Next app; the Vercel project still builds it.

## After a cutover

Before the cutover, capture without copying credentials:

- the current Vercel production deployment URL and ID, and the project's domain settings;
- every DNS record for the apex, `www`, and mail, with TTLs, and the DNSSEC/DS state.

Rollback triggers: persistent 5xx responses, missing media or routes, a broken contact path, wrong canonical or indexing headers, or a material measured regression against [validation.md](validation.md).

Steps:

1. Restore the captured DNS records (or detach the Workers Custom Domain) so the domain points at Vercel again.
2. Disable any redirects added during cutover that conflict with Vercel.
3. Verify TLS, the homepage, hash anchors, images, downloads, and the contact form path on the restored host.
4. Keep both deployments and the Vercel project until the agreed observation period ends. Do not delete the Vercel project during migration.

A Worker version rollback (`wrangler rollback`) restores a previous Cloudflare version but does not reverse DNS or canonical changes.
