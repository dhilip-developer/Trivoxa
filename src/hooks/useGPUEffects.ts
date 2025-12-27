/**
 * useGPUEffects Hook
 * Provides GPU effect settings and mouse position for components
 * to create reactive, GPU-accelerated animations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    detectPerformanceSync,
    PerformanceSettings,
    DeviceInfo,
    PerformanceTier
} from '../lib/performanceDetector';

interface MousePosition {
    x: number;
    y: number;
    normalizedX: number; // -1 to 1
    normalizedY: number; // -1 to 1
}

interface GPUEffectsState {
    settings: PerformanceSettings;
    deviceInfo: DeviceInfo;
    mouse: MousePosition;
    isHighPerformance: boolean;
    canUseWebGL: boolean;
    canUseBloom: boolean;
    canUseMouseEffects: boolean;
}

interface UseGPUEffectsReturn extends GPUEffectsState {
    tier: PerformanceTier;
    getAnimationClass: (baseClass: string) => string;
    shouldAnimate: boolean;
    getTransitionDuration: () => number;
}

/**
 * Hook to access GPU effect settings and provide helper methods
 * for performance-aware animations.
 */
export function useGPUEffects(): UseGPUEffectsReturn {
    const [state, setState] = useState<GPUEffectsState | null>(null);
    const mouseRef = useRef<MousePosition>({
        x: 0,
        y: 0,
        normalizedX: 0,
        normalizedY: 0,
    });
    const rafRef = useRef<number | null>(null);

    // Initialize performance detection
    useEffect(() => {
        try {
            const { settings, deviceInfo } = detectPerformanceSync();

            setState({
                settings,
                deviceInfo,
                mouse: mouseRef.current,
                isHighPerformance: settings.tier === 'high' || settings.tier === 'medium',
                canUseWebGL: deviceInfo.hasWebGL,
                canUseBloom: settings.enableBloom,
                canUseMouseEffects: settings.mouseReactivity,
            });
        } catch (error) {
            console.error('GPU effects initialization failed:', error);
        }
    }, []);

    // Smooth mouse tracking
    useEffect(() => {
        if (!state?.canUseMouseEffects) return;

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            targetX = event.clientX;
            targetY = event.clientY;
        };

        const animate = () => {
            // Smooth interpolation
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            const normalizedX = (currentX / window.innerWidth) * 2 - 1;
            const normalizedY = -(currentY / window.innerHeight) * 2 + 1;

            mouseRef.current = {
                x: currentX,
                y: currentY,
                normalizedX,
                normalizedY,
            };

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [state?.canUseMouseEffects]);

    // Helper to get animation class based on performance tier
    const getAnimationClass = useCallback((baseClass: string): string => {
        if (!state) return baseClass;

        const tier = state.settings.tier;

        if (tier === 'fallback') {
            return ''; // No animations for fallback tier
        }

        if (tier === 'low') {
            // Reduced animation classes for low tier
            if (baseClass.includes('transition')) {
                return baseClass.replace(/duration-\d+/g, 'duration-150');
            }
            return baseClass;
        }

        // Full animations for medium/high
        return `${baseClass} gpu-accelerate`;
    }, [state]);

    // Get transition duration based on tier
    const getTransitionDuration = useCallback((): number => {
        if (!state) return 300;

        switch (state.settings.tier) {
            case 'high':
                return 300;
            case 'medium':
                return 250;
            case 'low':
                return 150;
            default:
                return 0;
        }
    }, [state]);

    // Default state for SSR/loading
    if (!state) {
        return {
            settings: {
                tier: 'medium',
                particleCount: 1000,
                iconCount: 10,
                pixelRatio: 1,
                antialias: false,
                enableBloom: false,
                frameSkip: 1,
                enableIcons: true,
                textureSize: 64,
                maxFPS: 60,
                enablePostProcessing: false,
                enableShaderParticles: true,
                bloomStrength: 0,
                bloomRadius: 0,
                mouseReactivity: false,
                vignetteIntensity: 0,
            },
            deviceInfo: {
                isMobile: false,
                isTablet: false,
                hasWebGL: true,
                hasWebGL2: true,
                gpuVendor: 'unknown',
                gpuRenderer: 'unknown',
                deviceMemory: 4,
                hardwareConcurrency: 4,
                screenWidth: 1920,
                screenHeight: 1080,
                devicePixelRatio: 1,
                isLowPowerMode: false,
                score: 50,
            },
            mouse: mouseRef.current,
            isHighPerformance: true,
            canUseWebGL: true,
            canUseBloom: false,
            canUseMouseEffects: false,
            tier: 'medium',
            getAnimationClass: (baseClass) => baseClass,
            shouldAnimate: true,
            getTransitionDuration: () => 300,
        };
    }

    return {
        ...state,
        mouse: mouseRef.current,
        tier: state.settings.tier,
        getAnimationClass,
        shouldAnimate: state.settings.tier !== 'fallback',
        getTransitionDuration,
    };
}

/**
 * Hook to get just the mouse position with smooth interpolation
 */
export function useMousePosition(): MousePosition {
    const [mouse, setMouse] = useState<MousePosition>({
        x: 0,
        y: 0,
        normalizedX: 0,
        normalizedY: 0,
    });

    useEffect(() => {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId: number;

        const handleMouseMove = (event: MouseEvent) => {
            targetX = event.clientX;
            targetY = event.clientY;
        };

        const animate = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            setMouse({
                x: currentX,
                y: currentY,
                normalizedX: (currentX / window.innerWidth) * 2 - 1,
                normalizedY: -(currentY / window.innerHeight) * 2 + 1,
            });

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return mouse;
}

export default useGPUEffects;
