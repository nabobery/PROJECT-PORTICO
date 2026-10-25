#!/usr/bin/env node
// Prepares responsive AVIF/WebP derivatives for src/content/media-sources.ts.
//
//   node scripts/prepare-images.mjs          regenerate derivatives and manifest
//   node scripts/prepare-images.mjs --check  verify without writing (used by build)
//
// --check needs no image library: it compares source hashes and derivative
// files against src/content/media.generated.json, so builds never transform
// images and never call a remote image service.
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MEDIA_SOURCES } from '../src/content/media-sources.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const outDir = path.join(publicDir, 'images', 'generated')
const manifestPath = path.join(root, 'src', 'content', 'media.generated.json')
const FORMATS = /** @type {const} */ (['avif', 'webp'])
const QUALITY = { avif: 55, webp: 78 }

const check = process.argv.includes('--check')

async function sha256(file) {
    return createHash('sha256')
        .update(await readFile(file))
        .digest('hex')
}

async function readManifest() {
    if (!existsSync(manifestPath)) return null
    return JSON.parse(await readFile(manifestPath, 'utf8'))
}

async function runCheck() {
    const manifest = await readManifest()
    const problems = []
    if (!manifest) problems.push(`missing ${path.relative(root, manifestPath)}`)
    for (const media of MEDIA_SOURCES) {
        const entry = manifest?.[media.id]
        const sourceFile = path.join(publicDir, media.source)
        if (!existsSync(sourceFile)) {
            problems.push(`${media.id}: source ${media.source} is missing`)
            continue
        }
        if (!entry) {
            problems.push(`${media.id}: not in manifest`)
            continue
        }
        if (entry.sha256 !== (await sha256(sourceFile))) {
            problems.push(
                `${media.id}: source changed since derivatives were made`
            )
        }
        for (const format of FORMATS) {
            for (const variant of entry.variants[format] ?? []) {
                if (!existsSync(path.join(publicDir, variant.path))) {
                    problems.push(`${media.id}: ${variant.path} is missing`)
                }
            }
        }
    }
    if (problems.length > 0) {
        console.error('Prepared images are out of date. Run `pnpm images`.')
        for (const problem of problems) console.error(`  - ${problem}`)
        process.exit(1)
    }
    console.log(`Prepared images verified for ${MEDIA_SOURCES.length} sources.`)
}

async function runGenerate() {
    const { default: sharp } = await import('sharp')
    await mkdir(outDir, { recursive: true })
    const manifest = {}
    for (const media of MEDIA_SOURCES) {
        const sourceFile = path.join(publicDir, media.source)
        const meta = await sharp(sourceFile).metadata()
        const widths = [
            ...new Set(media.widths.map((w) => Math.min(w, meta.width))),
        ].sort((a, b) => a - b)
        const variants = { avif: [], webp: [] }
        for (const width of widths) {
            const height = Math.round((meta.height * width) / meta.width)
            for (const format of FORMATS) {
                const rel = `/images/generated/${media.id}-${width}.${format}`
                await sharp(sourceFile)
                    .resize({ width })
                    [format]({ quality: QUALITY[format], effort: 5 })
                    .toFile(path.join(publicDir, rel))
                variants[format].push({ width, height, path: rel })
            }
        }
        manifest[media.id] = {
            source: media.source,
            sha256: await sha256(sourceFile),
            width: meta.width,
            height: meta.height,
            variants,
        }
        console.log(`${media.id}: ${widths.join(', ')}`)
    }
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`)
    console.log(`Wrote ${path.relative(root, manifestPath)}`)
}

await (check ? runCheck() : runGenerate())
