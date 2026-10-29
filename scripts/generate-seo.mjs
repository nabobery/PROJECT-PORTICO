#!/usr/bin/env node
// Writes public/robots.txt, public/sitemap.xml, and public/_headers from
// src/lib/site.ts for the deploy environment in PORTICO_DEPLOY_ENV
// ("production" or "preview"; unset means preview). The files are build
// outputs and are git-ignored.
import { rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    resolveDeployEnv,
    robotsTxt,
    sitemapXml,
    staticHeaders,
} from '../src/lib/site.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const env = resolveDeployEnv(process.env.PORTICO_DEPLOY_ENV)
const files = {
    'robots.txt': robotsTxt(env),
    _headers: staticHeaders(env),
}
// Preview builds publish no sitemap: nothing on a preview host is meant to be indexed.
if (env === 'production') files['sitemap.xml'] = sitemapXml()

for (const [name, content] of Object.entries(files)) {
    await writeFile(path.join(root, 'public', name), content)
}
if (env === 'preview') {
    await rm(path.join(root, 'public', 'sitemap.xml'), { force: true })
}
console.log(`SEO files written for ${env}: ${Object.keys(files).join(', ')}`)
