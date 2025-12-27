/**
 * Performance Detector
 * Detects device capabilities and returns optimized settings
 * for GPU-accelerated animations and effects.
 */

export type PerformanceTier = 'high' | 'medium' | 'low' | 'fallback';

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
    enablePostProcessing: boolean;
    enableShaderParticles: boolean;
    bloomStrength: number;
    bloomRadius: number;
    mouseReactivity: boolean;
    vignetteIntensity: number;
}

interface PerformanceResult {
    settings: PerformanceSettings;
    deviceInfo: DeviceInfo;
}

/**
 * Detect WebGL capabilities
 */
function detectWebGL(): { hasWebGL: boolean; hasWebGL2: boolean; vendor: string; renderer: string } {
    try {
        const canvas = document.createElement('canvas');

        // Try WebGL2 first
        let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
            canvas.getContext('webgl2') as WebGL2RenderingContext | null;
        const hasWebGL2 = !!gl;

        // Fall back to WebGL1
        if (!gl) {
            gl = canvas.getContext('webgl') as WebGLRenderingContext | null ||
                canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        }

        if (!gl) {
            return { hasWebGL: false, hasWebGL2: false, vendor: 'none', renderer: 'none' };
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : gl.getParameter(gl.VENDOR);
        const renderer = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);

        return {
            hasWebGL: true,
            hasWebGL2,
            vendor: vendor || 'unknown',
            renderer: renderer || 'unknown'
        };
    } catch {
        return { hasWebGL: false, hasWebGL2: false, vendor: 'error', renderer: 'error' };
    }
}

/**
 * Detect if device is mobile or tablet
 */
function detectDeviceType(): { isMobile: boolean; isTablet: boolean } {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) ||
        (navigator.maxTouchPoints > 0 && window.innerWidth >= 768);

    return { isMobile: isMobile && !isTablet, isTablet };
}

/**
 * Calculate a performance score based on device capabilities
 */
function calculateScore(deviceInfo: Partial<DeviceInfo>): number {
    let score = 50; // Base score

    // Hardware factors
    score += Math.min((deviceInfo.hardwareConcurrency || 2) * 5, 40);
    score += Math.min((deviceInfo.deviceMemory || 2) * 5, 40);

    // Screen resolution factor
    const pixels = (deviceInfo.screenWidth || 1920) * (deviceInfo.screenHeight || 1080);
    if (pixels > 4000000) score -= 15; // 4K penalty
    else if (pixels < 1500000) score += 10; // Low res bonus

    // WebGL factors
    if (deviceInfo.hasWebGL2) score += 20;
    else if (deviceInfo.hasWebGL) score += 10;
    else score -= 30;

    // Mobile penalty
    if (deviceInfo.isMobile) score -= 25;
    else if (deviceInfo.isTablet) score -= 15;

    // GPU-specific adjustments
    const renderer = (deviceInfo.gpuRenderer || '').toLowerCase();
    if (renderer.includes('nvidia') || renderer.includes('radeon')) {
        score += 20; // Dedicated GPU bonus
    } else if (renderer.includes('intel')) {
        score -= 5; // Integrated GPU
    } else if (renderer.includes('mali') || renderer.includes('adreno')) {
        score -= 10; // Mobile GPU
    }

    return Math.max(0, Math.min(100, score));
}

/**
 * Get performance tier based on score
 */
function getTier(score: number, hasWebGL: boolean): PerformanceTier {
    if (!hasWebGL) return 'fallback';
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    if (score >= 25) return 'low';
    return 'fallback';
}

/**
 * Generate settings based on tier and device info
 */
function generateSettings(tier: PerformanceTier, deviceInfo: DeviceInfo): PerformanceSettings {
    const baseSettings: Record<PerformanceTier, PerformanceSettings> = {
        high: {
            tier: 'high',
            particleCount: 3000,
            iconCount: 20,
            pixelRatio: Math.min(deviceInfo.devicePixelRatio, 2),
            antialias: true,
            enableBloom: true,
            frameSkip: 1,
            enableIcons: true,
            textureSize: 128,
            maxFPS: 60,
            enablePostProcessing: true,
            enableShaderParticles: true,
            bloomStrength: 1.2,
            bloomRadius: 0.8,
            mouseReactivity: true,
            vignetteIntensity: 0.4,
        },
        medium: {
            tier: 'medium',
            particleCount: 1500,
            iconCount: 12,
            pixelRatio: Math.min(deviceInfo.devicePixelRatio, 1.5),
            antialias: false,
            enableBloom: true,
            frameSkip: 1,
            enableIcons: true,
            textureSize: 64,
            maxFPS: 60,
            enablePostProcessing: true,
            enableShaderParticles: true,
            bloomStrength: 0.8,
            bloomRadius: 0.5,
            mouseReactivity: true,
            vignetteIntensity: 0.3,
        },
        low: {
            tier: 'low',
            particleCount: 500,
            iconCount: 6,
            pixelRatio: 1,
            antialias: false,
            enableBloom: false,
            frameSkip: 2,
            enableIcons: true,
            textureSize: 32,
            maxFPS: 30,
            enablePostProcessing: false,
            enableShaderParticles: true,
            bloomStrength: 0,
            bloomRadius: 0,
            mouseReactivity: false,
            vignetteIntensity: 0,
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
            textureSize: 32,
            maxFPS: 30,
            enablePostProcessing: false,
            enableShaderParticles: false,
            bloomStrength: 0,
            bloomRadius: 0,
            mouseReactivity: false,
            vignetteIntensity: 0,
        },
    };

    return baseSettings[tier];
}

/**
 * Synchronously detect performance capabilities and return optimized settings
 */
export function detectPerformanceSync(): PerformanceResult {
    // Detect WebGL
    const { hasWebGL, hasWebGL2, vendor, renderer } = detectWebGL();

    // Detect device type
    const { isMobile, isTablet } = detectDeviceType();

    // Gather device info
    const deviceInfo: DeviceInfo = {
        isMobile,
        isTablet,
        hasWebGL,
        hasWebGL2,
        gpuVendor: vendor,
        gpuRenderer: renderer,
        deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio || 1,
        isLowPowerMode: false, // Cannot reliably detect this
        score: 0,
    };

    // Calculate score
    deviceInfo.score = calculateScore(deviceInfo);

    // Determine tier
    const tier = getTier(deviceInfo.score, hasWebGL);

    // Generate settings
    const settings = generateSettings(tier, deviceInfo);

    return { settings, deviceInfo };
}

/**
 * Async version with benchmark (for more accurate detection)
 */
export async function detectPerformance(): Promise<PerformanceResult> {
    // For now, just use sync detection
    // Could add actual GPU benchmarking here in the future
    return detectPerformanceSync();
}

export default detectPerformanceSync;
