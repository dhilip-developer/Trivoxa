import React, { useState } from 'react';
import { StartYourProject } from './StartYourProject';

// --- Placeholder for Shadcn/ui components ---
const Card = ({ children, className }) => <div className={`p-4 md:p-6 border rounded-lg ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="mb-2 md:mb-4">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`font-semibold text-base md:text-lg ${className}`}>{children}</h3>;
const CardDescription = ({ children, className }) => <p className={`text-xs md:text-sm text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, className = '', ...props }) => {
    const baseClasses = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
    const finalClassNames = `${baseClasses} ${className}`;
    return (
        <button
            className={finalClassNames}
            {...props}
        >
            {children}
        </button>
    );
};


// --- Data for the Service Cards ---
const services = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
        ),
        title: "Web Development",
        description: "Custom web applications with stunning UI/UX, responsive design, and seamless functionality across all devices.",
        features: ["React","Next.js", "TypeScript", "Node.js"]
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
        ),
        title: "Mobile App Development",
        description: "Native and cross-platform mobile applications with beautiful interfaces and robust performance.",
        features: ["React Native", "Flutter", "iOS/Swift", "Android/Kotlin"]
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
        ),
        title: "Backend Development",
        description: "Secure, scalable, and high-performance backend systems that power your applications.",
        features: [" MongoDB", "Express", "API Design" ,"SQl / MySQL "]
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
        ),
        title: "UI/UX Design",
        description: "User-centered designs that combine aesthetics with functionality to create engaging digital experiences.",
        features: ["Figma", "Prototyping", "User Testing", "Design Systems"]
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: "AI Automation ",
        description: "Leverage the power of artificial intelligence and machine learning to make your applications smarter.",
        features: ["N8N", "Play Wright", "Automation"]
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        title: "Custom Solution & Micro SAAS Product",
        description: "A custom CRM solution built with PHP, SQL, and modern frontend technologies to manage clients, sales, and business operations effectively.",
        features: ["Custom CRM" , "Php ", " SQL"]
    }
];

// --- The Main Services Component ---
export default function Services() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-background to-tech-dark">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-4">
                        Services
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 orange-glow">
                        <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
                            Expert Development Services
                        </span>
                    </h2>
                    <p className="text-sm md:text-lg text-gray-300">
                        Comprehensive software development solutions tailored to your business needs, delivering exceptional quality and innovative technology.
                    </p>
                </div>
                
                {/* Updated grid to display two columns on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {services.map((service, index) => {
                        const isComingSoon = service.title === "AI & ML Integration" || service.title === "Blockchain Development";
                        
                        if (isComingSoon) {
                            return (
                                <Card 
                                    key={index} 
                                    className="bg-tech-dark/50 backdrop-blur-sm border-gray-800 transition-all overflow-hidden"
                                >
                                    <CardHeader>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange/10 flex items-center justify-center text-orange-light mb-2 md:mb-4">
                                            {service.icon}
                                        </div>
                                        <CardTitle className="text-base md:text-xl text-orange-light">
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-orange-light text-xs md:text-sm font-semibold border border-orange rounded-full px-3 py-1 mt-2 inline-block">
                                            Coming Soon
                                        </span>
                                    </CardContent>
                                </Card>
                            );
                        }
                        
                        return (
                            <Card key={index} className="bg-tech-dark/50 backdrop-blur-sm border-gray-800 hover:border-orange/50 transition-all hover:shadow-lg hover:shadow-orange/10 hover:-translate-y-1 overflow-hidden group">
                                <CardHeader>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange/10 flex items-center justify-center text-orange-light mb-2 md:mb-4 group-hover:bg-orange/20 transition-colors">
                                        {service.icon}
                                    </div>
                                    <CardTitle className="text-base md:text-xl text-orange-light">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="hidden md:block text-gray-400">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="px-2 py-0.5 text-xs bg-black/30 border border-gray-800 rounded-full text-gray-300">
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* The 'Start Your Project' Button */}
                <div className="flex justify-center mt-8 md:mt-12">
                    <Button
                        className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2 md:px-6 md:py-3"
                        onClick={() => setIsFormVisible(true)}
                    >
                        Service Request
                    </Button>
                </div>
            </div>
            
            {/* The modal component, controlled by state */}
            <StartYourProject 
                isOpen={isFormVisible} 
                closeModal={() => setIsFormVisible(false)} 
            />
        </section>
    );
}
