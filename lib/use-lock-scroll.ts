import { useEffect } from 'react'

export function useLockScroll(lock: boolean) {
    useEffect(() => {
        if (lock) {
            // Save the current scroll position
            const scrollY = window.scrollY

            // Add styles to prevent scrolling
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.overflowY = 'hidden'

            return () => {
                // Restore scroll position and remove styles
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.style.overflowY = ''
                window.scrollTo(0, scrollY)
            }
        }
    }, [lock])
}
