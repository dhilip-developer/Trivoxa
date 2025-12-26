import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, SiteSettings } from "@/lib/firestore";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact"
import FloatingContactButton from "@/components/layout/FloatingContactButton";

interface PageVisibility {
  hero: boolean;
  services: boolean;
  projects: boolean;
  about: boolean;
  testimonials: boolean;
  faq: boolean;
  contact: boolean;
}

const defaultVisibility: PageVisibility = {
  hero: true,
  services: true,
  projects: true,
  about: true,
  testimonials: true,
  faq: true,
  contact: true,
};

export default function Index() {
  const [visibility, setVisibility] = useState<PageVisibility>(defaultVisibility);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch settings for page visibility
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          if (data.pageVisibility) {
            setVisibility({
              ...defaultVisibility,
              ...data.pageVisibility,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();

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
    <div className="min-h-screen bg-transparent text-white">
      <main>
        {visibility.hero && <Hero />}
        {visibility.services && <Services />}
        {visibility.projects && <Work />}
        <Process />
        {visibility.about && <About />}
        {visibility.testimonials && <Testimonials />}
        {visibility.faq && <FAQ />}
        {visibility.contact && <Contact />}
      </main>
      <Footer />
      <FloatingContactButton />
    </div>
  );
}
