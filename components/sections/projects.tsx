"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Code, ExternalLink, Github, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "All",
  "Web Apps",
  "Mobile",
  "UI/UX",
  "Open Source",
  "AI/ML",
  "Utilities",
];

// Define the interface before using it
interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubLink: string | null;
  liveLink: string | null;
  imageUrl: string;
}

// Explicitly type the projects array
const projects: Project[] = [
  {
    title: "Attribute-Based Pedestrian Detection",
    description:
      "Developed a Python, Flask, and React-based web app leveraging YOLOv8 for real-time pedestrian attribute detection. Achieved a mAP of 55.5.",
    techStack: ["Python", "Flask", "React", "YOLOv8"],
    githubLink:
      "https://github.com/nabobery/Attribute-Based-Pedestrian-Detection",
    liveLink: null, // Or actual link if available
    imageUrl: "/images/projects/placeholder1.jpg", // Placeholder
  },
  {
    title: "Before You Sign (Hackathon Project)",
    description:
      "Chrome extension for Dropbox Sign API Hackathon, featuring a lawyer chatbot, text highlighter, and document generator.",
    techStack: ["React.js", "FastAPI", "Google Cloud Platform"],
    githubLink: null, // Add link if available on GitHub
    liveLink: null,
    imageUrl: "/images/projects/placeholder2.jpg", // Placeholder
  },
  {
    title: "Spotify Downloader",
    description:
      "High-performance Spotify playlist analyzer and downloader with Flask backend, React frontend, using Spotify API and YouTube links. Deployed with Docker.",
    techStack: ["Python", "Flask", "React", "Spotify API", "Docker"],
    githubLink: "https://github.com/nabobery/spotify-downloader",
    liveLink: null,
    imageUrl: "/images/projects/placeholder3.jpg", // Placeholder
  },
  {
    title: "Maze Solver AI",
    description:
      "AI-powered maze solver implementing BFS, DFS, and A* algorithms, with a Pygame GUI for visualization.",
    techStack: ["Python", "Pygame", "BFS", "DFS", "A*"],
    githubLink: null, // Add link if available on GitHub
    liveLink: null,
    imageUrl: "/images/projects/placeholder4.jpg", // Placeholder
  },
  {
    title: "Advent of Code",
    description: "Solutions for Advent of Code programming challenges.",
    techStack: ["C++", "Python"], // Based on GitHub, might vary
    githubLink: "https://github.com/nabobery/Advent-of-Code",
    liveLink: null,
    imageUrl: "/images/projects/placeholder5.jpg", // Placeholder
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const filteredProjects = projects.filter((project: Project) => {
    // Use the interface here
    // Re-implement filtering if needed, e.g., based on techStack or keep returning true
    if (activeCategory === "All") return true;
    return project.techStack.includes(activeCategory); // Example filter by tech stack tag
  });

  return (
    <section
      id="projects"
      className="py-16 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/10"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium text-primary mb-4"
          >
            <Layers size={18} />
            <span>Projects</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
          >
            My Recent Work
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={
              isInView ? { opacity: 1, width: 120 } : { opacity: 0, width: 0 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-primary rounded-full"
          />
        </div>

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full mb-12"
        >
          <div className="flex justify-center mb-10">
            <TabsList className="inline-flex h-auto items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground flex-wrap gap-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/80"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map(
                (
                  project: Project,
                  index: number // Use interface and add index back
                ) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group overflow-hidden h-full transition-all duration-300 hover:shadow-lg border border-muted/80 hover:border-primary/20">
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2">
          {project.techStack.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-black/60 text-white backdrop-blur-sm text-xs py-1"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-6 md:p-8 flex flex-col h-[calc(100%-14rem)]">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-6 flex-grow text-sm md:text-base">
          {project.description}
        </p>
        <div className="flex gap-4 mt-auto pt-4 border-t border-muted/40">
          <Button
            size="sm"
            variant="outline"
            asChild
            disabled={!project.githubLink}
            className="rounded-md"
          >
            <a
              href={project.githubLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${
                !project.githubLink ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          </Button>
          {project.liveLink && (
            <Button size="sm" asChild className="rounded-md">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                <span>Demo</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
