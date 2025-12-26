import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { StartYourProject } from './StartYourProject';
import { getHeroContent, HeroContent } from '../../lib/firestore';

// --- Self-Contained Button Component ---
const Button = ({ children, className = '', ...props }: any) => {
    return (
        <button
            className={`rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Default content (fallback)
const defaultHero = {
    badge: "Next-Gen Software Solutions",
    headline: "Transform Ideas Into Digital Reality",
    subheadline: "We engineer premium web applications, immersive 3D experiences, and scalable software that defines the future of your business.",
    primaryBtn: { text: "Start Your Project", action: "form" },
    secondaryBtn: { text: "View Our Work", action: "#work" },
};

// --- Hero Section Component ---
export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [content, setContent] = useState(defaultHero);

    // Fetch content from Firestore
    useEffect(() => {
        getHeroContent().then((data) => {
            if (data) setContent(data);
        });
    }, []);

    // Re-trigger animation when hero section comes into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setAnimationKey(prev => prev + 1);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // --- Smooth Scroll Handler ---
    const handleScrollTo = (sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const glossaryButtonClass = "px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/10 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(255,165,0,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300 group active:scale-95";

    return (
        <div ref={heroRef} id="Hero" className="relative min-h-screen w-full overflow-hidden bg-transparent flex flex-col items-center justify-center pt-20">
            {/* Vignette for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none z-[0]" />

            {/* Grid Overlay (Retained for style) */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30" />


            {/* --- Main Content --- */}
            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-gray-300 text-sm font-medium tracking-wide">{content.badge}</span>
                </div>

                {/* Headline */}
                <h1 className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
                    <span className="block text-white">{content.headline.split(' ').slice(0, -2).join(' ')}</span>
                    <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                        {content.headline.split(' ').slice(-2).join(' ')}
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed animate-fade-in-up delay-200">
                    {content.subheadline}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                    <div className="relative p-[2px] rounded-full overflow-hidden btn-glow-container">
                        <div key={`glow1-${animationKey}`} className="absolute inset-[-100%] btn-glow-spinner" />
                        <Button
                            className={`${glossaryButtonClass} relative z-10 bg-black`}
                            onClick={() => setIsFormVisible(true)}
                        >
                            Start Your Project
                        </Button>
                    </div>
                    <div className="relative p-[2px] rounded-full overflow-hidden btn-glow-container">
                        <div key={`glow2-${animationKey}`} className="absolute inset-[-100%] btn-glow-spinner" style={{ animationDelay: '0.3s' }} />
                        <Button
                            className={`${glossaryButtonClass} relative z-10 bg-black`}
                            onClick={() => handleScrollTo('#work')}
                        >
                            View Our Work
                        </Button>
                    </div>
                </div>

                {/* Border Glow Animation */}
                <style>{`
                    .btn-glow-spinner {
                        background: conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            transparent 300deg,
                            #F97316 330deg,
                            #FB923C 345deg,
                            #F97316 360deg
                        );
                        animation: spin-glow 2s linear forwards;
                    }
                    
                    @keyframes spin-glow {
                        0% { 
                            transform: rotate(0deg);
                            opacity: 1;
                        }
                        85% {
                            transform: rotate(360deg);
                            opacity: 1;
                        }
                        100% { 
                            transform: rotate(360deg);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>

            {/* --- Scroll Indicator --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            <StartYourProject isOpen={isFormVisible} closeModal={() => setIsFormVisible(false)} />
        </div>
    );
}
