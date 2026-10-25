/**
 * Project records extracted unchanged from components/sections/projects.tsx at
 * 58f8827. Selection, featured status, and new projects (PRs 9 and 12) await
 * the owner's decisions in docs/migration/content-decisions.md.
 */

/** Filter tabs, in display order. */
export const FILTER_CATEGORIES = [
    'All',
    'Web Apps',
    'Mobile',
    'AI/ML',
    'Utilities',
    'Problem Solving',
] as const

/** Every category a record may carry. 'Open Source' has no filter tab today. */
export const PROJECT_CATEGORIES = [
    'Web Apps',
    'Mobile',
    'AI/ML',
    'Utilities',
    'Problem Solving',
    'Open Source',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
export type FilterCategory = (typeof FILTER_CATEGORIES)[number]

export interface Project {
    id: string
    title: string
    description: string
    techStack: readonly string[]
    githubLink: string | null
    liveLink: string | null
    /** Prepared media id from media-sources.ts, or null for a text-only card. */
    imageId: string | null
    category: readonly ProjectCategory[]
    featured: boolean
}

export const projects: readonly Project[] = [
    {
        id: 'go-initializer',
        title: 'go-initializer',
        description:
            'Generate standardized Go project boilerplate in seconds, setting up with best practices and essential tooling.',
        techStack: [
            'EJS',
            'Node.js',
            'Express.js',
            'React.js',
            'Vite',
            'Vercel',
            'Jest',
            'GitHub Actions',
        ],
        githubLink: 'https://github.com/nabobery/go-initializer',
        liveLink: 'https://go-initializer.vercel.app/',
        imageId: 'go-initializer',
        featured: false,
        category: ['Web Apps', 'Utilities'],
    },
    {
        id: 'athena',
        title: 'Athena',
        description:
            'An intuitive web-based tool designed to streamline the creation of machine learning models by generating starter code and meaningful visualizations. Supports PyTorch and Keras.',
        techStack: [
            'TypeScript',
            'React.js',
            'D3.js',
            'Three.js',
            'Monaco Editor',
            'PyTorch',
            'Keras',
            'Vercel',
        ],
        githubLink: 'https://github.com/nabobery/athena',
        liveLink: 'https://athena-gamma-eight.vercel.app/',
        imageId: 'athena',
        featured: false,
        category: ['AI/ML', 'Web Apps', 'Open Source'],
    },
    {
        id: 'maakavi',
        title: 'maaKaVi',
        description:
            'An interactive educational platform where students can learn coding through community-created lessons with a documentation interface, interactive elements like a code editor or quizzes, and a forum.',
        techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
        githubLink: 'https://github.com/nabobery/maaKaVi',
        liveLink: 'https://maa-ka-vi.vercel.app/',
        imageId: 'maakavi',
        featured: false,
        category: ['Web Apps'],
    },
    {
        id: 'attribute-pedestrian-detection',
        title: 'Attribute-Based Pedestrian Detection',
        description:
            'Developed a Python, Flask, and React-based web app leveraging YOLOv8 for real-time pedestrian attribute detection. Achieved a mAP of 55.5.',
        techStack: ['Python', 'Flask', 'React', 'YOLOv8'],
        githubLink:
            'https://github.com/nabobery/Attribute-Based-Pedestrian-Detection',
        liveLink: null,
        imageId: 'attribute-pedestrian-detection',
        featured: false,
        category: ['AI/ML', 'Web Apps'],
    },
    {
        id: 'before-you-sign',
        title: 'Before You Sign (Hackathon Project)',
        description:
            'Chrome extension for Dropbox Sign API Hackathon, featuring a lawyer chatbot, text highlighter, and document generator.',
        techStack: ['React.js', 'FastAPI', 'Google Cloud Platform'],
        githubLink: 'https://github.com/nabobery/before-you-sign',
        liveLink: 'https://before-you-sign-it.vercel.app/',
        imageId: 'before-you-sign',
        featured: false,
        category: ['Web Apps', 'Utilities'],
    },
    {
        id: 'spotify-downloader',
        title: 'Spotify Downloader',
        description:
            'High-performance Spotify playlist analyzer and downloader with Flask backend, React frontend, using Spotify API and YouTube links. Deployed with Docker.',
        techStack: ['Python', 'Flask', 'React', 'Spotify API', 'Docker'],
        githubLink: 'https://github.com/nabobery/spotify-downloader',
        liveLink: null,
        imageId: 'spotify-downloader',
        featured: false,
        category: ['Web Apps', 'Utilities'],
    },
    {
        id: 'advent-of-code',
        title: 'Advent of Code',
        description: 'Solutions for Advent of Code programming challenges.',
        techStack: ['C++', 'Python', 'Go'],
        githubLink: 'https://github.com/nabobery/Advent-of-Code',
        liveLink: null,
        imageId: 'advent-of-code',
        featured: false,
        category: ['Problem Solving'],
    },
    {
        id: 'go-backend-journey',
        title: 'Go Backend Learning Journey',
        description:
            'A collection of backend projects based on roadmap.sh challenges [https://roadmap.sh/backend/projects], implemented in Go using frameworks and libraries like Gin, Gorilla Mux, GORM, Viper, and integrating with databases like MongoDB and Redis.',
        techStack: [
            'Go',
            'Gin',
            'Gorilla Mux',
            'GORM',
            'MongoDB',
            'Redis',
            'Viper',
        ],
        githubLink: 'https://github.com/nabobery/Backend-Projects',
        liveLink: null,
        imageId: 'go-backend-journey',
        featured: false,
        category: ['Web Apps', 'Problem Solving', 'Utilities'],
    },
    {
        id: 'project-mads',
        title: 'PROJECT MADS',
        description:
            'Journey to master Algorithms and Data Structures using competitive programming problems from platforms like LeetCode, CodeChef, CSES etc.',
        techStack: ['C', 'C++', 'CLion'],
        githubLink: 'https://github.com/nabobery/PROJECT-MADS',
        liveLink: null,
        imageId: 'project-mads',
        featured: false,
        category: ['Problem Solving'],
    },
    {
        id: 'exaimination',
        title: 'exAImination',
        description:
            "An AI-powered test generator that uses OpenAI's API to create questions from text input (.txt files or direct text) and provides immediate feedback based on answer evaluation.",
        techStack: [
            'Next.js',
            'Node.js',
            'Python',
            'OpenAI',
            'TailwindCSS',
            'Axios',
        ],
        githubLink: 'https://github.com/nabobery/eduhack',
        liveLink: 'https://exaimination.vercel.app/',
        imageId: 'exaimination',
        featured: false,
        category: ['AI/ML', 'Web Apps'],
    },
    {
        id: 'maze-solver-using-ai',
        title: 'Maze Solver AI',
        description:
            'AI-powered maze solver implementing BFS, DFS, and A* algorithms, with a Pygame GUI for visualization.',
        techStack: ['Python', 'Pygame', 'BFS', 'DFS', 'A*'],
        githubLink: 'https://github.com/nabobery/MAZE-SOLVER-USING-AI',
        liveLink: null,
        imageId: 'maze-solver-using-ai',
        featured: false,
        category: ['AI/ML', 'Utilities'],
    },
    {
        id: 'project-war',
        title: 'Project WAR',
        description:
            'A Wordle solver built from scratch using a simple algorithm based on game rules and predetermined predictions. Achieves an average prediction count of 3.67689, close to the best-known automated solvers.',
        techStack: ['C++'],
        githubLink: null,
        liveLink: null,
        imageId: 'project-war',
        featured: false,
        category: ['Utilities'],
    },
]

export function filterProjects(
    list: readonly Project[],
    category: string
): readonly Project[] {
    if (category === 'All') return list
    return list.filter((project) =>
        (project.category as readonly string[]).includes(category)
    )
}
