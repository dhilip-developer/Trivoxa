import React, { useState, useEffect } from 'react';
import { StartYourProject } from './StartYourProject';
import { getServices, Service } from '../../lib/firestore';
import {
    Globe, Smartphone, Palette, Settings, Bot, Cloud, Shield,
    BarChart3, ShoppingCart, Code, Rocket, Lightbulb, Zap, Database
} from 'lucide-react';

// Icon map matching admin panel (same as Contact page pattern)
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

// Render service icon from key
function ServiceIcon({ iconKey, className = "w-6 h-6" }: { iconKey?: string; className?: string }) {
    const IconComponent = iconMap[iconKey || 'settings'] || Settings;
    return <IconComponent className={className} />;
}

// --- Placeholder for Shadcn/ui components ---
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={`p-4 md:p-6 border rounded-lg ${className}`}>{children}</div>;
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-2 md:mb-4">{children}</div>;
const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => <h3 className={`font-semibold text-base md:text-lg ${className}`}>{children}</h3>;
const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => <p className={`text-xs md:text-sm text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const Button = ({ children, className = '', ...props }: any) => {
    const baseClasses = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
    return (
        <button className={`${baseClasses} ${className}`} {...props}>
            {children}
        </button>
    );
};

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

// --- The Main Services Component ---
export default function Services() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [services, setServices] = useState<Partial<Service>[]>(defaultServices);

    useEffect(() => {
        getServices().then((data) => {
            if (data && data.length > 0) {
                setServices(data);
            }
        });
    }, []);

    return (
        <section id="services" className="py-16 md:py-24 bg-transparent relative">
            <div className="container mx-auto px-4">
                {/* Glass Card Container for the Page Section */}
                <div className="rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 p-4 md:p-12 shadow-2xl">
                    <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
                        <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-4">
                            Services
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 orange-glow">
                            <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
                                Expert Development & AI Services
                            </span>
                        </h2>
                        <p className="text-sm md:text-lg text-gray-300">
                            Comprehensive software development and AI solutions tailored to your business needs, delivering exceptional quality and innovative technology.
                        </p>
                    </div>

                    {/* Service Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {services.map((service, index) => (
                            <Card key={index} className="bg-black/50 backdrop-blur-md border-white/10 hover:border-orange/50 transition-all hover:shadow-lg hover:shadow-orange/10 hover:-translate-y-1 overflow-hidden group">
                                <CardHeader>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 flex items-center justify-center mb-2 md:mb-4 group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all">
                                        <ServiceIcon iconKey={service.icon} className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                                    </div>
                                    <CardTitle className="text-base md:text-xl text-orange-light">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 text-xs md:text-sm line-clamp-2">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                                        {service.features?.slice(0, 3).map((feature, i) => (
                                            <div key={i} className="px-2 py-0.5 text-xs bg-black/60 border border-white/10 rounded-full text-gray-300">
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* The 'Start Your Project' Button */}
                    <div className="flex justify-center mt-8 md:mt-12">
                        <Button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-orange/20 hover:-translate-y-0.5 transition-all duration-300"
                            onClick={() => setIsFormVisible(true)}
                        >
                            Service Request
                        </Button>
                    </div>
                </div>
            </div>

            {/* The modal component, controlled by state */}
            <StartYourProject
                isOpen={isFormVisible}
                closeModal={() => setIsFormVisible(false)}
                title="Request Our Service"
                subtitle="Tell us about your requirements"
            />
        </section>
    );
}
