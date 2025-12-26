import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import ParticleBackground from './components/layout/ParticleBackground';
import { AuthProvider } from './lib/AuthContext';
import {
  AdminLogin,
  AdminLayout,
  Dashboard,
  HeroEditor,
  ServicesEditor,
  ProjectsEditor,
  AboutEditor,
  RequestsEditor,
  FooterEditor,
  ContactEditor,
  LegalPagesEditor,
  TestimonialsEditor,
  FAQEditor,
  SettingsEditor,
} from './pages/Admin';

// Circuit Waves Loading Screen with Framer Motion
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [progress, onComplete]);

  // Generate circuit lines radiating in all directions
  const circuitLines = useMemo(() => {
    const lines = [];
    const count = 48;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const innerRadius = 80;
      const outerRadius = 250 + Math.random() * 150;

      const xStart = 250 + Math.cos(angle) * innerRadius;
      const yStart = 250 + Math.sin(angle) * innerRadius;

      const segments = [];
      let currentX = xStart;
      let currentY = yStart;

      segments.push(`M ${currentX} ${currentY}`);

      // First segment
      const midRadius = innerRadius + (outerRadius - innerRadius) * 0.3;
      currentX = 250 + Math.cos(angle) * midRadius;
      currentY = 250 + Math.sin(angle) * midRadius;
      segments.push(`L ${currentX} ${currentY}`);

      // Bend
      const bendAngle = angle + (Math.random() - 0.5) * 0.8;
      const bendRadius = midRadius + 40;
      currentX = 250 + Math.cos(bendAngle) * bendRadius;
      currentY = 250 + Math.sin(bendAngle) * bendRadius;
      segments.push(`L ${currentX} ${currentY}`);

      // Final segment
      currentX = 250 + Math.cos(bendAngle) * outerRadius;
      currentY = 250 + Math.sin(bendAngle) * outerRadius;
      segments.push(`L ${currentX} ${currentY}`);

      lines.push({
        d: segments.join(" "),
        delay: Math.random() * 0.8,
        duration: 0.8 + Math.random() * 0.8,
        dotX: currentX,
        dotY: currentY
      });
    }
    return lines;
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center overflow-hidden z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
            initial={{
              x: Math.random() * 2000 - 500,
              y: Math.random() * 2000 - 500,
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
        {/* Glow behind logo */}
        <div className="absolute w-80 h-80 bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />

        {/* SVG for Radial Circuit Lines */}
        <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="circuitGradient">
              <stop offset="20%" stopColor="#F97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {circuitLines.map((line, i) => (
            <g key={i} filter="url(#glow)">
              <motion.path
                d={line.d}
                fill="none"
                stroke="url(#circuitGradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: line.duration,
                  repeat: Infinity,
                  delay: line.delay,
                  times: [0, 0.6, 1],
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx={line.dotX}
                cy={line.dotY}
                r="1.5"
                fill="#F97316"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: line.duration,
                  repeat: Infinity,
                  delay: line.delay + (line.duration * 0.5),
                  times: [0, 0.6, 1]
                }}
              />
            </g>
          ))}
        </svg>

        {/* Central Logo Area */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            className="absolute inset-[-20px] border border-orange-500/30 rounded-full blur-[1px]"
            animate={{ rotate: 360, opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trivoxa%20Triangle-T4Igp0N8CleyCcUafkEQb6G2rIGwCv.png"
            alt="Logo"
            className="w-32 h-32 object-contain"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(249, 115, 22, 0.9))'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Minimal Progress Bar Only - No Text */}
    </motion.div>
  );
}

const queryClient = new QueryClient();

// Main App with Public and Admin Routes
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if current URL is admin route
    setIsAdminRoute(window.location.pathname.startsWith('/admin'));
  }, []);

  // Skip loading screen for admin routes
  if (isAdminRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="hero" element={<HeroEditor />} />
                <Route path="services" element={<ServicesEditor />} />
                <Route path="projects" element={<ProjectsEditor />} />
                <Route path="about" element={<AboutEditor />} />
                <Route path="requests" element={<RequestsEditor />} />
                <Route path="footer" element={<FooterEditor />} />
                <Route path="contact" element={<ContactEditor />} />
                <Route path="legal" element={<LegalPagesEditor />} />
                <Route path="testimonials" element={<TestimonialsEditor />} />
                <Route path="faq" element={<FAQEditor />} />
                <Route path="settings" element={<SettingsEditor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ParticleBackground />
        <Toaster />
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        {!isLoading && (
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
