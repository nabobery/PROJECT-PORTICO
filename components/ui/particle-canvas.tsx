"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { animate } from "animejs";

type Particle = {
  x: number;
  y: number;
  radius: number;
  color: string;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: () => void;
};

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push(createParticle(canvas, theme));
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
      });

      // Draw connections
      drawConnections(ctx);

      animationRef.current = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Create ripple effect on mouse move
      createRipple(e.clientX, e.clientY);
    };

    const createRipple = (x: number, y: number) => {
      const ripple = document.createElement("div");
      ripple.classList.add("ripple");
      ripple.style.position = "fixed";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.borderRadius = "50%";
      ripple.style.backgroundColor = "rgba(var(--primary-rgb), 0.3)";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "9999";
      document.body.appendChild(ripple);

      animate(ripple, {
        scale: [0, 3],
        opacity: [0.5, 0],
        easing: "easeOutExpo",
        duration: 1000,
        complete: () => {
          document.body.removeChild(ripple);
        },
      });
    };

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const connectionRadius = 150;
      const mouseRadius = 200;
      const particles = particlesRef.current;

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = 1 - distance / connectionRadius;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(var(--primary-rgb), ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw connections to mouse position
        const dx = particles[i].x - mouseRef.current.x;
        const dy = particles[i].y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const opacity = 1 - distance / mouseRadius;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(var(--primary-rgb), ${opacity * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Move particles slightly toward mouse
          const angle = Math.atan2(dy, dx);
          const force = ((mouseRadius - distance) / mouseRadius) * 0.2;
          particles[i].x -= Math.cos(angle) * force;
          particles[i].y -= Math.sin(angle) * force;
        }
      }
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ background: "transparent" }}
    />
  );
}

function createParticle(
  canvas: HTMLCanvasElement,
  theme?: string | undefined
): Particle {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 2 + 1;

  // Different colors for dark/light themes
  const baseColor = theme === "dark" ? "255, 255, 255" : "0, 0, 0";
  const color = `rgba(${baseColor}, ${Math.random() * 0.4 + 0.1})`;

  // Random velocity
  const vx = (Math.random() - 0.5) * 0.2;
  const vy = (Math.random() - 0.5) * 0.2;

  return {
    x,
    y,
    radius,
    color,
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    update() {
      this.x += vx;
      this.y += vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) {
        this.x = Math.max(0, Math.min(this.x, canvas.width));
        this.x = this.x < 0 ? radius : canvas.width - radius;
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.y = Math.max(0, Math.min(this.y, canvas.height));
        this.y = this.y < 0 ? radius : canvas.height - radius;
      }
    },
  };
}
