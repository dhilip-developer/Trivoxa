import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { StartYourProject } from './StartYourProject'; // Import the new component


// --- Self-Contained Button Component ---
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

const handleScrollToPortfolio = () => {
        const portfolioSection = document.getElementById('work');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


// --- TechSphere Component ---
// This component renders the 3D sphere as a background.
function TechSphere({ size = 1.5, opacity = 0.8, isNeon = false }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });
        
        const handleResize = () => {
            const container = canvasRef.current?.parentElement;
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;
            
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
        const geometry = new THREE.SphereGeometry(size, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0xFF8800,
            wireframe: true,
            emissive: 0xFF8800,
            emissiveIntensity: 0.2,
            metalness: 0.8,
            roughness: 0.2,
        });

        if (isNeon) {
            material.color = new THREE.Color(0x000000);
            material.emissiveIntensity = 0;
            material.roughness = 0.4;
            material.metalness = 0.5;
            material.wireframe = true;
        }
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambientLight);
        
        if (isNeon) {
            const neonLight1 = new THREE.PointLight(0x00D7C3, 5);
            neonLight1.position.set(2, 2, 2);
            scene.add(neonLight1);

            const neonLight2 = new THREE.PointLight(0xFF00FF, 5);
            neonLight2.position.set(-2, -2, 1);
            scene.add(neonLight2);

            const neonLight3 = new THREE.PointLight(0xFF8800, 5);
            neonLight3.position.set(-2, 2, -1);
            scene.add(neonLight3);
        } else {
            const pointLight1 = new THREE.PointLight(0x00D7C3, 2);
            pointLight1.position.set(2, 2, 2);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0xFF8800, 2);
            pointLight2.position.set(-2, -2, 1);
            scene.add(pointLight2);
        }

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.002;
            renderer.render(scene, camera);
        }
        
        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, [size, isNeon]);
    
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <canvas 
                ref={canvasRef} 
                className={`w-full h-full z-[-1]`}
                style={{ opacity: opacity }}
            />
        </div>
    );
}

