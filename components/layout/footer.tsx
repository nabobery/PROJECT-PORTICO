import Link from 'next/link'
import {
    FaCode,
    FaGithub,
    FaLinkedinIn,
    FaEnvelope,
    FaRss,
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-muted/40">
            <div className="px-4 md:px-6 py-4 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full h-10 w-10"
                        >
                            <Link
                                href="https://github.com/nabobery/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <FaGithub className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full h-10 w-10"
                        >
                            <Link
                                href="https://linkedin.com/in/avinash-changrani"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full h-10 w-10"
                        >
                            <Link
                                href="https://nabobery.github.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Blog/Personal Site"
                            >
                                <FaRss className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full h-10 w-10"
                        >
                            <Link
                                href="mailto:avinashchangrani99@gmail.com"
                                aria-label="Email"
                            >
                                <FaEnvelope className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <div className="text-muted-foreground text-sm text-center">
                        <p>
                            © {currentYear} Avinash Changrani. All rights
                            reserved.
                        </p>
                        <p>Designed and built with passion.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
