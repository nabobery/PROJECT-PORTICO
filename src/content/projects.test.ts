import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vite-plus/test'
import {
    FILTER_CATEGORIES,
    PROJECT_CATEGORIES,
    filterProjects,
    projects,
    type Project,
} from './projects.ts'
import { MEDIA_SOURCES } from './media-sources.ts'

const fixture = (overrides: Partial<Project>): Project => ({
    id: 'fixture',
    title: 'Fixture',
    description: 'Test-only record.',
    techStack: [],
    githubLink: null,
    liveLink: null,
    imageId: null,
    category: ['Utilities'],
    featured: false,
    ...overrides,
})

describe('project records', () => {
    test('ids are unique', () => {
        const ids = projects.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('every category is an allowed category', () => {
        for (const project of projects) {
            for (const category of project.category) {
                expect(PROJECT_CATEGORIES).toContain(category)
            }
        }
    })

    test('every image reference is prepared media whose source file exists', () => {
        const mediaIds = new Set(MEDIA_SOURCES.map((m) => m.id))
        for (const project of projects) {
            if (project.imageId === null) continue
            expect(mediaIds.has(project.imageId), project.id).toBe(true)
            const media = MEDIA_SOURCES.find((m) => m.id === project.imageId)!
            expect(
                existsSync(path.join('public', media.source)),
                media.source
            ).toBe(true)
        }
    })

    test('links are absolute HTTPS URLs or null', () => {
        for (const project of projects) {
            for (const link of [project.githubLink, project.liveLink]) {
                if (link !== null) expect(link).toMatch(/^https:\/\//)
            }
        }
    })

    test('no project is featured until the owner selects featured work', () => {
        expect(projects.filter((p) => p.featured)).toEqual([])
    })

    test('the twelve published projects keep their order', () => {
        expect(projects.map((p) => p.title)).toEqual([
            'go-initializer',
            'Athena',
            'maaKaVi',
            'Attribute-Based Pedestrian Detection',
            'Before You Sign (Hackathon Project)',
            'Spotify Downloader',
            'Advent of Code',
            'Go Backend Learning Journey',
            'PROJECT MADS',
            'exAImination',
            'Maze Solver AI',
            'Project WAR',
        ])
    })
})

describe('filterProjects', () => {
    const list = [
        fixture({ id: 'a', category: ['AI/ML'] }),
        fixture({ id: 'b', category: ['Web Apps', 'AI/ML'] }),
        fixture({ id: 'c', category: ['Utilities'] }),
    ]

    test('All returns every record in order', () => {
        expect(filterProjects(list, 'All').map((p) => p.id)).toEqual([
            'a',
            'b',
            'c',
        ])
    })

    test('a category returns only matching records', () => {
        expect(filterProjects(list, 'AI/ML').map((p) => p.id)).toEqual([
            'a',
            'b',
        ])
    })

    test('an empty category (Mobile today) returns no records', () => {
        expect(filterProjects(projects, 'Mobile')).toEqual([])
        expect(FILTER_CATEGORIES).toContain('Mobile')
    })
})
