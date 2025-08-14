import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedCode, codeExamples } from "@/components/ui/animated-code";
import TechSphere from "@/components/3d/TechSphere";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      // Update custom properties for parallax effect
      heroRef.current.style.setProperty("--mouse-x", `${x}`);
      heroRef.current.style.setProperty("--mouse-y", `${y}`);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden tech-grid"
      style={{
        "--mouse-x": "0.5",
        "--mouse-y": "0.5",
      } as React.CSSProperties}
    >
      {/* Animated background elements */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-orange/10 filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-neon-cyan/5 filter blur-3xl animate-pulse-slow" style={{animationDelay: "1s"}}></div>
      
      {/* Grid overlay for tech effect */}
      <div className="absolute inset-0 pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-20 flex flex-col lg:flex-row items-center">
        <div className="flex-1 lg:pr-8 space-y-8 text-center lg:text-left mb-12 lg:mb-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-4">
            Premium Software Development Services
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight orange-glow">
            <span className="bg-gradient-to-r from-orange-light via-white to-orange-light bg-clip-text text-transparent pb-2 block">
              Transforming Ideas Into
            </span>
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-orange bg-clip-text text-transparent block">
              Digital Excellence
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0">
            Crafting cutting-edge web applications, mobile apps, and custom software solutions that elevate your business. Expert development with stunning user experiences.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-orange hover:bg-orange-light text-black font-medium px-6">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="border-orange hover:bg-orange/10 text-orange-light">
              View Portfolio
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start text-sm text-gray-400 mt-8">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange to-orange-light ring-2 ring-black flex items-center justify-center text-xs font-bold text-black">JS</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-500 ring-2 ring-black flex items-center justify-center text-xs font-bold text-black">R</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-neon-purple ring-2 ring-black flex items-center justify-center text-xs font-bold text-black">TS</div>
            </div>
            <span>+10 Technologies</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            <span>5+ Years Experience</span>
          </div>
        </div>
        
        {/* 3D visualization side */}
        <div className="flex-1 relative">
          <div className="perspective-container relative z-10 w-full max-w-lg mx-auto">
            {/* 3D Tech Sphere */}
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <TechSphere />
            </div>
            
            {/* Floating code snippet */}
            <div className="hover-3d w-full max-w-sm mx-auto mb-8 shadow-xl relative z-30">
              <AnimatedCode 
                codeSnippets={codeExamples.typescript}
                language="typescript"
              />
            </div>
            
            {/* Floating tech badges */}
            <div className="absolute -right-10 top-1/4 w-20 h-20 rounded-xl bg-black/40 backdrop-blur-lg border border-gray-800 shadow-neon flex items-center justify-center p-4 animate-float" style={{ animationDelay: "0.5s" }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-full h-full" />
            </div>
            
            <div className="absolute -left-10 bottom-1/3 w-16 h-16 rounded-xl bg-black/40 backdrop-blur-lg border border-gray-800 shadow-neon-orange flex items-center justify-center p-3 animate-float" style={{ animationDelay: "1.2s" }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-full h-full" />
            </div>
            
            <div className="absolute left-1/4 bottom-0 w-14 h-14 rounded-xl bg-black/40 backdrop-blur-lg border border-gray-800 shadow-neon flex items-center justify-center p-3 animate-float" style={{ animationDelay: "0.8s" }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 animate-pulse-slow">
        <span className="text-sm text-gray-400">Scroll to explore</span>
        <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}