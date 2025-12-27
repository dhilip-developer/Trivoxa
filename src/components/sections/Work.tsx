import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { getProjects, Project } from "../../lib/firestore";
import { ExternalLink, Star, Sparkles, ArrowRight, X, ChevronRight, Layers, Zap } from "lucide-react";
import Cloudkitchen from "@/Assets/CloudKItchen.png"
import social from "@/Assets/SocialWellfare.png"
import MountTennaProject from "@/Assets/MountTennaProject.png"

// Color schemes for accent colors
const colorSchemes: Record<string, {
  gradient: string;
  border: string;
  badge: string;
  glow: string;
  text: string;
  bg: string;
  shadow: string;
}> = {
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    glow: 'shadow-blue-500/25',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-blue-500/20'
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    glow: 'shadow-purple-500/25',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-purple-500/20'
  },
  cyan: {
    gradient: 'from-cyan-500 to-teal-500',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    glow: 'shadow-cyan-500/25',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-cyan-500/20'
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    border: 'border-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    glow: 'shadow-pink-500/25',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    shadow: 'shadow-pink-500/20'
  },
  orange: {
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    glow: 'shadow-orange-500/25',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    shadow: 'shadow-orange-500/20'
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    glow: 'shadow-green-500/25',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    shadow: 'shadow-green-500/20'
  },
  amber: {
    gradient: 'from-amber-500 to-yellow-500',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    glow: 'shadow-amber-500/25',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    shadow: 'shadow-amber-500/20'
  },
  indigo: {
    gradient: 'from-indigo-500 to-purple-500',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    glow: 'shadow-indigo-500/25',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    shadow: 'shadow-indigo-500/20'
  },
  violet: {
    gradient: 'from-violet-500 to-purple-500',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    glow: 'shadow-violet-500/25',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    shadow: 'shadow-violet-500/20'
  },
  rose: {
    gradient: 'from-rose-500 to-pink-500',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    glow: 'shadow-rose-500/25',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    shadow: 'shadow-rose-500/20'
  },
  teal: {
    gradient: 'from-teal-500 to-cyan-500',
    border: 'border-teal-500/30',
    badge: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    glow: 'shadow-teal-500/25',
    text: 'text-teal-400',
    bg: 'bg-teal-500/10',
    shadow: 'shadow-teal-500/20'
  },
  red: {
    gradient: 'from-red-500 to-rose-500',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    glow: 'shadow-red-500/25',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    shadow: 'shadow-red-500/20'
  },
};

// Fallback projects
const defaultProjects: Partial<Project>[] = [
  {
    title: "Cloud kitchen Food Ordering",
    description: "Interactive food ordering platform with real-time order tracking, menu management, and seamless payment integration for modern cloud kitchens.",
    imageUrl: Cloudkitchen,
    category: "Web App",
    tags: ["React", "TypeScript", "Node.js", "Firebase"],
    link: "https://www.a1cookinghub.com/",
    accentColor: "blue",
    featured: true,
  },
  {
    title: "Tourister Website",
    description: "A WordPress-based tourist website offering destination guides, hotel bookings, travel packages, and event updates for hassle-free trip planning.",
    imageUrl: MountTennaProject,
    category: "Web App",
    tags: ["Wordpress", "SEO", "Responsive"],
    link: "https://mountteenamunnarvilla.com/",
    accentColor: "green",
  },
  {
    title: "Social Wellfare",
    description: "A WordPress-based social welfare website dedicated to promoting community support, awareness programs, and welfare initiatives for a better society.",
    imageUrl: social,
    category: "Web App",
    tags: ["Wordpress", "NGO", "Community"],
    link: "http://www.prwdfngo.com",
    accentColor: "purple",
  },
  {
    title: "AI Automation & Micro SAAS",
    description: "Leverage the power of artificial intelligence and automation to streamline workflows and boost productivity with custom micro-SaaS solutions.",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop",
    category: "AI Tool",
    tags: ["N8N", "Playwright", "Automation", "AI"],
    link: "#",
    accentColor: "orange",
    featured: true,
  },
  {
    title: "E-commerce Platform",
    description: "Full-featured e-commerce platform with AI-powered product recommendations, social shopping features, and seamless checkout experience.",
    imageUrl: "https://f.hellowork.com/blogdumoderateur/2023/05/ECommerce-Fevad-2023-.jpg",
    category: "E-commerce",
    tags: ["React.js", "MongoDB", "Stripe", "Redux"],
    link: "#",
    accentColor: "cyan",
  },
  {
    title: "Custom CRM Solution",
    description: "A custom CRM solution built with modern technologies to manage clients, sales pipelines, and business operations effectively.",
    imageUrl: "https://www.openteqgroup.com/assets/uploads/admin_images/ab2c82755aacd7f32b6fd1d004c04daf.jpg",
    category: "Custom Software",
    tags: ["PHP", "MySQL", "React", "API"],
    link: "#",
    accentColor: "pink",
  }
];

