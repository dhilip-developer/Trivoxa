"use client"
import { useState, useEffect } from "react"
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// --- CSS for Animations ---
// This CSS is required for the loading animation to work correctly.
const animationStyles = `
@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
.animate-fade-out {
  animation: fade-out 0.5s ease-out forwards;
}

@keyframes logo-scale {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
}
.animate-logo-scale {
  animation: logo-scale 3s ease-in-out infinite;
}

@keyframes corner-glow {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  50% { transform: translate(0, 0) scale(1.5); opacity: 1; }
}
.animate-corner-glow-1 { animation: corner-glow 2s ease-in-out infinite; animation-delay: 0s; }
.animate-corner-glow-2 { animation: corner-glow 2s ease-in-out infinite; animation-delay: 0.3s; }
.animate-corner-glow-3 { animation: corner-glow 2s ease-in-out infinite; animation-delay: 0.6s; }

@keyframes ring-1 {
  0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: rotate(360deg) scale(1.2); opacity: 0; }
}
.animate-ring-1 {
  animation: ring-1 3s ease-in-out infinite;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

@keyframes text-fade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
.animate-text-fade {
  animation: text-fade 2s ease-in-out infinite;
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}
.animate-dot-1 { animation: dot-bounce 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
.animate-dot-2 { animation: dot-bounce 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
.animate-dot-3 { animation: dot-bounce 1.4s infinite ease-in-out both; }
`;


// --- Loading Animation Component ---
interface LoadingAnimationProps {
  onComplete?: () => void
  duration?: number
}

const LoadingAnimation = ({ onComplete, duration = 3000 }: LoadingAnimationProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      // Wait for the fade-out animation to complete before calling onComplete
      setTimeout(() => {
        onComplete?.()
      }, 500)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${isFadingOut ? 'animate-fade-out' : ''}`}>
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="animate-logo-scale relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trivoxa%20Triangle-T4Igp0N8CleyCcUafkEQb6G2rIGwCv.png"
            alt="Trivoxa Logo"
            className="w-24 h-24 object-contain"
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-orange-400 rounded-full blur-sm animate-corner-glow-1 opacity-80"></div>
            <div className="absolute bottom-0 left-0 transform translate-x-1 translate-y-1 w-3 h-3 bg-orange-400 rounded-full blur-sm animate-corner-glow-2 opacity-80"></div>
            <div className="absolute bottom-0 right-0 transform -translate-x-1 translate-y-1 w-3 h-3 bg-orange-400 rounded-full blur-sm animate-corner-glow-3 opacity-80"></div>
          </div>
        </div>
        <div className="absolute inset-0 animate-ring-1 flex items-center justify-center">
          <div className="w-32 h-32 border border-orange-500/30 rounded-full animate-spin-slow"></div>
        </div>
        
      </div>
    </div>
  )
}

// --- Main App Component ---
const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <style>{animationStyles}</style>
        <Toaster />
        {isLoading && <LoadingAnimation onComplete={() => setIsLoading(false)} />}
        {!isLoading && (
          <BrowserRouter>
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
