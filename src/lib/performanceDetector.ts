/**
 * Performance Detection Utility
 * Detects device capabilities and returns optimal WebGL/Three.js settings
 */

export type PerformanceTier = 'high' | 'medium' | 'low' | 'fallback';

export interface PerformanceSettings {
    tier: PerformanceTier;
    particleCount: number;
    iconCount: number;
    pixelRatio: number;
    antialias: boolean;
    enableBloom: boolean;
    frameSkip: number;
    enableIcons: boolean;
    textureSize: number;
    maxFPS: number;
}

export interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    hasWebGL: boolean;
    hasWebGL2: boolean;
    gpuVendor: string;
    gpuRenderer: string;
    deviceMemory: number;
    hardwareConcurrency: number;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    isLowPowerMode: boolean;
    score: number;
}

// Known GPU tiers for scoring
const GPU_TIERS: Record<string, number> = {
    // High-end desktop GPUs
    'nvidia geforce rtx': 100,
    'nvidia geforce gtx 10': 90,
    'nvidia geforce gtx 16': 90,
    'amd radeon rx 6': 95,
    'amd radeon rx 5': 85,
    'apple m1': 85,
    'apple m2': 90,
    'apple m3': 95,
    // Mid-range
    'nvidia geforce gtx 9': 70,
    'amd radeon rx 4': 65,
    'intel iris xe': 65,
    'intel iris plus': 55,
    'apple a15': 70,
    'apple a14': 65,
    'apple a13': 55,
    // Low-end / Integrated
    'intel uhd': 40,
    'intel hd': 30,
    'adreno 6': 50,
    'adreno 5': 35,
    'mali-g7': 45,
    'mali-g5': 30,
    'mali-t': 20,
    'powervr': 25,
};

/**
 * Check if WebGL is available
 */
function checkWebGL(): { hasWebGL: boolean; hasWebGL2: boolean } {
    try {
        const canvas = document.createElement('canvas');
        const webgl2 = canvas.getContext('webgl2');
        const webgl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return {
            hasWebGL: !!webgl,
            hasWebGL2: !!webgl2,
        };
    } catch {
        return { hasWebGL: false, hasWebGL2: false };
    }
}

/**
 * Get GPU information from WebGL context
 */
function getGPUInfo(): { vendor: string; renderer: string } {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return { vendor: 'unknown', renderer: 'unknown' };

        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            return {
                vendor: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown',
                renderer: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown',
            };
        }

        return {
            vendor: (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).VENDOR) || 'unknown',
            renderer: (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).RENDERER) || 'unknown',
        };
    } catch {
        return { vendor: 'unknown', renderer: 'unknown' };
    }
}

/**
 * Detect if device is mobile or tablet
 */
function detectMobileDevice(): { isMobile: boolean; isTablet: boolean } {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);

    // Also check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;

    return {
        isMobile: isMobile || (hasTouch && isSmallScreen),
        isTablet: isTablet || (hasTouch && !isSmallScreen && window.innerWidth < 1024),
    };
}

/**
 * Get device memory (if available)
 */
function getDeviceMemory(): number {
    // @ts-ignore - deviceMemory is not in all browsers
    return navigator.deviceMemory || 4; // Default to 4GB if not available
}

/**
 * Get hardware concurrency (CPU cores)
 */
function getHardwareConcurrency(): number {
    return navigator.hardwareConcurrency || 4; // Default to 4 cores
}

/**
 * Check for low power mode (battery saver)
 */
async function checkLowPowerMode(): Promise<boolean> {
    try {
        // @ts-ignore - getBattery is not in all browsers
        if (navigator.getBattery) {
            // @ts-ignore
            const battery = await navigator.getBattery();
            // Consider low power if charging is false and level is low
            return !battery.charging && battery.level < 0.2;
        }
    } catch {
        // Battery API not available
    }
    return false;
}

/**
 * Calculate GPU score based on renderer string
 */
function calculateGPUScore(renderer: string): number {
    const lowerRenderer = renderer.toLowerCase();

    for (const [key, score] of Object.entries(GPU_TIERS)) {
        if (lowerRenderer.includes(key)) {
            return score;
        }
    }

    // Default scores based on common patterns
    if (lowerRenderer.includes('nvidia') || lowerRenderer.includes('geforce')) return 60;
    if (lowerRenderer.includes('amd') || lowerRenderer.includes('radeon')) return 55;
    if (lowerRenderer.includes('apple')) return 60;
    if (lowerRenderer.includes('intel')) return 35;
    if (lowerRenderer.includes('mali') || lowerRenderer.includes('adreno')) return 30;

    return 25; // Unknown GPU, assume low-end
}

/**
 * Calculate overall performance score
 */
function calculatePerformanceScore(info: Omit<DeviceInfo, 'score'>): number {
    let score = 0;

    // GPU score (40% weight)
    const gpuScore = calculateGPUScore(info.gpuRenderer);
    score += gpuScore * 0.4;

    // Memory score (20% weight)
    const memoryScore = Math.min(info.deviceMemory / 8, 1) * 100;
    score += memoryScore * 0.2;

    // CPU cores score (15% weight)
    const cpuScore = Math.min(info.hardwareConcurrency / 8, 1) * 100;
    score += cpuScore * 0.15;

    // Screen resolution score (10% weight)
    const pixelCount = info.screenWidth * info.screenHeight * info.devicePixelRatio;
    const resolutionScore = pixelCount > 4000000 ? 50 : 80; // Higher res = more work
    score += resolutionScore * 0.1;

    // Device type penalty (15% weight)
    if (info.isMobile) {
        score -= 25; // Mobile penalty
    } else if (info.isTablet) {
        score -= 15; // Tablet penalty
    }

    // Low power mode penalty
    if (info.isLowPowerMode) {
        score -= 20;
    }

    // WebGL2 bonus
    if (info.hasWebGL2) {
        score += 5;
    }

    return Math.max(0, Math.min(100, score));
}

