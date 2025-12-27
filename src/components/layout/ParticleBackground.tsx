/**
 * Optimized Particle Background
 * Adaptive WebGL/Three.js background with automatic performance scaling
 * Detects device capabilities and adjusts quality for smooth 60fps
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { detectPerformanceSync, PerformanceSettings, DeviceInfo } from '../../lib/performanceDetector';
import CSSFallbackBackground from './CSSFallbackBackground';

// Performance monitoring
interface PerformanceMonitor {
    frameCount: number;
    lastTime: number;
    fps: number;
    lowFpsCount: number;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasError, setHasError] = useState(false);
    const [performanceData, setPerformanceData] = useState<{
        settings: PerformanceSettings;
        deviceInfo: DeviceInfo;
    } | null>(null);

    // Initialize performance detection
    useEffect(() => {
        try {
            const data = detectPerformanceSync();
            setPerformanceData(data);

            // Log performance tier
            console.log(`🎮 Performance Tier: ${data.settings.tier.toUpperCase()} | Score: ${Math.round(data.deviceInfo.score)} | GPU: ${data.deviceInfo.gpuRenderer.slice(0, 40)}`);
        } catch (error) {
            console.error('Performance detection failed:', error);
            setHasError(true);
        }
    }, []);

    // Main Three.js effect
    useEffect(() => {
        if (!canvasRef.current || !performanceData) return;

        const { settings, deviceInfo } = performanceData;

        // Use CSS fallback for fallback tier
        if (settings.tier === 'fallback') {
            return;
        }

        let renderer: THREE.WebGLRenderer | null = null;
        let animationId: number | null = null;
        let isVisible = true;
        let frameCounter = 0;

        // Performance monitor for dynamic adjustment
        const perfMonitor: PerformanceMonitor = {
            frameCount: 0,
            lastTime: performance.now(),
            fps: 60,
            lowFpsCount: 0,
        };

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            // Create renderer with adaptive settings
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true,
                antialias: settings.antialias,
                powerPreference: deviceInfo.isMobile ? 'low-power' : 'high-performance',
                precision: settings.tier === 'low' ? 'lowp' : 'mediump',
            });

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(settings.pixelRatio);

            // --- Optimized Particles Setup ---
            const particlesCount = settings.particleCount;
            const orangeGeometry = new THREE.BufferGeometry();
            const whiteGeometry = new THREE.BufferGeometry();

            // Calculate white particle count based on tier
            const whiteParticleCount = Math.floor(particlesCount * 0.4);

            const orangePos = new Float32Array(particlesCount * 3);
            const whitePos = new Float32Array(whiteParticleCount * 3);

            // Initialize orange particles
            for (let i = 0; i < particlesCount * 3; i += 3) {
                const r = Math.random() * 50;
                const theta = Math.random() * Math.PI * 2;
                orangePos[i] = r * Math.cos(theta);
                orangePos[i + 1] = r * Math.sin(theta);
                orangePos[i + 2] = (Math.random() - 0.5) * 100;
            }

            // Initialize white particles (distant stars)
            for (let i = 0; i < whiteParticleCount * 3; i += 3) {
                const r = Math.random() * 80;
                const theta = Math.random() * Math.PI * 2;
                whitePos[i] = r * Math.cos(theta);
                whitePos[i + 1] = r * Math.sin(theta);
                whitePos[i + 2] = (Math.random() - 0.5) * 100;
            }

            orangeGeometry.setAttribute('position', new THREE.BufferAttribute(orangePos, 3));
            whiteGeometry.setAttribute('position', new THREE.BufferAttribute(whitePos, 3));

            // --- Optimized Circle Texture ---
            const createCircleTexture = (size: number) => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d')!;
                const center = size / 2;
                const radius = (size / 2) - 2;

                ctx.beginPath();
                ctx.arc(center, center, radius, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();

                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                return texture;
            };

            const circleTexture = createCircleTexture(settings.textureSize);

            // Materials with adaptive sizes
            const particleSize = settings.tier === 'high' ? 0.05 : settings.tier === 'medium' ? 0.04 : 0.03;

            const orangeMaterial = new THREE.PointsMaterial({
                size: particleSize,
                map: circleTexture,
                color: new THREE.Color('#F97316'),
                transparent: true,
                opacity: 0.9,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
            });

            const whiteMaterial = new THREE.PointsMaterial({
                size: particleSize * 0.6,
                map: circleTexture,
                color: new THREE.Color('#FFFFFF'),
                transparent: true,
                opacity: 0.5,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
            });

            const orangeMesh = new THREE.Points(orangeGeometry, orangeMaterial);
            const whiteMesh = new THREE.Points(whiteGeometry, whiteMaterial);

            scene.add(orangeMesh);
            scene.add(whiteMesh);

            // --- Tech Icons (only for high/medium tiers) ---
            interface IconSystem {
                mesh: THREE.Points;
                geometry: THREE.BufferGeometry;
                material: THREE.PointsMaterial;
                speed: number;
            }

            const iconSystems: IconSystem[] = [];

            if (settings.enableIcons && settings.iconCount > 0) {
                const iconTextures: THREE.CanvasTexture[] = [];

                const createIconTexture = (symbol: string) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = settings.textureSize;
                    canvas.height = settings.textureSize / 2;
                    const ctx = canvas.getContext('2d')!;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.font = `bold ${Math.floor(settings.textureSize / 4)}px Arial`;
                    ctx.fillStyle = '#F97316';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(symbol, canvas.width / 2, canvas.height / 2);

                    const texture = new THREE.CanvasTexture(canvas);
                    iconTextures.push(texture);
                    return texture;
                };

                const icons = [
                    'React', 'Vue', 'Node', 'Python', 'Java', 'Go',
                    'AWS', 'Docker', 'Git', 'TS', 'Next', 'AI',
                    'Flutter', 'Swift', 'Rust', 'K8s'
                ].slice(0, settings.iconCount);

                icons.forEach(icon => {
                    const geometry = new THREE.BufferGeometry();
                    const count = settings.tier === 'high' ? 4 : 2;
                    const positions = new Float32Array(count * 3);

                    for (let i = 0; i < count * 3; i += 3) {
                        const r = Math.random() * 30;
                        const theta = Math.random() * Math.PI * 2;
                        positions[i] = r * Math.cos(theta);
                        positions[i + 1] = r * Math.sin(theta);
                        positions[i + 2] = -10 - (Math.random() * 200);
                    }

                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const material = new THREE.PointsMaterial({
                        size: settings.tier === 'high' ? 1.5 : 1.2,
                        map: createIconTexture(icon),
                        transparent: true,
                        opacity: 0.8,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending,
                    });

                    const mesh = new THREE.Points(geometry, material);
                    scene.add(mesh);
                    iconSystems.push({
                        mesh,
                        geometry,
                        material,
                        speed: 0.006 + Math.random() * 0.008
                    });
                });
            }

            camera.position.z = 5;

            // --- Optimized Animation Loop ---
            const animate = () => {
                // Skip frames based on settings
                frameCounter++;
                if (frameCounter % settings.frameSkip !== 0) {
                    animationId = requestAnimationFrame(animate);
                    return;
                }

                // Skip rendering when tab is hidden
                if (!isVisible) {
                    animationId = requestAnimationFrame(animate);
                    return;
                }

                // Performance monitoring
                perfMonitor.frameCount++;
                const now = performance.now();
                if (now - perfMonitor.lastTime >= 1000) {
                    perfMonitor.fps = perfMonitor.frameCount;
                    perfMonitor.frameCount = 0;
                    perfMonitor.lastTime = now;

                    // Track low FPS occurrences
                    if (perfMonitor.fps < 30) {
                        perfMonitor.lowFpsCount++;
                    }
                }

                const time = now * 0.0005;

                // Update orange particles
                const orangePositions = orangeGeometry.attributes.position.array as Float32Array;
                const particleSpeed = settings.tier === 'low' ? 0.06 : 0.04;

                for (let i = 2; i < particlesCount * 3; i += 3) {
                    orangePositions[i] += particleSpeed;
                    if (orangePositions[i] > 5) {
                        orangePositions[i] = -60;
                        const r = Math.random() * 3;
                        const theta = Math.random() * Math.PI * 2;
                        orangePositions[i - 2] = r * Math.cos(theta);
                        orangePositions[i - 1] = r * Math.sin(theta);
                    } else {
                        orangePositions[i - 2] *= 1.001;
                        orangePositions[i - 1] *= 1.001;
                        // Only add wave motion on high/medium
                        if (settings.tier !== 'low') {
                            orangePositions[i - 2] += Math.sin(time + orangePositions[i] * 0.5) * 0.002;
                            orangePositions[i - 1] += Math.cos(time + orangePositions[i] * 0.5) * 0.002;
                        }
                    }
                }
                orangeGeometry.attributes.position.needsUpdate = true;

                // Update white particles (slower)
                whiteMesh.rotation.z += 0.0001;

                // Update tech icons
                iconSystems.forEach(system => {
                    const positions = system.geometry.attributes.position.array as Float32Array;
                    for (let i = 2; i < positions.length; i += 3) {
                        positions[i] += system.speed;
                        if (positions[i] > 5) {
                            positions[i] = -200 + (Math.random() * 50);
                            const r = Math.random() * 2;
                            const theta = Math.random() * Math.PI * 2;
                            positions[i - 2] = r * Math.cos(theta);
                            positions[i - 1] = r * Math.sin(theta);
                        } else {
                            positions[i - 2] *= 1.002;
                            positions[i - 1] *= 1.002;
                        }
                    }
                    system.geometry.attributes.position.needsUpdate = true;
                });

                renderer!.render(scene, camera);
                animationId = requestAnimationFrame(animate);
            };

            // Start animation
            animate();

            // Visibility change handler
            const handleVisibilityChange = () => {
                isVisible = !document.hidden;
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Resize handler with debounce
            let resizeTimeout: ReturnType<typeof setTimeout>;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer?.setSize(window.innerWidth, window.innerHeight);
                }, 100);
            };
            window.addEventListener('resize', handleResize);

            // Cleanup
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('resize', handleResize);
                clearTimeout(resizeTimeout);

                if (animationId) cancelAnimationFrame(animationId);

                // Dispose geometries
                orangeGeometry.dispose();
                whiteGeometry.dispose();

                // Dispose materials
                orangeMaterial.dispose();
                whiteMaterial.dispose();
                circleTexture.dispose();

                // Dispose icon systems
                iconSystems.forEach(s => {
                    s.geometry.dispose();
                    s.material.dispose();
                    if (s.material.map) s.material.map.dispose();
                });

                // Dispose renderer
                if (renderer) {
                    renderer.dispose();
                    renderer.forceContextLoss();
                }
            };
        } catch (error) {
            console.error('ParticleBackground: Failed to initialize WebGL', error);
            setHasError(true);
            return undefined;
        }
    }, [performanceData]);

    // Show CSS fallback if needed
    if (!performanceData || performanceData.settings.tier === 'fallback' || hasError) {
        return <CSSFallbackBackground />;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
}
