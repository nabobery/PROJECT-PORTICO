'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { FaArrowRight, FaBookOpen, FaClock } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const blogPosts = [
    {
        title: 'Building Performant React Applications',
        excerpt:
            'Learn the strategies and techniques for optimizing React applications for maximum performance.',
        image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
        date: 'June 15, 2023',
        readTime: '9 min read',
        tags: ['React', 'Performance'],
        link: '#',
    },
    {
        title: 'The Future of Frontend Development',
        excerpt:
            'Exploring emerging trends and technologies shaping the future of frontend development.',
        image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        date: 'May 22, 2023',
        readTime: '7 min read',
        tags: ['Web Development', 'Trends'],
        link: '#',
    },
    {
        title: 'TypeScript Tips for React Developers',
        excerpt:
            'Maximize your productivity with these TypeScript tips specifically for React projects.',
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
        date: 'April 10, 2023',
        readTime: '6 min read',
        tags: ['TypeScript', 'React'],
        link: '#',
    },
]

export default function Blog() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

    return (
        <section id="blog" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-sm font-medium text-primary mb-3"
                    >
                        <FaBookOpen size={18} />
                        <span>Blog & Thoughts</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
                    >
                        My Latest Articles
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={
                            isInView
                                ? { opacity: 1, width: 120 }
                                : { opacity: 0, width: 0 }
                        }
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-1 bg-primary"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-muted-foreground text-center max-w-2xl mt-4"
                    >
                        Insights, tutorials, and thoughts on web development,
                        design patterns, and technology trends.
                    </motion.p>
                </div>

                <div
                    ref={ref}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 50 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 50 }
                            }
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.1,
                            }}
                        >
                            <Card className="overflow-hidden h-full group">
                                <div className="relative h-48">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <time className="text-xs text-muted-foreground">
                                            {post.date}
                                        </time>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <FaClock className="h-3 w-3" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-muted-foreground mb-4">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="px-6 pb-6 pt-0">
                                    <Button
                                        variant="ghost"
                                        className="px-0 group"
                                        asChild
                                    >
                                        <a
                                            href={post.link}
                                            className="flex items-center gap-2"
                                        >
                                            <span>Read Article</span>
                                            <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <Button variant="outline" size="lg" className="gap-2">
                        <span>View All Articles</span>
                        <FaArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
