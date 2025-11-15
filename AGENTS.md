# AGENTS.md

This file provides guidance for AI coding agents working on the PROJECT-PORTICO repository. It contains essential context, conventions, and instructions to help agents understand the codebase and make effective contributions.

## Project Overview

**PORTICO** (Portfolio Offering Relevant Talents, Insights, and Creative Output) is an interactive portfolio website built for a full-stack developer and AI/ML engineer. The site is a single-page application (SPA) with scroll-based navigation, showcasing work experience, projects, technical skills, competitive programming stats, and contact information.

**Live Site:** https://avinashchangrani.vercel.app

**Key Characteristics:**
- Modern, performance-optimized Next.js application
- Fully responsive with mobile-first design
- Dark/light theme support with system preference detection
- Accessibility-focused with reduced motion support
- Animated and interactive UI elements

## Tech Stack & Architecture

### Core Technologies
- **Next.js 15.3.1** - React meta-framework with App Router, SSR, and API routes
- **React 19** - UI component library (latest version)
- **TypeScript 5** - Strict type checking enabled (`"strict": true`)
- **Tailwind CSS 4.1.5** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
- **shadcn/ui** - Pre-built component library (built on Radix + Tailwind)

### Key Libraries
- **Animation:** Framer Motion, Anime.js, Typed.js, Embla Carousel
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Theme:** next-themes with CSS variables
- **Icons:** react-icons
- **Notifications:** Sonner (toast notifications)

### Architecture Patterns
1. **Single-Page Application:** All content on one page (`app/page.tsx`) with hash-based navigation
2. **Component Hierarchy:** Atomic design - sections, layouts, and atomic UI components
3. **Server Components:** Next.js 15 App Router with RSC support
4. **CSS Variables:** HSL-based color system for theming (`globals.css`)
5. **API Routes:** Serverless functions in `app/api/` (currently: LeetCode GraphQL proxy)

## Development Environment Setup

### Prerequisites
- Node.js v20 or later
- npm (comes with Node.js)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd PROJECT-PORTICO

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:3000` with hot-reload enabled.

### Path Aliases
The project uses `@/` as an alias for the root directory:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## Code Structure & Organization

```
PROJECT-PORTICO/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (metadata, fonts, providers)
│   ├── page.tsx                  # Home page (main entry point)
│   ├── globals.css               # Global styles & CSS variables
│   └── api/                      # API routes
│       └── leetcode-stats/       # LeetCode GraphQL proxy
│           └── route.ts
│
├── components/                   # React components
│   ├── sections/                 # Page sections (Hero, About, Projects, etc.)
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── experience.tsx
│   │   ├── projects.tsx
│   │   ├── tech-radar.tsx
│   │   ├── competitive-stats.tsx
│   │   └── contact.tsx
│   │
│   ├── ui/                       # Atomic UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ... (40+ components)
│   │
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx            # Navigation (16KB, complex)
│   │   └── footer.tsx
│   │
│   └── theme/                    # Theme-related components
│       ├── theme-provider.tsx
│       └── theme-toggle.tsx
│
├── hooks/                        # Custom React hooks
│   └── use-toast.ts
│
├── lib/                          # Utilities and helpers
│   ├── utils.ts                  # cn() for Tailwind class merging
│   ├── use-lock-scroll.ts        # Body scroll lock hook
│   └── styles.css                # Custom animations
│
└── public/                       # Static assets (images, icons)
```

### Important Files

**Entry Points:**
- `app/layout.tsx` - Root layout with providers, metadata, and global setup
- `app/page.tsx` - Main page orchestrating all sections
- `components/layout/navbar.tsx` - Complex navigation component (16KB)

**Configuration:**
- `tailwind.config.ts` - Tailwind customization, theme colors, animations
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript config with strict mode
- `next.config.mjs` - Next.js configuration

**Styling:**
- `app/globals.css` - CSS variables for theming, global typography
- `lib/styles.css` - Custom animations and utility styles

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint with auto-fix
npm run format       # Format all files with Prettier

# Setup
npm run prepare      # Initialize Husky git hooks (runs on install)
```

### Git Workflow

**Pre-commit Hooks (Husky):**
1. ESLint runs with `--fix` flag
2. Prettier formats staged files via lint-staged
3. Commit is blocked if linting fails

**CI/CD (GitHub Actions):**
- Trigger: Pull requests
- Job: Linting on Ubuntu (Node.js v20)
- Checks: `npm run lint`
- Location: `.github/workflows/lint.yml`

**Branch Strategy:**
- Feature branches for development
- Main branch for production (auto-deploys to Vercel)

### Making Changes

1. **Create a feature branch**
2. **Make changes** - Code will hot-reload in browser
3. **Commit** - Pre-commit hooks run automatically
4. **Create PR** - CI linting runs automatically
5. **Merge** - Auto-deploys to Vercel on merge to main

## Testing

**Current Status:** No testing framework is configured.

