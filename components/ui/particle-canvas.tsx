'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

type Particle = {
    x: number
    y: number
    radius: number
    color: string
    draw: (ctx: CanvasRenderingContext2D) => void
    update: () => void
}

export function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const animationRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Respect user's reduced motion preference: if reduced, render a static scene once and avoid animations/listeners
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        // apply visual canvas-only styles after mount to avoid SSR/client mismatch
        const applyCanvasStyles = () => {
            // read computed CSS vars for opacity fallbacks
            const rootStyles = getComputedStyle(document.documentElement)
            const opacityVar = rootStyles
                .getPropertyValue('--canvas-opacity')
                .trim()
            if (opacityVar) {
                canvas.style.opacity = opacityVar
            } else {
                // fallback: slightly translucent in dark mode, fully visible in light
                canvas.style.opacity = theme === 'dark' ? '0.95' : '1'
            }
            canvas.style.background = 'transparent'
        }

        const initParticles = () => {
            particlesRef.current = []
            const numParticles = Math.floor(
                (canvas.width * canvas.height) / 15000
            )

            for (let i = 0; i < numParticles; i++) {
                particlesRef.current.push(createParticle(canvas, theme))
            }
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw and update particles
            particlesRef.current.forEach((particle) => {
                particle.draw(ctx)
                particle.update()
            })

            // Draw connections
            drawConnections(ctx)

            animationRef.current = requestAnimationFrame(render)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }

        const drawConnections = (ctx: CanvasRenderingContext2D) => {
            const connectionRadius = 150
            const mouseRadius = 200
            const particles = particlesRef.current
            // get computed CSS colors for robust theming (falls back to sensible values)
            const rootStyles =
                typeof window !== 'undefined'
                    ? getComputedStyle(document.documentElement)
                    : null
            const fgRaw =
                rootStyles && rootStyles.getPropertyValue('--foreground-rgb')
            const primaryRaw =
                rootStyles && rootStyles.getPropertyValue('--primary-rgb')
            const canvasLineRaw =
                rootStyles && rootStyles.getPropertyValue('--canvas-line-rgb')
            const canvasParticleRaw =
                rootStyles &&
                rootStyles.getPropertyValue('--canvas-particle-rgb')

            // sensible fallbacks: light theme uses darker greys, dark theme uses white
            const fgRgb =
                fgRaw && fgRaw.trim() !== ''
                    ? fgRaw.trim()
                    : theme === 'dark'
                      ? '255, 255, 255'
                      : '34, 34, 34'
            const primaryRgb =
                primaryRaw && primaryRaw.trim() !== ''
                    ? primaryRaw.trim()
                    : '59, 130, 246'
            const canvasLineRgb =
                canvasLineRaw && canvasLineRaw.trim() !== ''
                    ? canvasLineRaw.trim()
                    : theme === 'dark'
                      ? '255, 255, 255'
                      : '34, 34, 34'
            const isLight = theme !== 'dark'

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionRadius) {
                        const opacity = 1 - distance / connectionRadius
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        // use canvas-specific color (designer tuneable) so lines contrast correctly
                        const lineAlpha = isLight
                            ? Math.min(0.95, opacity * 1)
                            : Math.min(0.85, opacity * 0.6)
                        ctx.strokeStyle = `rgba(${canvasLineRgb}, ${lineAlpha})`
                        ctx.lineWidth = isLight ? 1.4 : 1
                        ctx.stroke()
                    }
                }

                // Draw connections to mouse position
                const dx = particles[i].x - mouseRef.current.x
                const dy = particles[i].y - mouseRef.current.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouseRadius) {
                    const opacity = 1 - distance / mouseRadius
                    ctx.beginPath()
                    ctx.moveTo(particles[i].x, particles[i].y)
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
                    // emphasize mouse connections using primary accent for affordance
                    const mouseAlpha = isLight
                        ? Math.min(0.98, opacity * 1.1)
                        : Math.min(0.95, opacity * 0.9)
                    ctx.strokeStyle = `rgba(${primaryRgb}, ${mouseAlpha})`
                    ctx.lineWidth = isLight ? 1.8 : 1.5
                    ctx.stroke()

                    // Move particles slightly toward mouse
                    const angle = Math.atan2(dy, dx)
                    const force = ((mouseRadius - distance) / mouseRadius) * 0.2
                    particles[i].x -= Math.cos(angle) * force
                    particles[i].y -= Math.sin(angle) * force
                }
            }
        }

        if (!prefersReducedMotion) {
            window.addEventListener('resize', resizeCanvas)
            window.addEventListener('mousemove', handleMouseMove)

            resizeCanvas()
            // apply client-only styles to avoid hydration mismatch
            applyCanvasStyles()
            render()
        } else {
            // reduced motion: draw a single frame without animation
            resizeCanvas()
            // draw particles once
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particlesRef.current.forEach((particle) => particle.draw(ctx))
            drawConnections(ctx)
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationRef.current)
        }
    }, [theme])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

function createParticle(
    canvas: HTMLCanvasElement,
    theme?: string | undefined
): Particle {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 2 + 1

    // Particle fill color should use canvas particle CSS variable when available
    const rootStyles =
        typeof window !== 'undefined'
            ? getComputedStyle(document.documentElement)
            : null
    const canvasParticleRaw =
        rootStyles && rootStyles.getPropertyValue('--canvas-particle-rgb')
    const baseColor =
        canvasParticleRaw && canvasParticleRaw.trim() !== ''
            ? canvasParticleRaw.trim()
            : theme === 'dark'
              ? '255, 255, 255'
              : '85, 85, 85'
    const alpha =
        theme === 'dark'
            ? Math.random() * 0.5 + 0.3
            : Math.random() * 0.4 + 0.15
    const color = `rgba(${baseColor}, ${alpha})`

    // Random velocity
    const vx = (Math.random() - 0.5) * 0.2
    const vy = (Math.random() - 0.5) * 0.2

    return {
        x,
        y,
        radius,
        color,
        draw(ctx: CanvasRenderingContext2D) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
        },
        update() {
            this.x += vx
            this.y += vy

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.x = Math.max(0, Math.min(this.x, canvas.width))
                this.x = this.x < 0 ? radius : canvas.width - radius
            }

            if (this.y < 0 || this.y > canvas.height) {
                this.y = Math.max(0, Math.min(this.y, canvas.height))
                this.y = this.y < 0 ? radius : canvas.height - radius
            }
        },
    }
}