const categories = ["All", "Web App", "E-commerce", "AI Tool", "Custom Software"];

// 3D Tilt Card Component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (centerX - e.clientX) / 20;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  index,
  isFeatured,
  onOpenModal
}: {
  project: Partial<Project>;
  index: number;
  isFeatured: boolean;
  onOpenModal: (project: Partial<Project>) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const colors = colorSchemes['orange'];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className={isFeatured ? "md:col-span-2 lg:row-span-2" : ""}
    >
      <TiltCard className="h-full">
        <motion.div
          className={`relative h-full bg-black/40 backdrop-blur-xl border ${colors.border} rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:${colors.shadow}`}
          onClick={() => onOpenModal(project)}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated Background Glow */}
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 ${colors.bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 ${colors.bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
          />

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/30">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              Featured
            </div>
          )}

          {/* Image Container */}
          <div className={`relative ${isFeatured ? 'h-64 lg:h-80' : 'h-48 sm:h-56'} overflow-hidden`}>
            <div className="w-full h-full overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

            {/* Category Badge */}
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full border backdrop-blur-md ${colors.badge} text-xs font-medium`}>
              {project.category}
            </div>

            {/* View Button on Hover */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <motion.div
                className={`px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white font-medium rounded-full flex items-center gap-2 shadow-xl`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Accent Line */}
            <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${colors.gradient} to-transparent opacity-50`} />

            <h3 className={`text-xl font-bold text-white mb-2 group-hover:${colors.text} transition-colors duration-300`}>
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags?.slice(0, isFeatured ? 5 : 3).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  className={`text-xs px-3 py-1 rounded-full border ${colors.badge} group-hover:scale-105 transition-transform`}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* View Link */}
            <div
              className={`mt-4 flex items-center gap-2 ${colors.text} text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              <span>View Project</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}

// Project Detail Modal
function ProjectModal({
  project,
  isOpen,
  onClose
}: {
  project: Partial<Project> | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;
  const colors = colorSchemes['orange'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm custom-scrollbar"
          onClick={onClose}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className={`absolute -top-40 -right-40 w-80 h-80 ${colors.bg} rounded-full blur-[100px] opacity-50`} />
              <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${colors.bg} rounded-full blur-[100px] opacity-30`} />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Image */}
              <div className="relative h-64 sm:h-80">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5" fill="currentColor" />
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* Category */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.badge} text-xs font-medium mb-4`}>
                  <Layers className="w-3.5 h-3.5" />
                  {project.category}
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{project.description}</p>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-mono text-gray-500 uppercase mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, i) => (
                      <span key={i} className={`text-sm px-4 py-2 rounded-full border ${colors.badge}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${colors.gradient} text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <Zap className="w-5 h-5" />
                  View Live Project
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Partial<Project>[]>(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<Partial<Project> | null>(null);
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

  return (
    <section id="work" className="py-24 bg-transparent relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <motion.div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 text-sm font-mono mb-6"
          >
            <Sparkles className="w-4 h-4" />
            PORTFOLIO
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
              Projects
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A showcase of innovative digital solutions crafted with passion and precision, demonstrating expertise across various technologies.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === category
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50 hover:text-white"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                isFeatured={project.featured || false}
                onOpenModal={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            className="group px-8 py-4 bg-transparent border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 rounded-full text-lg font-medium transition-all flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05, borderColor: "rgba(168, 85, 247, 0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
