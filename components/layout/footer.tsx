import Link from 'next/link'
import { Code2, Github, Linkedin, Mail, Rss } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-muted/40">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <Link
                            href="https://nabobery.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">
                                Avinash Changrani
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-xs">
                            Passionate AI/ML & Full-Stack Engineer building
                            intelligent, scalable solutions.
                        </p>
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
                                    <Github className="h-5 w-5" />
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
                                    <Linkedin className="h-5 w-5" />
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
                                    <Rss className="h-5 w-5" />
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
                                    <Mail className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider">
                                Navigation
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#about"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#experience"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Experience
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#projects"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Projects
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#tech-radar"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Tech Stack
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#contact"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider">
                                Resources
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="https://nabobery.github.io/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://leetcode.com/Nabobery/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        LeetCode
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Source Code
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Newsletter
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider">
                                Legal
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Cookie Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} Avinash Changrani. All rights
                            reserved.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Designed and built with passion.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
