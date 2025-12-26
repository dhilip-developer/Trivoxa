import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import TrivoxaLogo from '@/Assets/trivoxa-logo.png';

interface LoadingAnimation3DProps {
    onComplete?: () => void;
    duration?: number;
}

export const LoadingAnimation3D = ({ onComplete, duration = 3000 }: LoadingAnimation3DProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [dots, setDots] = useState('');

    // Animated dots for "LOADING..."
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);
        return () => clearInterval(interval);
    }, []);

    // Three.js Horizontal Circuit Lines Effect
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);

        const allLines: { line: THREE.Line; dots: THREE.Points; direction: number; yOffset: number }[] = [];

        // Create horizontal circuit lines - LEFT and RIGHT sides
        const createCircuitLine = (direction: number, yOffset: number, delay: number) => {
            const points: THREE.Vector3[] = [];
            const startX = direction * 2; // Start from edge of logo area
            const segments = 20;
            const totalLength = 12;

            let currentY = yOffset;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = startX + direction * t * totalLength;

                // Zigzag pattern - alternate up and down
                if (i > 0 && i < segments && i % 3 === 0) {
                    currentY = yOffset + (Math.random() - 0.5) * 0.8;
                }

                points.push(new THREE.Vector3(x, currentY, 0));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0xf97316,
                transparent: true,
                opacity: 0.8,
            });

            const line = new THREE.Line(geometry, material);
            scene.add(line);

            // Create glowing dots at zigzag points
            const dotPositions: number[] = [];
            points.forEach((point, i) => {
                if (i % 3 === 0 || i === points.length - 1) {
                    dotPositions.push(point.x, point.y, point.z);
                }
            });

            const dotGeometry = new THREE.BufferGeometry();
            dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));

            const dotMaterial = new THREE.PointsMaterial({
                color: 0xffa500,
                size: 0.15,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
            });

            const dots = new THREE.Points(dotGeometry, dotMaterial);
            scene.add(dots);

            return { line, dots, direction, yOffset };
        };

        // Create multiple lines on left and right
        const lineConfigs = [
            // Right side lines
            { dir: 1, y: 0, delay: 0 },
            { dir: 1, y: 0.6, delay: 0.1 },
            { dir: 1, y: -0.6, delay: 0.2 },
            { dir: 1, y: 1.2, delay: 0.15 },
            { dir: 1, y: -1.2, delay: 0.25 },
            { dir: 1, y: 1.8, delay: 0.3 },
            { dir: 1, y: -1.8, delay: 0.35 },
            { dir: 1, y: 2.4, delay: 0.4 },
            { dir: 1, y: -2.4, delay: 0.45 },
            // Left side lines
            { dir: -1, y: 0, delay: 0 },
            { dir: -1, y: 0.6, delay: 0.1 },
            { dir: -1, y: -0.6, delay: 0.2 },
            { dir: -1, y: 1.2, delay: 0.15 },
            { dir: -1, y: -1.2, delay: 0.25 },
            { dir: -1, y: 1.8, delay: 0.3 },
            { dir: -1, y: -1.8, delay: 0.35 },
            { dir: -1, y: 2.4, delay: 0.4 },
            { dir: -1, y: -2.4, delay: 0.45 },
        ];

        lineConfigs.forEach(config => {
            allLines.push(createCircuitLine(config.dir, config.y, config.delay));
        });

        // Create floating particles
        const particleCount = 150;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 30;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xf97316,
            size: 0.05,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Animation
        let animationId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Animate circuit lines with wave effect
            allLines.forEach((item, index) => {
                const { line, dots } = item;
                const lineMaterial = line.material as THREE.LineBasicMaterial;
                const dotMaterial = dots.material as THREE.PointsMaterial;

                // Pulsing glow effect
                const pulse = Math.sin(time * 3 + index * 0.3) * 0.3 + 0.7;
                lineMaterial.opacity = pulse * 0.8;
                dotMaterial.opacity = pulse;
                dotMaterial.size = 0.1 + pulse * 0.1;
            });

            // Animate particles floating
            const pPositions = particleGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                pPositions[i * 3 + 1] += Math.sin(time + i) * 0.002;
                pPositions[i * 3] += Math.cos(time * 0.5 + i) * 0.001;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            allLines.forEach(({ line, dots }) => {
                line.geometry.dispose();
                (line.material as THREE.Material).dispose();
                dots.geometry.dispose();
                (dots.material as THREE.Material).dispose();
            });
            particleGeometry.dispose();
            particleMaterial.dispose();
        };
    }, []);

    // Completion
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                onComplete?.();
            }, 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Circuit Lines Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Center Logo with Glow */}
            <div className="relative z-10 flex flex-col items-center">
                <div
                    className="relative"
                    style={{
                        animation: 'logoGlow 2s ease-in-out infinite',
                    }}
                >
                    {/* Glow effect behind logo */}
                    <div
                        className="absolute inset-0 rounded-full blur-2xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
                            transform: 'scale(1.5)',
                        }}
                    />
                    <img
                        src={TrivoxaLogo}
                        alt="Trivoxa"
                        className="w-40 h-40 object-contain relative z-10"
                        style={{
                            filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.8)) drop-shadow(0 0 60px rgba(249, 115, 22, 0.4))',
                        }}
                    />
                </div>

                {/* Loading text */}
                <div
                    className="mt-8 text-orange-500 text-lg font-light tracking-[0.3em] uppercase"
                    style={{
                        textShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
                    }}
                >
                    LOADING{dots}
                </div>
            </div>

            <style>{`
        @keyframes logoGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.5));
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(249, 115, 22, 0.8));
          }
        }
      `}</style>
        </div>
    );
};

export default LoadingAnimation3D;
