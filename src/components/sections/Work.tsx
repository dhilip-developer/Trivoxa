import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Cloudkitchen from "@/Assets/CloudKItchen.png"
import social from "@/Assets/SocialWellfare.png"
import MountTennaProject from "@/Assets/MountTennaProject.png"

const projects = [
  {
    title: "Cloud kitchen Food Ordering",
    description: "Interactive financial analytics platform with real-time data visualization and AI-powered insights.",
    image: Cloudkitchen,
    category: "Web App",
    tags: ["React", "TypeScript", "Node.js"],
    url: "https://www.a1cookinghub.com/"
  },
  {
    title: "Tourister Website",
    description: "A WordPress-based tourist website offering destination guides, hotel bookings, travel packages, and event updates for hassle-free trip planning.",
    image:MountTennaProject ,
    category: "Web App",
    tags: ["Wordpress Website"],
    url: "https://mountteenamunnarvilla.com/"
  },
  {
    title: "Social Wellfare ",
    description: "A WordPress-based social welfare website dedicated to promoting community support, awareness programs, and welfare initiatives for a better society.",
    image: social,
    category: "Web App",
    tags: ["Wordpress Website"],
    url: "http://www.prwdfngo.com"
  },
  {
    title: "AI Automation & Micro SAAS Product",
    description: "Leverage the power of artificial intelligence and machine learning to make your applications smarter.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop",
    category: "AI Tool",
    tags: ["N8N", "Play wright", "Automation"],
    url: "#"
  },
  {
    title: "E-commerce",
    description: "E-commerce platform with AI-powered product recommendations, social shopping features, and seamless checkout.",
    image: "https://f.hellowork.com/blogdumoderateur/2023/05/ECommerce-Fevad-2023-.jpg",
    category: "E-commerce",
    tags: ["React.js", "Wordpress", "MongoDB", "Payment Gateway"],
    url: "#"
  },
  {
    title: "Custom Solution",
    description: "A custom CRM solution built with PHP, SQL, and modern frontend technologies to manage clients, sales, and business operations effectively.",
    image: "https://www.openteqgroup.com/assets/uploads/admin_images/ab2c82755aacd7f32b6fd1d004c04daf.jpg",
    category: " Web App",
    tags: ["CRM Applications " , "Php ", " SQL" , "react"],
    url: "#"
  }
];

const categories = ["All", "Web App", "Mobile App", "Blockchain", "E-commerce", "AI Tool", "IoT Platform"];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="work" className="py-24 bg-gradient-to-b from-tech-dark to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-orange/5 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-neon-cyan/5 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
              className={`rounded-full ${
                activeCategory === category 
                  ? "bg-orange hover:bg-orange-light text-black" 
                  : "border-gray-700 text-gray-300 hover:border-orange hover:text-orange"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project, index) => (
            <Card 
              key={index}
              className="bg-tech-dark border-gray-800 hover:border-orange/50 transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative h-40 sm:h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className={`w-full h-full object-cover transition-all duration-700 ${hoveredProject === index ? 'scale-110 blur-sm' : ''}`}
                />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center transition-opacity duration-300 ${hoveredProject === index ? 'opacity-100' : 'opacity-0'}`}>
                  {/* FIX: Use an anchor tag with the project URL */}
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-orange hover:bg-orange-light text-black font-medium text-xs md:text-sm px-3 py-1 md:px-6 md:py-3">
                      View Project
                    </Button>
                  </a>
                </div>
                
                {/* Category badge */}
                <Badge className="absolute top-2 left-2 text-xs md:text-sm bg-black/70 text-orange border-none">
                  {project.category}
                </Badge>
              </div>
              
              <CardContent className="p-4 md:p-5">
                <h3 className="text-sm md:text-xl font-bold text-white mb-1 group-hover:text-orange-light transition-colors">
                  {project.title}
                </h3>
                <p className="hidden md:block text-gray-400 text-xs md:text-sm mb-2 md:mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {project.tags.map((tag, i) => (
                    <div key={i} className="text-xs px-2 py-1 bg-black/70 border border-gray-800 rounded-full text-gray-300">
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 md:mt-12 text-center">
          <Button className="bg-transparent border border-orange text-orange hover:bg-orange hover:text-black px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
