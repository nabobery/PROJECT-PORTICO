import generated from './media.generated.json'
import { MEDIA_SOURCES, type MediaSource } from './media-sources.ts'

export interface MediaVariant {
    width: number
    height: number
    path: string
}

export interface PreparedMedia {
    id: string
    source: string
    alt: string
    width: number
    height: number
    avif: readonly MediaVariant[]
    webp: readonly MediaVariant[]
}

interface GeneratedEntry {
    source: string
    sha256: string
    width: number
    height: number
    variants: { avif: MediaVariant[]; webp: MediaVariant[] }
}

export function buildMediaIndex(
    sources: readonly MediaSource[],
    manifest: Record<string, GeneratedEntry>
): ReadonlyMap<string, PreparedMedia> {
    const index = new Map<string, PreparedMedia>()
    for (const source of sources) {
        const entry = manifest[source.id]
        if (!entry || entry.source !== source.source) {
            throw new Error(
                `Prepared media for "${source.id}" is missing; run pnpm images`
            )
        }
        index.set(source.id, {
            id: source.id,
            source: source.source,
            alt: source.alt,
            width: entry.width,
            height: entry.height,
            avif: entry.variants.avif,
            webp: entry.variants.webp,
        })
    }
    return index
}

const MEDIA = buildMediaIndex(
    MEDIA_SOURCES,
    generated as Record<string, GeneratedEntry>
)

export function getMedia(id: string): PreparedMedia {
    const media = MEDIA.get(id)
    if (!media) throw new Error(`Unknown media id "${id}"`)
    return media
}

export function hasMedia(id: string): boolean {
    return MEDIA.has(id)
}

export function srcSet(variants: readonly MediaVariant[]): string {
    return variants.map((v) => `${v.path} ${v.width}w`).join(', ')
}