/**
 * Determine performance tier from score
 */
function getTierFromScore(score: number, hasWebGL: boolean): PerformanceTier {
    if (!hasWebGL) return 'fallback';
    if (score >= 70) return 'high';
    if (score >= 45) return 'medium';
    if (score >= 20) return 'low';
    return 'fallback';
}

/**
 * Generate optimal settings based on tier
 */
function generateSettings(tier: PerformanceTier, deviceInfo: DeviceInfo): PerformanceSettings {
    const baseSettings: Record<PerformanceTier, PerformanceSettings> = {
        high: {
            tier: 'high',
            particleCount: 3000,
            iconCount: 40,
            pixelRatio: Math.min(deviceInfo.devicePixelRatio, 2),
            antialias: true,
            enableBloom: true,
            frameSkip: 1,
            enableIcons: true,
            textureSize: 128,
            maxFPS: 60,
        },
        medium: {
            tier: 'medium',
            particleCount: 1200,
            iconCount: 15,
            pixelRatio: Math.min(deviceInfo.devicePixelRatio, 1.5),
            antialias: false,
            enableBloom: false,
            frameSkip: 1,
            enableIcons: true,
            textureSize: 64,
            maxFPS: 60,
        },
        low: {
            tier: 'low',
            particleCount: 400,
            iconCount: 0,
            pixelRatio: 1,
            antialias: false,
            enableBloom: false,
            frameSkip: 2, // Skip every other frame
            enableIcons: false,
            textureSize: 32,
            maxFPS: 30,
        },
        fallback: {
            tier: 'fallback',
            particleCount: 0,
            iconCount: 0,
            pixelRatio: 1,
            antialias: false,
            enableBloom: false,
            frameSkip: 1,
            enableIcons: false,
            textureSize: 0,
            maxFPS: 60,
        },
    };

    return baseSettings[tier];
}

/**
 * Main function to detect device performance and return optimal settings
 */
export async function detectPerformance(): Promise<{ deviceInfo: DeviceInfo; settings: PerformanceSettings }> {
    const { hasWebGL, hasWebGL2 } = checkWebGL();
    const { vendor, renderer } = getGPUInfo();
    const { isMobile, isTablet } = detectMobileDevice();
    const isLowPowerMode = await checkLowPowerMode();

    const deviceInfo: Omit<DeviceInfo, 'score'> = {
        isMobile,
        isTablet,
        hasWebGL,
        hasWebGL2,
        gpuVendor: vendor,
        gpuRenderer: renderer,
        deviceMemory: getDeviceMemory(),
        hardwareConcurrency: getHardwareConcurrency(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        isLowPowerMode,
    };

    const score = calculatePerformanceScore(deviceInfo);
    const fullDeviceInfo: DeviceInfo = { ...deviceInfo, score };

    const tier = getTierFromScore(score, hasWebGL);
    const settings = generateSettings(tier, fullDeviceInfo);

    // Log performance info in development
    if (import.meta.env.DEV) {
        console.log('🎮 Performance Detection:', {
            gpu: renderer,
            score: Math.round(score),
            tier,
            isMobile,
            memory: `${deviceInfo.deviceMemory}GB`,
            cores: deviceInfo.hardwareConcurrency,
        });
    }

    return { deviceInfo: fullDeviceInfo, settings };
}

/**
 * Quick sync version for initial render (uses cached or estimates)
 */
export function detectPerformanceSync(): { deviceInfo: DeviceInfo; settings: PerformanceSettings } {
    const { hasWebGL, hasWebGL2 } = checkWebGL();
    const { vendor, renderer } = getGPUInfo();
    const { isMobile, isTablet } = detectMobileDevice();

    const deviceInfo: DeviceInfo = {
        isMobile,
        isTablet,
        hasWebGL,
        hasWebGL2,
        gpuVendor: vendor,
        gpuRenderer: renderer,
        deviceMemory: getDeviceMemory(),
        hardwareConcurrency: getHardwareConcurrency(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        isLowPowerMode: false, // Can't check sync
        score: 0,
    };

    const score = calculatePerformanceScore(deviceInfo);
    deviceInfo.score = score;

    const tier = getTierFromScore(score, hasWebGL);
    const settings = generateSettings(tier, deviceInfo);

    return { deviceInfo, settings };
}

/**
 * Hook-friendly performance context
 */
let cachedSettings: { deviceInfo: DeviceInfo; settings: PerformanceSettings } | null = null;

export function getCachedPerformance(): { deviceInfo: DeviceInfo; settings: PerformanceSettings } | null {
    return cachedSettings;
}

export async function initPerformanceDetection(): Promise<{ deviceInfo: DeviceInfo; settings: PerformanceSettings }> {
    if (cachedSettings) return cachedSettings;
    cachedSettings = await detectPerformance();
    return cachedSettings;
}
