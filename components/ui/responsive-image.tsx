import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getMedia, srcSet } from '@/src/content/media'

interface ResponsiveImageProps {
    mediaId: string
    /** The `sizes` attribute describing the rendered width at each breakpoint. */
    sizes: string
    className?: string
    pictureClassName?: string
    /** Only for a measured above-the-fold image; everything else lazy-loads. */
    priority?: boolean
    /** Overrides the default alt text from src/content/media-sources.ts. */
    alt?: string
}

/**
 * Replaces next/image with a static <picture>: AVIF and WebP derivatives,
 * intrinsic dimensions to reserve layout space, and lazy loading by default.
 * A failed load hides the broken image and leaves its alt text readable.
 */
export function ResponsiveImage({
    mediaId,
    sizes,
    className,
    pictureClassName,
    priority = false,
    alt,
}: ResponsiveImageProps) {
    const media = getMedia(mediaId)
    const [failed, setFailed] = useState(false)
    const fallback = media.webp[media.webp.length - 1]

    if (failed) {
        return (
            <span
                role="img"
                aria-label={alt ?? media.alt}
                data-media-failed={media.id}
                className={cn(
                    'flex items-center justify-center bg-muted text-muted-foreground text-sm p-4 text-center',
                    className
                )}
            >
                {alt ?? media.alt}
            </span>
        )
    }

    return (
        <picture className={pictureClassName}>
            <source
                type="image/avif"
                srcSet={srcSet(media.avif)}
                sizes={sizes}
            />
            <source
                type="image/webp"
                srcSet={srcSet(media.webp)}
                sizes={sizes}
            />
            <img
                src={fallback.path}
                alt={alt ?? media.alt}
                width={media.width}
                height={media.height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
                onError={() => setFailed(true)}
                className={className}
            />
        </picture>
    )
}
