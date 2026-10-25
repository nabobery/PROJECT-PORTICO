/**
 * Source media and the responsive widths prepared from each one.
 *
 * `pnpm images` (scripts/prepare-images.mjs) reads this list, writes AVIF/WebP
 * derivatives to public/images/generated/, and records dimensions and source
 * hashes in media.generated.json. Original files stay at their public paths.
 */
export interface MediaSource {
    id: string
    /** Public path of the original file. */
    source: string
    /** Accurate description of what the image shows. */
    alt: string
    /** Target derivative widths in CSS pixels times DPR; capped at the source width. */
    widths: readonly number[]
}

const CARD_WIDTHS = [480, 768, 1200] as const

export const MEDIA_SOURCES: readonly MediaSource[] = [
    {
        id: 'developer-portrait',
        source: '/developer-portrait.jpeg',
        alt: 'Developer portrait',
        widths: [384, 768],
    },
    {
        id: 'go-initializer',
        source: '/images/projects/go-initializer.png',
        alt: 'Screenshot of the go-initializer project generator form',
        widths: CARD_WIDTHS,
    },
    {
        id: 'athena',
        source: '/images/projects/athena.png',
        alt: "Screenshot of Athena's neural network builder beside generated Keras code",
        widths: CARD_WIDTHS,
    },
    {
        id: 'maakavi',
        source: '/images/projects/maaKaVi.png',
        alt: 'Screenshot of a maaKaVi lesson next to its code editor',
        widths: CARD_WIDTHS,
    },
    {
        id: 'attribute-pedestrian-detection',
        source: '/images/projects/attribute-pedestrian-detection.png',
        alt: 'Street video frame with pedestrians boxed and labeled by detected attributes',
        widths: CARD_WIDTHS,
    },
    {
        id: 'before-you-sign',
        source: '/images/projects/before-you-sign.png',
        alt: 'Screenshot of the Before You Sign side panel open beside a Dropbox Sign document',
        widths: CARD_WIDTHS,
    },
    {
        id: 'spotify-downloader',
        source: '/images/projects/spotify-downloader.png',
        alt: 'Screenshot of the Spotify Playlist Analyzer playlist grid',
        widths: CARD_WIDTHS,
    },
    {
        id: 'advent-of-code',
        source: '/images/projects/advent-of-code.png',
        alt: 'Advent of Code ASCII-art calendar with completed stars',
        widths: CARD_WIDTHS,
    },
    {
        id: 'go-backend-journey',
        source: '/images/projects/go-backend-journey.png',
        alt: 'Illustration listing the Go backend projects and the libraries they use',
        widths: CARD_WIDTHS,
    },
    {
        id: 'project-mads',
        source: '/images/projects/project-mads.png',
        alt: 'PROJECT MADS cover illustration for algorithms and data structures practice',
        widths: CARD_WIDTHS,
    },
    {
        id: 'exaimination',
        source: '/images/projects/exAImination.png',
        alt: 'Screenshot of the exAImination start screen for generating mock tests',
        widths: CARD_WIDTHS,
    },
    {
        id: 'maze-solver-using-ai',
        source: '/images/projects/maze-solver-using-ai.png',
        alt: 'Maze solver window showing the path found through a grid maze',
        widths: CARD_WIDTHS,
    },
    {
        id: 'project-war',
        source: '/images/projects/project-war.png',
        alt: 'PROJECT WAR illustration of a Wordle solver board',
        widths: CARD_WIDTHS,
    },
]
