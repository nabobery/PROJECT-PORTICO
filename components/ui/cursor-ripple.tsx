'use client'

import { useEffect, useCallback } from 'react'

// Define the type for the event parameter
type MouseMoveEvent = globalThis.MouseEvent

export function CursorRipple() {
    const createRipple = useCallback((event: MouseMoveEvent) => {
        const ripple = document.createElement('span')
        const size = 20 // Diameter of the ripple

        ripple.classList.add('ripple') // Use the class from globals.css
        ripple.style.position = 'fixed' // Position relative to viewport
        ripple.style.zIndex = '9999' // Ensure it's on top
        ripple.style.left = `${event.clientX - size / 2}px` // Center on cursor
        ripple.style.top = `${event.clientY - size / 2}px` // Center on cursor
        ripple.style.width = `${size}px`
        ripple.style.height = `${size}px`
        ripple.style.pointerEvents = 'none' // Prevent interference with clicks

        // Overwrite background defined in CSS if needed, or ensure --primary-rgb is set
        // ripple.style.backgroundColor = "rgba(var(--primary-rgb), 0.3)";

        document.body.appendChild(ripple)

        // Remove the ripple element after the CSS animation completes (0.6s)
        setTimeout(() => {
            ripple.remove()
        }, 600) // Match the duration in @keyframes ripple
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', createRipple)

        return () => {
            window.removeEventListener('mousemove', createRipple)
        }
    }, [createRipple])

    // This component doesn't render anything itself
    return null
}
