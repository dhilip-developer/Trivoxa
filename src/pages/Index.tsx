import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";

export default function Index() {
  useEffect(() => {
    // Load Three.js from CDN if needed
    if (!document.getElementById('three-js-script')) {
      const script = document.createElement('script');
      script.id = 'three-js-script';
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    // Initialize hover 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.hover-3d').forEach((card: Element) => {
        const htmlElement = card as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        htmlElement.style.setProperty('--rotate-x', `${rotateX}deg`);
        htmlElement.style.setProperty('--rotate-y', `${rotateY}deg`);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <Process />
        <About />
      </main>
      <Footer />
    </div>
  );
}