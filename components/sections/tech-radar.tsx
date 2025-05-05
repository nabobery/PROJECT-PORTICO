"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2,
  Code,
  Database,
  Cloud,
  Terminal,
  GitMerge,
  Box,
  Cpu,
  LayoutGrid,
  Puzzle,
  Figma,
  Type,
  FileJson,
  FileCode,
  Paintbrush,
  Atom,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    name: "Languages",
    icon: Code,
    skills: [
      { name: "C/C++", icon: Code },
      { name: "Java", icon: Code },
      { name: "Python", icon: Code },
      { name: "Bash", icon: Terminal },
      { name: "SQL", icon: Database },
      { name: "Golang", icon: Code },
      { name: "Dart", icon: Code },
      { name: "MATLAB", icon: Code },
    ],
  },
  {
    name: "Web Development",
    icon: Code,
    skills: [
      { name: "JavaScript", icon: FileJson },
      { name: "TypeScript", icon: Type },
      { name: "HTML5", icon: FileCode },
      { name: "CSS3", icon: Paintbrush },
      { name: "Figma", icon: Figma },
      { name: "Zustand", icon: Atom },
      { name: "Ag-Grid", icon: LayoutGrid },
      { name: "Ant Design", icon: Puzzle },
    ],
  },
  {
    name: "Technology",
    icon: Cloud,
    skills: [
      { name: "Git", icon: GitMerge },
      { name: "GCP", icon: Cloud },
      { name: "PostgreSQL", icon: Database },
      { name: "AWS (S3, SNS, SQS)", icon: Cloud },
      { name: "Docker", icon: Box },
      { name: "Kubernetes", icon: Box },
      { name: "ElasticSearch", icon: Database },
      { name: "SQLAlchemy", icon: Database },
      { name: "pgvector", icon: Database },
      { name: "Celery", icon: Code },
      { name: "Helm", icon: Box },
      { name: "Github Actions", icon: GitMerge },
    ],
  },
  {
    name: "Frameworks/Libraries",
    icon: Code,
    skills: [
      { name: "React.js", icon: Code },
      { name: "Next.js", icon: Code },
      { name: "Flutter", icon: Code },
      { name: "FastAPI", icon: Code },
      { name: "Django", icon: Code },
      { name: "Flask", icon: Code },
      { name: "Tensorflow", icon: Cpu },
      { name: "PyTorch", icon: Cpu },
      { name: "LlamaIndex", icon: Cpu },
    ],
  },
  {
    name: "Problem Solving",
    icon: Puzzle,
    skills: [
      { name: "LeetCode", icon: Code },
      { name: "CodeForces", icon: Code },
      { name: "CodeChef", icon: Code },
    ],
  },
];

export default function TechRadar() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const activeData = skillCategories.find(
    (category) => category.name === activeCategory
  );

  return (
    <section id="tech-radar" className="py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium text-primary mb-3"
          >
            <Code2 size={18} />
            <span>Tech Stack</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
          >
            My Technical Expertise
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={
              isInView ? { opacity: 1, width: 120 } : { opacity: 0, width: 0 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-primary"
          />
        </div>

        <div ref={ref} className="max-w-5xl mx-auto">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            orientation="vertical"
            className="flex flex-col md:flex-row gap-8"
          >
            <TabsList className="flex flex-row md:flex-col justify-start md:justify-start h-auto md:h-full w-full md:w-1/4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {skillCategories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="w-full justify-start px-4 py-3 text-left whitespace-nowrap md:whitespace-normal"
                >
                  <category.icon className="w-5 h-5 mr-3 shrink-0" />
                  <span className="grow">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="w-full md:w-3/4">
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
                        animate={isInView ? "visible" : "hidden"}
                        variants={{
                          visible: { transition: { staggerChildren: 0.05 } },
                        }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        {category.skills.map((skill) => (
                          <motion.div
                            key={skill.name}
                            variants={{
                              hidden: { opacity: 0, scale: 0.9 },
                              visible: { opacity: 1, scale: 1 },
                            }}
                            className="flex flex-col items-center text-center p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                          >
                            <skill.icon className="w-10 h-10 mb-2 text-primary" />
                            <span className="text-sm font-medium text-center">
                              {skill.name}
                            </span>
                          </motion.div>
                        ))}
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
  );
}
