import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { StartYourProject } from './StartYourProject';
import { getServices, Service } from '../../lib/firestore';
import {
    Globe, Smartphone, Palette, Settings, Bot, Cloud, Shield,
    BarChart3, ShoppingCart, Code, Rocket, Lightbulb, Zap, Database,
    ArrowRight, Sparkles, ChevronLeft, ChevronRight, X
} from 'lucide-react';

// Icon map matching admin panel
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    globe: Globe,
    smartphone: Smartphone,
    code: Code,
    palette: Palette,
    settings: Settings,
    bot: Bot,
    cloud: Cloud,
    shield: Shield,
    barchart: BarChart3,
    cart: ShoppingCart,
    rocket: Rocket,
    lightbulb: Lightbulb,
    zap: Zap,
    database: Database,
};

// Service color schemes
const serviceColors: Record<string, { gradient: string; glow: string; border: string; text: string }> = {
    globe: { gradient: 'from-blue-500 to-cyan-500', glow: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    smartphone: { gradient: 'from-purple-500 to-pink-500', glow: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    database: { gradient: 'from-cyan-500 to-teal-500', glow: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    palette: { gradient: 'from-pink-500 to-rose-500', glow: 'bg-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-400' },
    bot: { gradient: 'from-amber-500 to-orange-500', glow: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    cloud: { gradient: 'from-indigo-500 to-purple-500', glow: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-400' },
    rocket: { gradient: 'from-orange-500 to-red-500', glow: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    shield: { gradient: 'from-emerald-500 to-green-500', glow: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    code: { gradient: 'from-violet-500 to-purple-500', glow: 'bg-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-400' },
    settings: { gradient: 'from-gray-500 to-slate-500', glow: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' },
    barchart: { gradient: 'from-green-500 to-emerald-500', glow: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
    cart: { gradient: 'from-yellow-500 to-amber-500', glow: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    lightbulb: { gradient: 'from-yellow-400 to-orange-400', glow: 'bg-yellow-400/20', border: 'border-yellow-400/30', text: 'text-yellow-400' },
    zap: { gradient: 'from-yellow-500 to-amber-500', glow: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
};

function getColorScheme(iconKey?: string) {
    return serviceColors[iconKey || 'settings'] || serviceColors.settings;
}

// Render service icon from key
function ServiceIcon({ iconKey, className = "w-6 h-6" }: { iconKey?: string; className?: string }) {
    const IconComponent = iconMap[iconKey || 'settings'] || Settings;
    return <IconComponent className={className} />;
}

// --- Fallback Data for the Service Cards ---
const defaultServices: Partial<Service>[] = [
    {
        title: "Web Development",
        description: "Custom web applications with stunning UI/UX, responsive design, and seamless functionality across all devices.",
        features: ["React", "Next.js", "TypeScript", "Node.js"],
        icon: "globe"
    },
    {
        title: "Mobile App Development",
        description: "Native and cross-platform mobile applications with beautiful interfaces and robust performance.",
        features: ["React Native", "Flutter", "iOS/Swift", "Android/Kotlin"],
        icon: "smartphone"
    },
    {
        title: "Backend Development",
        description: "Secure, scalable, and high-performance backend systems that power your applications.",
        features: ["MongoDB", "Express", "API Design", "SQL / MySQL"],
        icon: "database"
    },
    {
        title: "UI/UX Design",
        description: "User-centered designs that combine aesthetics with functionality to create engaging digital experiences.",
        features: ["Figma", "Prototyping", "User Testing", "Design Systems"],
        icon: "palette"
    },
    {
        title: "AI Automation",
        description: "Automate workflows for websites, web apps, and mobile applications with powerful AI-driven solutions.",
        features: ["N8N Workflows", "Playwright", "Process Automation"],
        icon: "bot"
    },
    {
        title: "Cloud & DevOps",
        description: "Intelligent cloud infrastructure and deployment solutions for scalable applications.",
        features: ["AWS", "Docker", "CI/CD", "Kubernetes"],
        icon: "cloud"
    },
    {
        title: "Custom Solutions & Micro SaaS",
        description: "Tailored CRM systems, Micro-SaaS products, and bespoke software built for your unique business needs.",
        features: ["Custom CRM", "SaaS Development", "Scalable Architecture"],
        icon: "rocket"
    }
];

// 3D Tilt Card Component
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        setTransform({ rotateX: -rotateX, rotateY: -rotateY });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
        setIsHovering(false);
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

// Service Card Component
function ServiceCard({
    service,
    index,
    onSelect
}: {
    service: Partial<Service>;
    index: number;
    onSelect: (service: Partial<Service>) => void;
}) {
    const colors = getColorScheme(service.icon);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
        >
            <TiltCard className="h-full">
                <div
                    className={`relative h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-500`}
                    onClick={() => onSelect(service)}
                >
                    {/* Animated Background Glow */}
                    <motion.div
                        className={`absolute -top-20 -right-20 w-40 h-40 ${colors.glow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <motion.div
                        className={`absolute -bottom-20 -left-20 w-40 h-40 ${colors.glow} rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                    />

                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    <div className="relative z-10">
                        {/* Icon Container */}
                        <motion.div
                            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Icon Glow Ring */}
                            <div className={`absolute inset-0 rounded-2xl ${colors.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <ServiceIcon iconKey={service.icon} className="w-8 h-8 text-white relative z-10" />
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                            {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
                            {service.description}
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {service.features?.slice(0, 3).map((feature, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
                                    className={`px-3 py-1 text-xs rounded-full bg-white/5 ${colors.border} border ${colors.text} transition-all duration-300 group-hover:bg-white/10`}
                                >
                                    {feature}
                                </motion.span>
                            ))}
                        </div>

                        {/* Learn More Link */}
                        <div className={`flex items-center gap-2 ${colors.text} text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Card Number */}
                    <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}

// Service Detail Modal
function ServiceDetailModal({
    service,
    isOpen,
    onClose,
    onRequestService
}: {
    service: Partial<Service> | null;
    isOpen: boolean;
    onClose: () => void;
    onRequestService: () => void;
}) {
    if (!service) return null;
    const colors = getColorScheme(service.icon);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 ${colors.glow} rounded-full blur-[80px] opacity-50`} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="relative p-8">
                            {/* Icon */}
                            <motion.div
                                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 shadow-2xl`}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 0.8 }}
                            >
                                <ServiceIcon iconKey={service.icon} className="w-10 h-10 text-white" />
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            {/* Features */}
                            <div className="mb-8">
                                <h4 className="text-sm font-mono text-gray-500 uppercase mb-3">Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {service.features?.map((feature, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`px-4 py-2 text-sm rounded-xl bg-white/5 ${colors.border} border ${colors.text}`}
                                        >
                                            {feature}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    onClose();
                                    onRequestService();
                                }}
                                className={`w-full py-4 px-6 bg-gradient-to-r ${colors.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                            >
                                Request This Service
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- The Main Services Component ---
export default function Services() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [services, setServices] = useState<Partial<Service>[]>(defaultServices);
    const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        getServices().then((data) => {
            if (data && data.length > 0) {
                setServices(data);
            }
        });
    }, []);

    // Mobile scroll handler
    const scrollToCard = (index: number) => {
        if (scrollRef.current) {
            const cardWidth = 300;
            const gap = 24;
            scrollRef.current.scrollTo({
                left: index * (cardWidth + gap),
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    return (
        <section id="services" className="py-24 relative overflow-hidden" ref={containerRef}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-orange-500/40 rounded-full"
                        initial={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, "-30%"],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-mono mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        WHAT WE OFFER
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Development</span> Services
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Comprehensive software development and AI solutions tailored to your business needs, delivering exceptional quality and innovative technology.
                    </p>
                </motion.div>

                {/* Desktop Grid */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            index={index}
                            onSelect={setSelectedService}
                        />
                    ))}
                </div>

                {/* Mobile Horizontal Scroll */}
                <div className="lg:hidden">
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToCard(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                        ? 'w-8 bg-orange-500'
                                        : 'bg-white/20 hover:bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Scrollable Cards */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onScroll={(e) => {
                            const scrollLeft = e.currentTarget.scrollLeft;
                            const cardWidth = 300 + 24;
                            setActiveIndex(Math.round(scrollLeft / cardWidth));
                        }}
                    >
                        {services.map((service, index) => (
                            <div key={index} className="flex-shrink-0 w-[300px] snap-center">
                                <ServiceCard
                                    service={service}
                                    index={index}
                                    onSelect={setSelectedService}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Swipe Hint */}
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: 3 }}
                        className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Swipe to explore
                        <ChevronRight className="w-4 h-4" />
                    </motion.div>
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFormVisible(true)}
                        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Your Project
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Service Detail Modal */}
            <ServiceDetailModal
                service={selectedService}
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                onRequestService={() => setIsFormVisible(true)}
            />

            {/* Request Service Modal */}
            <StartYourProject
                isOpen={isFormVisible}
                closeModal={() => setIsFormVisible(false)}
                title="Request Our Service"
                subtitle="Tell us about your requirements"
            />
        </section>
    );
}
