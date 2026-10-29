import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
    return createRouter({
        routeTree,
        // Hash links on the single page rely on the browser's native scrolling.
        scrollRestoration: true,
        defaultPreload: false,
    })
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}
