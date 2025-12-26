import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects, Project } from "../../lib/firestore";
import Cloudkitchen from "@/Assets/CloudKItchen.png"
import social from "@/Assets/SocialWellfare.png"
import MountTennaProject from "@/Assets/MountTennaProject.png"

// Fallback projects (used if Firestore is empty)
const defaultProjects = [
  {
    title: "Cloud kitchen Food Ordering",
    description: "Interactive financial analytics platform with real-time data visualization and AI-powered insights.",
    imageUrl: Cloudkitchen,
    category: "Web App",
    tags: ["React", "TypeScript", "Node.js"],
    link: "https://www.a1cookinghub.com/"
  },
  {
    title: "Tourister Website",
    description: "A WordPress-based tourist website offering destination guides, hotel bookings, travel packages, and event updates for hassle-free trip planning.",
    imageUrl: MountTennaProject,
    category: "Web App",
    tags: ["Wordpress Website"],
    link: "https://mountteenamunnarvilla.com/"
  },
  {
    title: "Social Wellfare ",
    description: "A WordPress-based social welfare website dedicated to promoting community support, awareness programs, and welfare initiatives for a better society.",
    imageUrl: social,
    category: "Web App",
    tags: ["Wordpress Website"],
    link: "http://www.prwdfngo.com"
  },
  {
    title: "AI Automation & Micro SAAS Product",
    description: "Leverage the power of artificial intelligence and machine learning to make your applications smarter.",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop",
    category: "AI Tool",
    tags: ["N8N", "Play wright", "Automation"],
    link: "#"
  },
  {
    title: "E-commerce",
    description: "E-commerce platform with AI-powered product recommendations, social shopping features, and seamless checkout.",
    imageUrl: "https://f.hellowork.com/blogdumoderateur/2023/05/ECommerce-Fevad-2023-.jpg",
    category: "E-commerce",
    tags: ["React.js", "Wordpress", "MongoDB", "Payment Gateway"],
    link: "#"
  },
  {
    title: "Custom Solution",
    description: "A custom CRM solution built with PHP, SQL, and modern frontend technologies to manage clients, sales, and business operations effectively.",
    imageUrl: "https://www.openteqgroup.com/assets/uploads/admin_images/ab2c82755aacd7f32b6fd1d004c04daf.jpg",
    category: "Custom Software",
    tags: ["CRM Applications ", "Php ", " SQL", "react"],
    link: "#"
  }
];

const categories = ["All", "Web App", "E-commerce", "AI Tool", "Custom Software"];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>(defaultProjects);

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

  return (
    <section id="work" className="py-24 bg-transparent relative">

      <div className="container mx-auto px-4 relative z-10">
        {/* Glass Card Container */}
        <div className="rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 p-4 md:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-4">
              Portfolio
            </div>
            <h2 className="text-4xl font-bold mb-4 orange-glow">
              <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-lg text-gray-300">
              A showcase of my best work across various industries and technologies, demonstrating expertise in creating innovative digital solutions.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full ${activeCategory === category
                  ? "bg-orange hover:bg-orange-light text-black"
                  : "bg-black/30 border-white/10 text-gray-300 hover:border-orange hover:text-white"
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects grid - Single column on mobile for better readability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project, index) => (
              <Card
                key={index}
                className="bg-black/50 border-white/10 hover:border-orange/50 transition-all duration-300 overflow-hidden group backdrop-blur-sm"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredProject === index ? 'scale-110 blur-sm' : ''}`}
                  />

                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center transition-opacity duration-300 ${hoveredProject === index ? 'opacity-100' : 'opacity-0'}`}>
                    {/* FIX: Use an anchor tag with the project URL */}
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-orange hover:bg-orange-light text-black font-medium text-xs md:text-sm px-3 py-1 md:px-6 md:py-3 rounded-full">
                        View Project
                      </Button>
                    </a>
                  </div>

                  {/* Category badge */}
                  <Badge className="absolute top-2 left-2 text-xs md:text-sm bg-black/70 text-orange border-none backdrop-blur-md">
                    {project.category}
                  </Badge>
                </div>

                <CardContent className="p-4 md:p-5">
                  <h3 className="text-sm md:text-xl font-bold text-white mb-1 group-hover:text-orange-light transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {project.tags.map((tag, i) => (
                      <div key={i} className="text-xs px-2 py-1 bg-black/60 border border-white/10 rounded-full text-gray-300">
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <Button className="bg-transparent border border-orange text-orange hover:bg-orange/10 px-6 py-3 rounded-full text-base transition-all">
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
