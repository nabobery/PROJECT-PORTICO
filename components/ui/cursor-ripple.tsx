'use client'

import { useEffect } from 'react'

// Minimum time between ripples. mousemove fires far more often than the
// 600 ms animation, so unthrottled ripples pile up DOM nodes.
const MIN_INTERVAL_MS = 40
const SIZE = 20 // Diameter of the ripple

/**
 * Decorative ripple trail behind a fine pointer. It is skipped for touch and
 * other coarse pointers and when the user prefers reduced motion.
 */
export function CursorRipple() {
    useEffect(() => {
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
        let last = 0
        const timers = new Set<number>()

        const createRipple = (event: MouseEvent) => {
            if (!fine.matches || reduce.matches) return
            const now = performance.now()
            if (now - last < MIN_INTERVAL_MS) return
            last = now

            const ripple = document.createElement('span')
            ripple.classList.add('ripple') // Use the class from globals.css
            ripple.setAttribute('aria-hidden', 'true')
            ripple.style.position = 'fixed' // Position relative to viewport
            ripple.style.zIndex = '9999' // Ensure it's on top
            ripple.style.left = `${event.clientX - SIZE / 2}px` // Center on cursor
            ripple.style.top = `${event.clientY - SIZE / 2}px` // Center on cursor
            ripple.style.width = `${SIZE}px`
            ripple.style.height = `${SIZE}px`
            ripple.style.pointerEvents = 'none' // Prevent interference with clicks
            document.body.appendChild(ripple)

            // Remove the ripple element after the CSS animation completes (0.6s)
            const timer = window.setTimeout(() => {
                ripple.remove()
                timers.delete(timer)
            }, 600)
            timers.add(timer)
        }

        window.addEventListener('mousemove', createRipple, { passive: true })
        return () => {
            window.removeEventListener('mousemove', createRipple)
            for (const timer of timers) window.clearTimeout(timer)
            document
                .querySelectorAll('body > .ripple')
                .forEach((node) => node.remove())
        }
    }, [])

    // This component doesn't render anything itself
    return null
}
