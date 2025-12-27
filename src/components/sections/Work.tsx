import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects, Project } from "../../lib/firestore";
import { ExternalLink, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Cloudkitchen from "@/Assets/CloudKItchen.png"
import social from "@/Assets/SocialWellfare.png"
import MountTennaProject from "@/Assets/MountTennaProject.png"

// Color schemes for accent colors
const colorSchemes: Record<string, { border: string; badge: string; glow: string; text: string }> = {
  blue: { border: 'hover:border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', glow: 'group-hover:shadow-blue-500/20', text: 'text-blue-400' },
  purple: { border: 'hover:border-purple-500/50', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', glow: 'group-hover:shadow-purple-500/20', text: 'text-purple-400' },
  cyan: { border: 'hover:border-cyan-500/50', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', glow: 'group-hover:shadow-cyan-500/20', text: 'text-cyan-400' },
  pink: { border: 'hover:border-pink-500/50', badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30', glow: 'group-hover:shadow-pink-500/20', text: 'text-pink-400' },
  orange: { border: 'hover:border-orange-500/50', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', glow: 'group-hover:shadow-orange-500/20', text: 'text-orange-400' },
  green: { border: 'hover:border-green-500/50', badge: 'bg-green-500/20 text-green-400 border-green-500/30', glow: 'group-hover:shadow-green-500/20', text: 'text-green-400' },
};

// Fallback projects (used if Firestore is empty)
const defaultProjects: Partial<Project>[] = [
  {
    title: "Cloud kitchen Food Ordering",
    description: "Interactive financial analytics platform with real-time data visualization and AI-powered insights.",
    imageUrl: Cloudkitchen,
    category: "Web App",
    tags: ["React", "TypeScript", "Node.js"],
    link: "https://www.a1cookinghub.com/",
    accentColor: "blue",
    featured: true,
  },
  {
    title: "Tourister Website",
    description: "A WordPress-based tourist website offering destination guides, hotel bookings, travel packages, and event updates for hassle-free trip planning.",
    imageUrl: MountTennaProject,
    category: "Web App",
    tags: ["Wordpress Website"],
    link: "https://mountteenamunnarvilla.com/",
    accentColor: "green",
  },
  {
    title: "Social Wellfare ",
    description: "A WordPress-based social welfare website dedicated to promoting community support, awareness programs, and welfare initiatives for a better society.",
    imageUrl: social,
    category: "Web App",
    tags: ["Wordpress Website"],
    link: "http://www.prwdfngo.com",
    accentColor: "purple",
  },
  {
    title: "AI Automation & Micro SAAS Product",
    description: "Leverage the power of artificial intelligence and machine learning to make your applications smarter.",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop",
    category: "AI Tool",
    tags: ["N8N", "Play wright", "Automation"],
    link: "#",
    accentColor: "orange",
    featured: true,
  },
  {
    title: "E-commerce",
    description: "E-commerce platform with AI-powered product recommendations, social shopping features, and seamless checkout.",
    imageUrl: "https://f.hellowork.com/blogdumoderateur/2023/05/ECommerce-Fevad-2023-.jpg",
    category: "E-commerce",
    tags: ["React.js", "Wordpress", "MongoDB", "Payment Gateway"],
    link: "#",
    accentColor: "cyan",
  },
  {
    title: "Custom Solution",
    description: "A custom CRM solution built with PHP, SQL, and modern frontend technologies to manage clients, sales, and business operations effectively.",
    imageUrl: "https://www.openteqgroup.com/assets/uploads/admin_images/ab2c82755aacd7f32b6fd1d004c04daf.jpg",
    category: "Custom Software",
    tags: ["CRM Applications ", "Php ", " SQL", "react"],
    link: "#",
    accentColor: "pink",
  }
];

const categories = ["All", "Web App", "E-commerce", "AI Tool", "Custom Software"];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Partial<Project>[]>(defaultProjects);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Fetch projects from Firestore
  useEffect(() => {
    getProjects().then((data) => {
      if (data && data.length > 0) {
        setProjects(data as any[]);
      }
    });
  }, []);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  // Sort: featured projects first
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const getColorScheme = (color?: string) => colorSchemes[color || 'orange'] || colorSchemes.orange;

  return (
    <section id="work" className="py-24 bg-transparent relative overflow-hidden" ref={containerRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-mono mb-4"
          >
            <Sparkles className="w-4 h-4" />
            PORTFOLIO
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of my best work across various industries and technologies, demonstrating expertise in creating innovative digital solutions.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full transition-all ${activeCategory === category
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                : "bg-black/30 border-white/10 text-gray-300 hover:border-purple-500/50 hover:text-white"
                }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project, index) => {
            const colors = getColorScheme(project.accentColor);
            const isFeatured = project.featured;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={isFeatured ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Card
                  className={`relative bg-black/40 backdrop-blur-xl border-white/10 ${colors.border} transition-all duration-500 overflow-hidden group hover:shadow-xl ${colors.glow} cursor-pointer h-full`}
                  onMouseEnter={() => setHoveredProject(index)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white text-xs font-medium backdrop-blur-sm">
                      <Star className="w-3 h-3" fill="currentColor" />
                      Featured
                    </div>
                  )}

                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProject === index ? 'scale-110 blur-sm' : ''}`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Hover Overlay with Button */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hoveredProject === index ? 'opacity-100' : 'opacity-0'}`}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full flex items-center gap-2 shadow-lg`}
                        >
                          View Project
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      </a>
                    </div>

                    {/* Category badge */}
                    <Badge className={`absolute top-3 left-3 text-xs border ${colors.badge} backdrop-blur-md`}>
                      {project.category}
                    </Badge>
                  </div>

                  <CardContent className="p-5 relative">
                    {/* Accent Line */}
                    <div className={`absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`} />

                    <h3 className={`text-lg font-bold text-white mb-2 group-hover:${colors.text} transition-colors`}>
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className={`text-xs px-3 py-1 rounded-full border ${colors.badge} transition-all`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button className="bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-full text-base transition-all hover:border-purple-500">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
