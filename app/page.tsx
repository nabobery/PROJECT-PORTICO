import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import TechRadar from "@/components/sections/tech-radar";
// import Testimonials from '@/components/sections/testimonials';
// import Blog from '@/components/sections/blog';
import Process from "@/components/sections/process";
// import Achievements from '@/components/sections/achievements';
import Contact from "@/components/sections/contact";
import ScrollProgress from "@/components/ui/scroll-progress";

export default function Home() {
  return (
    <div className="relative">
      <ScrollProgress />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <TechRadar />
      {/* <Testimonials /> */}
      {/* <Blog /> */}
      <Process />
      {/* <Achievements /> */}
      <Contact />
    </div>
  );
}
