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

/**
 * Renders a full-viewport particle background that adapts to the current theme, device pixel ratio, and the user's reduced-motion preference.
 *
 * The canvas displays moving particles that connect to each other and (when allowed) to the mouse pointer; it reads theme-aware CSS variables for colors and opacity, resizes for DPR changes, and skips animation when the user prefers reduced motion.
 *
 * @returns A canvas-backed React element that covers the viewport with the particle visualization
 */
export function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme, resolvedTheme } = useTheme()
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const animationRef = useRef<number>(0)
    const cssVarsRef = useRef({
        primaryRgb: '59, 130, 246',
        canvasLineRgb: theme === 'dark' ? '255, 255, 255' : '34, 34, 34',
        canvasParticleRgb: theme === 'dark' ? '255, 255, 255' : '85, 85, 85',
    })
    const startedRef = useRef(false)
    const mouseQueuedRef = useRef(false)
    const dprRef = useRef(1)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Use the resolved/effective theme so OS-driven changes (when defaultTheme="system")
        // correctly update canvas colors and behavior. Falls back to `theme` if
        // `resolvedTheme` is not available yet.
        const appliedTheme = resolvedTheme ?? theme

        // Respect user's reduced motion preference: if reduced, render a static scene once and avoid animations/listeners
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // read and cache CSS vars once per theme change
        const readCssVars = () => {
            const rootStyles = getComputedStyle(document.documentElement)
            const primaryRaw = rootStyles
                .getPropertyValue('--primary-rgb')
                .trim()
            const canvasLineRaw = rootStyles
                .getPropertyValue('--canvas-line-rgb')
                .trim()
            const canvasParticleRaw = rootStyles
                .getPropertyValue('--canvas-particle-rgb')
                .trim()
            const appliedTheme = resolvedTheme || theme
            cssVarsRef.current.primaryRgb = primaryRaw || '59, 130, 246'
            cssVarsRef.current.canvasLineRgb =
                canvasLineRaw ||
                (appliedTheme === 'dark' ? '255, 255, 255' : '34, 34, 34')
            cssVarsRef.current.canvasParticleRgb =
                canvasParticleRaw ||
                (appliedTheme === 'dark' ? '255, 255, 255' : '85, 85, 85')
        }

        const resizeCanvas = () => {
            const dpr = Math.max(window.devicePixelRatio || 1, 1)
            dprRef.current = dpr
            canvas.width = Math.floor(window.innerWidth * dpr)
            canvas.height = Math.floor(window.innerHeight * dpr)
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)
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
                canvas.style.opacity = appliedTheme === 'dark' ? '0.95' : '1'
            }
            canvas.style.background = 'transparent'
        }

        const initParticles = () => {
            particlesRef.current = []
            // compute particle count using CSS pixels for stability across DPR
            const cssWidth = window.innerWidth
            const cssHeight = window.innerHeight
            const numParticles = Math.floor((cssWidth * cssHeight) / 15000)
            // Determine an effective theme for particle color fallbacks. If the
            // user-selected theme is 'system' and `resolvedTheme` is not available,
            // fall back to a runtime prefers-color-scheme check so OS-driven theme
            // switches are respected immediately.
            const computedTheme =
                (resolvedTheme ?? theme) === 'system'
                    ? typeof window !== 'undefined' &&
                      window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light'
                    : (resolvedTheme ?? theme)

            for (let i = 0; i < numParticles; i++) {
                particlesRef.current.push(
                    createParticle(
                        cssWidth,
                        cssHeight,
                        cssVarsRef.current.canvasParticleRgb,
                        computedTheme
                    )
                )
            }
        }

        const render = () => {
            // clear using CSS pixel dimensions because the context is scaled by DPR
            const cssClearWidth = canvas.width / dprRef.current
            const cssClearHeight = canvas.height / dprRef.current
            ctx.clearRect(0, 0, cssClearWidth, cssClearHeight)

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
            if (!mouseQueuedRef.current) {
                mouseQueuedRef.current = true
                requestAnimationFrame(() => {
                    mouseQueuedRef.current = false
                })
            }
        }

        const drawConnections = (ctx: CanvasRenderingContext2D) => {
            const connectionRadius = 150
            const mouseRadius = 200
            const particles = particlesRef.current
            // read cached CSS vars (computed on theme change)
            const primaryRgb = cssVarsRef.current.primaryRgb
            const canvasLineRgb = cssVarsRef.current.canvasLineRgb
            const isLight = appliedTheme !== 'dark'

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

        // Defer reading CSS vars and initialization to next frame so theme class (from next-themes)
        // can be applied to document.documentElement before we sample computed styles.
        let initRaf = 0
        initRaf = requestAnimationFrame(() => {
            readCssVars()
            if (!prefersReducedMotion) {
                window.addEventListener('resize', resizeCanvas)
                window.addEventListener('mousemove', handleMouseMove)

                resizeCanvas()
                // apply client-only styles to avoid hydration mismatch
                applyCanvasStyles()
                render()
                startedRef.current = true
            } else {
                // reduced motion: draw a single frame without animation
                resizeCanvas()
                // draw particles once using CSS pixel dims
                const cssClearWidth = canvas.width / dprRef.current
                const cssClearHeight = canvas.height / dprRef.current
                ctx.clearRect(0, 0, cssClearWidth, cssClearHeight)
                particlesRef.current.forEach((particle) => particle.draw(ctx))
                drawConnections(ctx)
            }
        })

        return () => {
            cancelAnimationFrame(initRaf)
            if (!prefersReducedMotion) {
                window.removeEventListener('resize', resizeCanvas)
                window.removeEventListener('mousemove', handleMouseMove)
                if (startedRef.current) {
                    cancelAnimationFrame(animationRef.current)
                }
            }
        }
        // Include resolvedTheme so the effect re-runs when the effective theme changes
        // (for example, when defaultTheme="system" and the OS theme toggles).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, resolvedTheme])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        />
    )
}

/**
 * Create a particle positioned within the provided CSS width and height with randomized size, velocity, and a theme-aware color.
 *
 * @param cssWidth - Canvas width in CSS pixels used to initialize position and clamp movement
 * @param cssHeight - Canvas height in CSS pixels used to initialize position and clamp movement
 * @param canvasParticleRgb - Optional CSS RGB string (e.g. `"255, 255, 255"`) to use as the particle's base color; when omitted, a theme-based fallback is used
 * @param theme - Optional theme hint (`"dark"` or `"light"`) that selects color fallbacks and alpha ranges for the particle
 * @returns A Particle object with `x`, `y`, `radius`, `color`, a `draw(ctx)` method that renders the filled circle, and an `update()` method that advances position with small velocity and enforces edge bouncing
 */
function createParticle(
    cssWidth: number,
    cssHeight: number,
    canvasParticleRgb?: string,
    theme?: string
): Particle {
    const x = Math.random() * cssWidth
    const y = Math.random() * cssHeight
    const radius = Math.random() * 2 + 1

    // Use passed-in CSS var if available, otherwise fallback by theme
    const baseColor =
        canvasParticleRgb && canvasParticleRgb.trim() !== ''
            ? canvasParticleRgb.trim()
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
            if (this.x < 0 || this.x > cssWidth) {
                this.x = Math.max(0, Math.min(this.x, cssWidth))
                this.x = this.x < 0 ? radius : cssWidth - radius
            }

            if (this.y < 0 || this.y > cssHeight) {
                this.y = Math.max(0, Math.min(this.y, cssHeight))
                this.y = this.y < 0 ? radius : cssHeight - radius
            }
        },
    }
}
