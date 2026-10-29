import { createHash } from 'node:crypto'
import {
    copyFileSync,
    mkdirSync,
    mkdtempSync,
    rmSync,
    writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, expect, test } from 'vite-plus/test'

const fixtures: string[] = []

afterEach(() => {
    for (const root of fixtures.splice(0))
        rmSync(root, { recursive: true, force: true })
})

function fixture(widths: number[], manifestWidths = [480, 768, 800]) {
    const root = mkdtempSync(path.join(tmpdir(), 'portico-images-'))
    fixtures.push(root)
    for (const dir of ['scripts', 'src/content', 'public'])
        mkdirSync(path.join(root, dir), { recursive: true })
    copyFileSync(
        new URL('./prepare-images.mjs', import.meta.url),
        path.join(root, 'scripts/prepare-images.mjs')
    )
    writeFileSync(
        path.join(root, 'src/content/media-sources.ts'),
        `export const MEDIA_SOURCES = ${JSON.stringify([{ id: 'fixture', source: '/source.png', widths }])}`
    )
    // --check validates source hashes and manifest/files, without decoding images.
    const source = 'test-only source bytes'
    writeFileSync(path.join(root, 'public/source.png'), source)
    const variants = { avif: [], webp: [] } as Record<
        string,
        Array<{ width: number; height: number; path: string }>
    >
    for (const format of ['avif', 'webp']) {
        variants[format] = manifestWidths.map((width) => {
            const publicPath = `/fixture-${width}.${format}`
            writeFileSync(path.join(root, 'public', publicPath), '')
            return { width, height: width / 2, path: publicPath }
        })
    }
    writeFileSync(
        path.join(root, 'src/content/media.generated.json'),
        JSON.stringify({
            fixture: {
                source: '/source.png',
                sha256: createHash('sha256').update(source).digest('hex'),
                width: 800,
                height: 400,
                variants,
            },
        })
    )
    return root
}

function check(root: string) {
    return spawnSync(
        process.execPath,
        [path.join(root, 'scripts/prepare-images.mjs'), '--check'],
        { cwd: root, encoding: 'utf8' }
    )
}

test('image check accepts capped, deduplicated widths', () => {
    expect(check(fixture([480, 768, 1200, 1600])).status).toBe(0)
})

test('image check rejects changed configured widths despite matching source hashes', () => {
    const result = check(fixture([480, 640, 1200]))
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/widths/)
})

test('image check rejects a format with no derivatives', () => {
    const result = check(fixture([480, 768, 1200], []))
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/widths/)
})
