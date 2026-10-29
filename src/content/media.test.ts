import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vite-plus/test'
import generated from './media.generated.json'
import { buildMediaIndex, getMedia, srcSet } from './media.ts'
import { MEDIA_SOURCES } from './media-sources.ts'

describe('prepared media', () => {
    test('every source has dimensions, alt text, and both formats', () => {
        for (const source of MEDIA_SOURCES) {
            const media = getMedia(source.id)
            expect(media.width, source.id).toBeGreaterThan(0)
            expect(media.height, source.id).toBeGreaterThan(0)
            expect(media.alt.trim().length, source.id).toBeGreaterThan(5)
            expect(media.avif.length, source.id).toBeGreaterThan(0)
            expect(media.webp.length).toBe(media.avif.length)
        }
    })

    test('every derivative file exists and keeps the source aspect ratio', () => {
        for (const source of MEDIA_SOURCES) {
            const media = getMedia(source.id)
            for (const variant of [...media.avif, ...media.webp]) {
                expect(
                    existsSync(path.join('public', variant.path)),
                    variant.path
                ).toBe(true)
                expect(variant.width).toBeLessThanOrEqual(media.width)
                const ratio = media.width / media.height
                expect(
                    Math.abs(variant.width / variant.height - ratio)
                ).toBeLessThan(0.02)
            }
        }
    })

    test('original public paths are preserved', () => {
        for (const source of MEDIA_SOURCES) {
            expect(existsSync(path.join('public', source.source))).toBe(true)
        }
    })

    test('alt text never repeats the bare project title as the description', () => {
        // The Next version used the title as alt text; descriptions say what is shown.
        expect(getMedia('athena').alt).not.toBe('Athena')
    })

    test('srcSet lists each width descriptor', () => {
        expect(
            srcSet([
                { width: 480, height: 270, path: '/a-480.webp' },
                { width: 768, height: 432, path: '/a-768.webp' },
            ])
        ).toBe('/a-480.webp 480w, /a-768.webp 768w')
    })

    test('a source missing from the manifest fails loudly', () => {
        expect(() =>
            buildMediaIndex(
                [
                    {
                        id: 'missing',
                        source: '/missing.png',
                        alt: 'Test-only missing media',
                        widths: [480],
                    },
                ],
                generated
            )
        ).toThrow(/pnpm images/)
    })

    test('unknown media ids are rejected', () => {
        expect(() => getMedia('no-such-media')).toThrow(/Unknown media id/)
    })
})
