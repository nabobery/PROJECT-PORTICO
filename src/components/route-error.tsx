import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

/** Generic failure UI. Error details stay in the console, not in the page. */
export function RouteError({ error }: ErrorComponentProps) {
    if (typeof console !== 'undefined') console.error(error)
    return (
        <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    Something went wrong
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This page failed to load. Please try again.
                </p>
                <Button asChild>
                    <a href="/">Back to the homepage</a>
                </Button>
            </div>
        </section>
    )
}