// --- Main Hero Section Component ---
export default function HeroSection() {
    const heroRef = useRef(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    // Inline SVGs for the new icons
    const MernStackIcons = [
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", alt: "MongoDB" },
        { src: "https://img.icons8.com/?size=64&id=2ZOaTclOqD4q&format=png", alt: "Express" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
        { src: "https://www.svgrepo.com/show/452136/wordpress.svg", alt: "WordPress" }, 
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", alt: "Java" },
    ];

    const AiMlIcons = [
        { src: "https://cdn-icons-png.flaticon.com/128/9887/9887894.png", alt: "Machine Learning" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", alt: "TensorFlow" },
        { src: "https://cdn-icons-png.flaticon.com/128/16982/16982998.png", alt: "AI" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python" }
    ];

    const HostingIcons = [
        { src: "https://www.svgrepo.com/show/376356/aws.svg", alt: "AWS" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", alt: "GCP" },
        { src: "https://www.svgrepo.com/show/530451/dns.svg", alt: "Domain" },
    ];

    // Animation keyframes for rotation
    const spinClockwise = `
        @keyframes spinClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;

    const spinAntiClockwise = `
        @keyframes spinAntiClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }
    `;
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;
            
            const { clientX, clientY } = e;
            const { left, top, width, height } = heroRef.current.getBoundingClientRect();
            
            const x = (clientX - left) / width;
            const y = (clientY - top) / height;
            
            (heroRef.current as HTMLDivElement).style.setProperty("--mouse-x", `${x}`);
            (heroRef.current as HTMLDivElement).style.setProperty("--mouse-y", `${y}`);
        };
        
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
            <style>{spinClockwise + spinAntiClockwise}</style>
            <TechSphere />
            
            <div className="absolute inset-0 pointer-events-none"></div>
            
            <div className="container relative z-10 mx-auto px-4 pt-20 pb-20 flex flex-col lg:flex-row items-center justify-center">
                
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
                        <Button 
                            className="bg-orange hover:bg-orange-light text-black font-medium px-6 py-3"
                            onClick={() => setIsFormVisible(true)}
                        >
                            Start Your Project
                        </Button>
                        <Button 
                            className="border-2 border-orange hover:bg-orange/10 text-orange-light px-6 py-3"
                            onClick={handleScrollToPortfolio} // Use the new handler
                        >
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
                
                {/* Right side: New 3D visualization */}
                <div className="flex-1 relative mt-12 lg:mt-0 flex items-center justify-center pointer-events-none">
                    <div className="perspective-container relative w-full h-[500px] max-w-sm mx-auto flex items-center justify-center">
                        {/* Small central globe */}
                        <div className="absolute w-48 h-48 flex items-center justify-center z-20">
                            <TechSphere size={1.8} opacity={1} isNeon={true} />
                        </div>

                        {/* Icons on Rings */}
                        {/* Outer Ring: MERN, Java, WordPress (clockwise) */}
                        <div className="absolute w-[450px] h-[450px] rounded-full border border-orange-500/20 z-10" style={{ animation: 'spinClockwise 40s linear infinite' }}>
                            {MernStackIcons.map((icon, index) => (
                                <div key={index} className="absolute top-1/2 left-1/2 -mt-6 -ml-6 w-12 h-12 hover-3d pointer-events-auto" style={{
                                    transform: `rotate(${index * (360 / MernStackIcons.length)}deg) translate(225px) rotate(${-(index * (360 / MernStackIcons.length))}deg)`
                                }}>
                                    <div className="w-full h-full flex items-center justify-center p-2 rounded-lg bg-black/40 backdrop-blur-lg border border-orange-700 shadow-orange-glow animate-float">
                                        <img src={icon.src} alt={icon.alt} className="w-8 h-8" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Middle Ring: AI/ML (anti-clockwise) */}
                        <div className="absolute w-[350px] h-[350px] rounded-full border border-neon-cyan/20 z-10" style={{ animation: 'spinAntiClockwise 30s linear infinite' }}>
                            {AiMlIcons.map((icon, index) => (
                                <div key={index} className="absolute top-1/2 left-1/2 -mt-5 -ml-5 w-10 h-10 hover-3d pointer-events-auto" style={{
                                    transform: `rotate(${index * (360 / AiMlIcons.length)}deg) translate(175px) rotate(${-(index * (360 / AiMlIcons.length))}deg)`
                                }}>
                                    <div className="w-full h-full flex items-center justify-center p-2 rounded-lg bg-black/40 backdrop-blur-lg border border-neon-cyan shadow-neon animate-float">
                                        <img src={icon.src} alt={icon.alt} className="w-6 h-6" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inner Ring: Hosting/Domain (clockwise) */}
                        <div className="absolute w-[250px] h-[250px] rounded-full border border-orange-500/20 z-10" style={{ animation: 'spinClockwise 20s linear infinite' }}>
                            {HostingIcons.map((icon, index) => (
                                <div key={index} className="absolute top-1/2 left-1/2 -mt-4 -ml-4 w-15 h-15 hover-3d pointer-events-auto" style={{
                                    transform: `rotate(${index * (360 / HostingIcons.length)}deg) translate(125px) rotate(${-(index * (360 / HostingIcons.length))}deg)`
                                }}>
                                    <div className="w-full h-full flex items-center justify-center p-1 rounded-lg bg-black/40 backdrop-blur-lg border border-orange-700 shadow-orange-glow animate-float">
                                        <img src={icon.src} alt={icon.alt} className="w-10 h-10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 animate-pulse-slow">
                <span className="text-sm text-gray-400">Scroll to explore</span>
                <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            <StartYourProject isOpen={isFormVisible} closeModal={() => setIsFormVisible(false)} />
        </div>
    );
}