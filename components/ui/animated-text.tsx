'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

interface AnimatedTextProps {
    text: string
    el?: keyof JSX.IntrinsicElements
    className?: string
    once?: boolean
    delay?: number
}

export default function AnimatedText({
    text,
    el: Wrapper = 'p',
    className,
    once = false,
    delay = 0,
}: AnimatedTextProps) {
    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { once })

    useEffect(() => {
        if (isInView) {
            controls.start('visible')
        } else if (!once) {
            controls.start('hidden')
        }
    }, [controls, isInView, once])

    const words = text.split(' ')

    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    }

    const child = {
        hidden: {
            y: 20,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className={className}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-1"
                    variants={child}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}