**What This Means:**
- No test files exist (`.test.ts`, `.spec.ts`)
- No testing libraries in dependencies
- Manual testing is required

**Recommendations for Future:**
- Add Vitest + React Testing Library for component tests
- Add Playwright or Cypress for E2E testing

**When Making Changes:**
- Manually verify functionality in browser
- Test both light and dark themes
- Test responsive layouts (mobile, tablet, desktop)
- Check accessibility with reduced motion preference

## Code Conventions & Standards

### TypeScript
- **Strict mode enabled** - All type errors must be resolved
- **Explicit types** - Prefer explicit typing over inference for function parameters
- **No `any`** - Avoid using `any` type; use `unknown` if type is truly unknown

### React Components
- Use **functional components** with hooks
- Use **TypeScript** for all new components
- Export components as default or named exports consistently
- Define prop types using TypeScript interfaces

Example:
```typescript
interface HeroProps {
  title: string
  subtitle?: string
}

export default function Hero({ title, subtitle }: HeroProps) {
  return <div>...</div>
}
```

### Styling Conventions

**Tailwind CSS:**
- Use utility classes directly in JSX
- Use `cn()` helper from `@/lib/utils` for conditional classes
- Follow mobile-first responsive design

Example:
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  "md:desktop-classes"
)} />
```

**CSS Variables:**
- Theme colors are HSL-based CSS variables in `globals.css`
- Use semantic color names: `hsl(var(--primary))`, `hsl(var(--background))`
- Don't hardcode colors - use CSS variables for theme support

**Dark Mode:**
- Use CSS variables that automatically switch with theme
- Test all changes in both light and dark modes
- Use `next-themes` for theme detection

### Code Formatting (Prettier)

Configuration in `.prettierrc.json`:
- **Indentation:** 4 spaces (not tabs)
- **Quotes:** Single quotes for strings
- **Semicolons:** No trailing semicolons
- **Trailing Commas:** ES5 style (arrays, objects)

**This is enforced automatically** by pre-commit hooks - don't fight the formatter!

### Linting (ESLint)

- Extends `next/core-web-vitals` preset
- Auto-fix runs on pre-commit and via `npm run lint`
- Lint errors don't block production builds (`ignoreDuringBuilds: true`)

### File Naming
- **Components:** PascalCase (`Hero.tsx`, `NavBar.tsx`)
- **Utilities:** kebab-case (`use-toast.ts`, `use-lock-scroll.ts`)
- **Directories:** lowercase (`components/`, `sections/`, `ui/`)

### Import Organization
1. External dependencies (React, Next.js, libraries)
2. Internal components (`@/components/...`)
3. Utilities and hooks (`@/lib/...`, `@/hooks/...`)
4. Types and interfaces
5. Styles (if any)

## Accessibility Guidelines

This project prioritizes accessibility:

1. **Reduced Motion:** Respect `prefers-reduced-motion` media query
   - Framer Motion checks `useReducedMotion()` hook
   - Disable or reduce animations when preference is set

2. **Semantic HTML:** Use proper heading hierarchy (h1 → h2 → h3)

3. **Radix UI Components:** Pre-built with accessibility best practices
   - Keyboard navigation support
   - ARIA attributes
   - Focus management

4. **Color Contrast:** Ensure sufficient contrast in both themes

5. **Alt Text:** Always provide descriptive alt text for images

## Build & Deployment

### Build Process
```bash
npm run build
```

This command:
1. Compiles TypeScript to JavaScript
2. Bundles components with code splitting
3. Optimizes images (unoptimized mode for Vercel)
4. Generates static and server-side pages

### Build Output
- `.next/` directory contains compiled assets
- Server-side rendered pages
- Static assets in `.next/static/`
- API routes as serverless functions

### Deployment (Vercel)

**Automatic Deployment:**
- Push to main branch triggers auto-deploy
- Preview deployments for all PRs
- Zero-downtime deployments

**Platform:** https://vercel.com
**Live URL:** https://avinashchangrani.vercel.app

**Configuration:**
- `next.config.mjs` - Next.js build configuration
- Environment variables set in Vercel dashboard

## Common Commands & Tasks

### Adding a New UI Component (shadcn/ui)
```bash
# Example: Add a new shadcn component
npx shadcn@latest add <component-name>
```

This adds the component to `components/ui/` with proper configuration.

### Adding a New Section
1. Create file in `components/sections/` (e.g., `testimonials.tsx`)
2. Import and add to `app/page.tsx`
3. Add corresponding hash anchor in `Navbar.tsx` if needed

### Working with Forms
- Use React Hook Form + Zod for validation
- See `components/sections/contact.tsx` for example
- Form components in `components/ui/form.tsx`

### API Routes
- Create in `app/api/<route-name>/route.ts`
- Export `GET`, `POST`, etc. as named exports
- Return `NextResponse.json()` for JSON responses
- See `app/api/leetcode-stats/route.ts` for example

### Updating Dependencies
```bash
npm update                    # Update all dependencies
npm install <package>@latest  # Update specific package
```

**After updating:**
1. Run `npm run build` to check for breaking changes
2. Test in development mode
3. Check for TypeScript errors

## PR Guidelines & Commit Messages

### Before Committing
- [ ] Run `npm run lint` - ensure no linting errors
- [ ] Run `npm run build` - ensure build succeeds
- [ ] Test in browser (both light and dark themes)
- [ ] Check responsive layouts on mobile
- [ ] Verify accessibility (reduced motion, keyboard navigation)

### Commit Message Format
Follow conventional commits style:
```
feat: Add new testimonials section
fix: Resolve navbar mobile menu overflow issue
refactor: Simplify theme toggle component
docs: Update README with new deployment info
style: Format code with Prettier
```

Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional change)
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic change)
- `chore:` - Maintenance tasks

### Pull Request Checklist
- [ ] Title follows commit message format
- [ ] Description explains what and why (not just what)
- [ ] CI checks pass (linting)
- [ ] No console errors or warnings
- [ ] Tested in multiple browsers if applicable
- [ ] Screenshots for UI changes

## Important Notes for AI Agents

### What to Watch Out For

1. **Navbar Complexity:** The `navbar.tsx` file is 16KB and complex
   - Handles mobile/desktop responsive states
   - Integrates reduced motion preferences
   - Uses Radix Sheet component for mobile drawer
   - Be careful when modifying - test thoroughly

2. **Theme System:** Don't hardcode colors
   - Use CSS variables: `hsl(var(--primary))`
   - Test changes in both light and dark modes
   - Theme flash prevention script in `layout.tsx` - don't remove

3. **Animation Performance:** Respect `prefers-reduced-motion`
   - Always check if animations respect user preference
   - Use Framer Motion's `useReducedMotion()` hook

4. **No Tests:** Manual verification required
   - Always test changes in browser
   - Check multiple screen sizes
   - Verify theme switching works

5. **Build Configuration:**
   - ESLint errors don't block builds (`ignoreDuringBuilds: true`)
   - Image optimization is set to `unoptimized: true`
   - Don't change these without good reason

### Common Pitfalls

1. **Import Paths:** Always use `@/` alias, not relative paths
   ```typescript
   // ✅ Good
   import { Button } from "@/components/ui/button"

   // ❌ Bad
   import { Button } from "../ui/button"
   ```

2. **Tailwind Classes:** Use `cn()` for conditional/merged classes
   ```typescript
   // ✅ Good
   className={cn("base", condition && "conditional")}

   // ❌ Bad
   className={`base ${condition ? "conditional" : ""}`}
   ```

3. **TypeScript Strict Mode:** Don't use `any` to bypass errors
   ```typescript
   // ✅ Good
   const data: LeetCodeStats | null = await fetchStats()

   // ❌ Bad
   const data: any = await fetchStats()
   ```

4. **CSS Variables:** Don't break theme system
   ```css
   /* ✅ Good */
   color: hsl(var(--primary));

   /* ❌ Bad */
   color: #3b82f6;
   ```

5. **Responsive Design:** Always test mobile layouts
   - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
   - Mobile-first approach (base styles for mobile, add larger screens)

### Best Practices for This Codebase

1. **Component Size:** Keep components focused and small
   - If a component gets too large, split it into smaller pieces
   - Exception: Section components can be larger

2. **State Management:** Use local state (useState) unless shared
   - No global state management (Redux/Zustand) is configured
   - Theme state managed by `next-themes` provider

3. **Performance:** Leverage Next.js features
   - Use dynamic imports for heavy components
   - Optimize images with next/image (though currently unoptimized)

4. **Accessibility First:** Always consider accessibility
   - Semantic HTML elements
   - Keyboard navigation
   - Screen reader support
   - Reduced motion preferences

5. **Documentation:** Comment complex logic
   - Not every line needs comments
   - Explain the "why," not the "what"
   - Document non-obvious business logic

### File Modification Guidelines

**Safe to Modify:**
- Section components (`components/sections/`)
- UI components (`components/ui/`)
- Utility functions (`lib/utils.ts`)
- Custom hooks (`hooks/`)

**Modify with Caution:**
- `navbar.tsx` - Complex, test thoroughly
- `layout.tsx` - Root layout, affects entire app
- `globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Affects entire theme system

**Rarely Modify:**
- `next.config.mjs` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `.husky/` - Git hooks
- `.github/workflows/` - CI/CD pipeline

## Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Framer Motion:** https://www.framer.com/motion/

## Questions?

If you encounter something not covered in this guide:
1. Check the README.md for high-level project information
2. Examine existing code for patterns and conventions
3. Refer to official documentation for frameworks and libraries
4. When in doubt, ask for clarification before making changes

---

**Last Updated:** 2025-11-15
**Version:** 1.0.0
