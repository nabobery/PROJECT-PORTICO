'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    FaCode,
    FaDatabase,
    FaCloud,
    FaTerminal,
    FaGitAlt,
    FaBox,
    FaMicrochip,
    FaTable,
    FaPuzzlePiece,
    FaFigma,
    FaJsSquare,
    FaHtml5,
    FaCss3Alt,
    FaAtom,
    FaJava,
    FaPython,
    FaAws,
    FaDocker,
    FaSearch,
    FaReact,
    FaKeyboard,
    FaGoogle,
    FaNodeJs,
    FaClock,
    FaBrain,
} from 'react-icons/fa'
import {
    SiTypescript,
    SiGo,
    SiDart,
    SiTailwindcss,
    SiD3Dotjs,
    SiKubernetes,
    SiPostgresql,
    SiHelm,
    SiTerraform,
    SiPostman,
    SiVercel,
    SiNetlify,
    SiHugo,
    SiNextdotjs,
    SiFlutter,
    SiExpress,
    SiHono,
    SiDjango,
    SiFlask,
} from 'react-icons/si'
import { AiOutlineAntDesign } from 'react-icons/ai'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const skillCategories = [
    {
        name: 'Languages',
        icon: FaCode,
        skills: [
            { name: 'C/C++', icon: FaCode },
            { name: 'Java', icon: FaJava },
            { name: 'Python', icon: FaPython },
            { name: 'Bash', icon: FaTerminal },
            { name: 'SQL', icon: FaDatabase },
            { name: 'Golang', icon: SiGo },
            { name: 'Dart', icon: SiDart },
            { name: 'MATLAB', icon: FaCode },
        ],
    },
    {
        name: 'Web Development',
        icon: FaCode,
        skills: [
            { name: 'JavaScript', icon: FaJsSquare },
            { name: 'TypeScript', icon: SiTypescript },
            { name: 'HTML5', icon: FaHtml5 },
            { name: 'CSS3', icon: FaCss3Alt },
            { name: 'Tailwind CSS', icon: SiTailwindcss },
            { name: 'Figma', icon: FaFigma },
            { name: 'Zustand', icon: FaAtom },
            { name: 'Ag-Grid', icon: FaTable },
            { name: 'Ant Design', icon: AiOutlineAntDesign },
            { name: 'D3.js', icon: SiD3Dotjs },
        ],
    },
    {
        name: 'Technology',
        icon: FaCloud,
        skills: [
            { name: 'Git', icon: FaGitAlt },
            { name: 'Node.js', icon: FaNodeJs },
            { name: 'GCP', icon: FaGoogle },
            { name: 'PostgreSQL', icon: SiPostgresql },
            { name: 'AWS (S3, SNS, SQS)', icon: FaAws },
            { name: 'Docker', icon: FaDocker },
            { name: 'Kubernetes', icon: SiKubernetes },
            { name: 'Helm', icon: SiHelm },
            { name: 'Terraform', icon: SiTerraform },
            { name: 'ElasticSearch', icon: FaSearch },
            { name: 'SQLAlchemy', icon: FaDatabase },
            { name: 'pgvector', icon: FaDatabase },
            { name: 'Celery', icon: FaCode },
            { name: 'Github Actions', icon: FaGitAlt },
            { name: 'Postman', icon: SiPostman },
            { name: 'Vercel', icon: SiVercel },
            { name: 'Netlify', icon: SiNetlify },
            { name: 'Hugo', icon: SiHugo },
            { name: 'Cron jobs', icon: FaClock },
        ],
    },
    {
        name: 'Frameworks/Libraries',
        icon: FaCode,
        skills: [
            { name: 'React.js', icon: FaReact },
            { name: 'React Native', icon: FaReact },
            { name: 'Next.js', icon: SiNextdotjs },
            { name: 'Flutter', icon: SiFlutter },
            { name: 'FastAPI', icon: FaCode },
            { name: 'Express.js', icon: SiExpress },
            { name: 'Django', icon: SiDjango },
            { name: 'Flask', icon: SiFlask },
            { name: 'Hono', icon: SiHono },
            { name: 'Tensorflow', icon: FaMicrochip },
            { name: 'PyTorch', icon: FaMicrochip },
            { name: 'LlamaIndex', icon: FaMicrochip },
            { name: 'RAG/LLMs', icon: FaBrain },
        ],
    },
    {
        name: 'Problem Solving',
        icon: FaPuzzlePiece,
        skills: [
            { name: 'LeetCode', icon: FaKeyboard },
            { name: 'CodeForces', icon: FaKeyboard },
            { name: 'CodeChef', icon: FaKeyboard },
        ],
    },
]

export default function TechRadar() {
    const [activeCategory, setActiveCategory] = useState(
        skillCategories[0].name
    )
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })

    const activeData = skillCategories.find(
        (category) => category.name === activeCategory
    )

    return (
        <section id="tech-radar" className="py-20 bg-muted/40 dark:bg-muted/10">
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
                        <FaCode size={18} />
                        <span>Tech Stack</span>
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
                        My Technical Expertise
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
                </div>

                <div ref={ref} className="max-w-5xl mx-auto">
                    <Tabs
                        value={activeCategory}
                        onValueChange={setActiveCategory}
                        orientation="horizontal"
                        className="w-full mb-12"
                    >
                        <div className="flex justify-center mb-10">
                            <TabsList className="inline-flex h-auto items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground flex-wrap gap-1">
                                {skillCategories.map((category) => (
                                    <TabsTrigger
                                        key={category.name}
                                        value={category.name}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/80"
                                    >
                                        <span>{category.name}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div>
                            {skillCategories.map((category) => (
                                <TabsContent
                                    key={category.name}
                                    value={category.name}
                                    className="mt-0"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <category.icon className="w-6 h-6" />
                                                <span>{category.name}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <motion.div
                                                initial="hidden"
                                                animate={
                                                    isInView
                                                        ? 'visible'
                                                        : 'hidden'
                                                }
                                                variants={{
                                                    visible: {
                                                        transition: {
                                                            staggerChildren: 0.05,
                                                        },
                                                    },
                                                }}
                                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                                            >
                                                {category.skills.map(
                                                    (skill) => (
                                                        <motion.div
                                                            key={skill.name}
                                                            variants={{
                                                                hidden: {
                                                                    opacity: 0,
                                                                    scale: 0.9,
                                                                },
                                                                visible: {
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                },
                                                            }}
                                                            className="flex flex-col items-center text-center p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                                                        >
                                                            <skill.icon className="w-10 h-10 mb-2 text-primary" />
                                                            <span className="text-sm font-medium text-center">
                                                                {skill.name}
                                                            </span>
                                                        </motion.div>
                                                    )
                                                )}
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </div>
        </section>
    )
}
