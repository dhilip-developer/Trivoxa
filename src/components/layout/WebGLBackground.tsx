/**
 * GPU-Accelerated WebGL Background
 * Ultra-smooth particle system using custom GLSL shaders,
 * instanced rendering, and post-processing effects.
 * Fully GPU-computed for 60fps performance.
 */

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PerformanceSettings, DeviceInfo } from '../../lib/performanceDetector';

// ============================================
// GLSL SHADERS - GPU-Computed Particle System
// ============================================

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform float uPixelRatio;
  uniform float uSize;
  
  attribute float aScale;
  attribute float aRandomness;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistance;
  
  // Simplex noise function for organic movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vec3 pos = position;
    float time = uTime * uSpeed;
    
    // GPU-computed noise-based organic movement
    float noiseX = snoise(vec3(pos.x * 0.02, pos.y * 0.02, time * 0.5 + aRandomness));
    float noiseY = snoise(vec3(pos.y * 0.02, pos.z * 0.02, time * 0.5 + aRandomness + 100.0));
    float noiseZ = snoise(vec3(pos.z * 0.02, pos.x * 0.02, time * 0.5 + aRandomness + 200.0));
    
    pos.x += noiseX * uAmplitude * 3.0;
    pos.y += noiseY * uAmplitude * 3.0;
    pos.z += noiseZ * uAmplitude * 2.0;
    
    // Spiral motion
    float angle = time * 0.2 + aRandomness * 6.28;
    float radius = length(pos.xy) * 0.1;
    pos.x += cos(angle) * radius * 0.5;
    pos.y += sin(angle) * radius * 0.5;
    
    // Forward drift (z-axis motion towards camera)
    pos.z = mod(pos.z + time * 15.0 + aRandomness * 50.0, 100.0) - 50.0;
    
    // Mouse attraction/repulsion (GPU-computed)
    vec4 worldPos = modelViewMatrix * vec4(pos, 1.0);
    vec2 screenPos = worldPos.xy / worldPos.w;
    vec2 toMouse = uMouse - screenPos;
    float mouseDist = length(toMouse);
    float mouseEffect = smoothstep(2.0, 0.0, mouseDist) * uMouseInfluence;
    pos.xy += normalize(toMouse + 0.001) * mouseEffect * 2.0;
    
    // Calculate distance for size attenuation
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistance = -mvPosition.z;
    
    // Dynamic alpha based on z-position (fade in/out)
    float zNorm = (pos.z + 50.0) / 100.0;
    vAlpha = smoothstep(0.0, 0.2, zNorm) * smoothstep(1.0, 0.8, zNorm);
    vAlpha *= 0.6 + aScale * 0.4;
    
    // Pass color to fragment shader
    vColor = aColor;
    
    // Size with perspective and scale variation
    float size = uSize * aScale * uPixelRatio;
    gl_PointSize = size * (300.0 / vDistance);
    gl_PointSize = clamp(gl_PointSize, 1.0, 50.0);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistance;
  
  void main() {
    // Create soft circular particle with anti-aliasing
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    // Soft edge falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    // Add subtle glow ring
    float ring = smoothstep(0.35, 0.4, dist) * (1.0 - smoothstep(0.4, 0.5, dist));
    alpha += ring * 0.5;
    
    // Pulsing effect
    float pulse = sin(uTime * 2.0 + vDistance * 0.1) * 0.15 + 0.85;
    alpha *= vAlpha * pulse;
    
    // Color with slight variation
    vec3 finalColor = vColor;
    finalColor += vec3(0.1, 0.05, 0.0) * ring; // Orange tint on ring
    
    // Discard fully transparent pixels
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Vignette Shader for post-processing
const vignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        uDarkness: { value: 0.5 },
        uOffset: { value: 1.0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uDarkness;
    uniform float uOffset;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(0.5, uOffset, dist);
      color.rgb = mix(color.rgb, color.rgb * (1.0 - uDarkness), vignette);
      gl_FragColor = color;
    }
  `,
};

// ============================================
// COMPONENT
// ============================================

interface WebGLBackgroundProps {
    settings: PerformanceSettings;
    deviceInfo: DeviceInfo;
}

export default function WebGLBackground({ settings, deviceInfo }: WebGLBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const isVisibleRef = useRef(true);
    const clockRef = useRef(new THREE.Clock());

    // Particle configuration based on performance tier
    const particleConfig = useMemo(() => {
        const baseCount = settings.particleCount;
        const multiplier = settings.tier === 'high' ? 2 : settings.tier === 'medium' ? 1.5 : 1;

        return {
            count: Math.floor(baseCount * multiplier),
            size: settings.tier === 'high' ? 3.0 : settings.tier === 'medium' ? 2.5 : 2.0,
            speed: settings.tier === 'high' ? 0.3 : 0.25,
            amplitude: settings.tier === 'high' ? 1.0 : 0.8,
            mouseInfluence: settings.tier === 'high' ? 1.0 : 0.5,
            bloomStrength: settings.tier === 'high' ? 1.2 : settings.tier === 'medium' ? 0.8 : 0.4,
            bloomRadius: settings.tier === 'high' ? 0.8 : 0.5,
        };
    }, [settings]);

    // Create particle geometry with attributes
    const createParticles = useCallback((count: number) => {
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const randomness = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        // Orange color palette
        const colorPalette = [
            new THREE.Color('#F97316'), // Primary orange
            new THREE.Color('#FB923C'), // Light orange
            new THREE.Color('#EA580C'), // Dark orange
            new THREE.Color('#FDBA74'), // Pale orange
            new THREE.Color('#FFD700'), // Gold accent
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical/cylindrical distribution
            const radius = Math.random() * 30 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = (Math.random() - 0.5) * 100;

            // Random scale for size variation
            scales[i] = Math.random() * 0.8 + 0.2;

            // Random value for animation offset
            randomness[i] = Math.random();

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

        return geometry;
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 200);
        camera.position.z = 30;
        cameraRef.current = camera;

        // Renderer with GPU optimization
        const renderer = new THREE.WebGLRenderer({
            antialias: settings.antialias,
            alpha: true,
            powerPreference: deviceInfo.isMobile ? 'low-power' : 'high-performance',
            precision: settings.tier === 'low' ? 'lowp' : 'highp',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(settings.pixelRatio);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: particleConfig.speed },
                uAmplitude: { value: particleConfig.amplitude },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uMouseInfluence: { value: particleConfig.mouseInfluence },
                uPixelRatio: { value: settings.pixelRatio },
                uSize: { value: particleConfig.size },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        materialRef.current = material;

        // Create particles
        const geometry = createParticles(particleConfig.count);
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Add ambient stars (white particles in background)
        const starCount = Math.floor(particleConfig.count * 0.3);
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starScales = new Float32Array(starCount);
        const starRandomness = new Float32Array(starCount);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 80;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 80;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 100;
            starScales[i] = Math.random() * 0.4 + 0.1;
            starRandomness[i] = Math.random();
            // White/blue tinted stars
            const brightness = 0.6 + Math.random() * 0.4;
            starColors[i3] = brightness;
            starColors[i3 + 1] = brightness;
            starColors[i3 + 2] = brightness + Math.random() * 0.1;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('aScale', new THREE.BufferAttribute(starScales, 1));
        starGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(starRandomness, 1));
        starGeometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: particleConfig.speed * 0.3 },
                uAmplitude: { value: particleConfig.amplitude * 0.5 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uMouseInfluence: { value: 0 },
                uPixelRatio: { value: settings.pixelRatio },
                uSize: { value: particleConfig.size * 0.5 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Post-processing (if enabled)
        let composer: EffectComposer | null = null;
        if (settings.enableBloom) {
            composer = new EffectComposer(renderer);

            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(width, height),
                particleConfig.bloomStrength,
                particleConfig.bloomRadius,
                0.2
            );
            composer.addPass(bloomPass);

            const vignettePass = new ShaderPass(vignetteShader);
            vignettePass.uniforms.uDarkness.value = 0.4;
            vignettePass.uniforms.uOffset.value = 0.9;
            composer.addPass(vignettePass);

            composerRef.current = composer;
        }

        // Animation loop
        let frameCounter = 0;
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            // Skip frames based on settings
            frameCounter++;
            if (frameCounter % settings.frameSkip !== 0) return;

            // Skip rendering when hidden
            if (!isVisibleRef.current) return;

            const elapsedTime = clockRef.current.getElapsedTime();

            // Smooth mouse interpolation
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

            // Update uniforms
            material.uniforms.uTime.value = elapsedTime;
            material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
            starMaterial.uniforms.uTime.value = elapsedTime;

            // Subtle camera movement
            camera.position.x = Math.sin(elapsedTime * 0.1) * 2;
            camera.position.y = Math.cos(elapsedTime * 0.1) * 2;
            camera.lookAt(0, 0, 0);

            // Render
            if (composer && settings.enableBloom) {
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
        };

        animate();

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse position to -1 to 1
            mouseRef.current.targetX = (event.clientX / width) * 2 - 1;
            mouseRef.current.targetY = -(event.clientY / height) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Visibility change handler
        const handleVisibilityChange = () => {
            isVisibleRef.current = !document.hidden;
            if (!document.hidden) {
                clockRef.current.start();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Resize handler
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);

                if (composer) {
                    composer.setSize(newWidth, newHeight);
                }
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(resizeTimeout);

            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }

            geometry.dispose();
            material.dispose();
            starGeometry.dispose();
            starMaterial.dispose();

            if (composer) {
                composer.dispose();
            }

            renderer.dispose();
            renderer.forceContextLoss();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [settings, deviceInfo, particleConfig, createParticles]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{
                background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
            }}
        />
    );
}
