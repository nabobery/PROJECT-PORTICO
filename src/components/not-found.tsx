import { Button } from '@/components/ui/button'

/** Rendered with HTTP 404 for unknown paths, including missing media files. */
export function NotFound() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
                <p className="text-sm font-medium text-primary">404</p>
                <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    Page not found
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you requested does not exist. The portfolio lives
                    on the homepage.
                </p>
                <Button asChild>
                    <a href="/">Back to the homepage</a>
                </Button>
            </div>
        </section>
    )
}
