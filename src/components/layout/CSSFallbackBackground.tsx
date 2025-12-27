/**
 * CSS Fallback Background
 * Pure CSS animated background for devices without WebGL support
 * Provides a graceful visual experience without JavaScript animation overhead
 */

import React from 'react';

export default function CSSFallbackBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />

            {/* Animated gradient orbs */}
            <div
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)',
                    animation: 'float-slow 20s ease-in-out infinite',
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
                    animation: 'float-slow 25s ease-in-out infinite reverse',
                }}
            />
            <div
                className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                    animation: 'float-slow 18s ease-in-out infinite 5s',
                }}
            />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Dot pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(249,115,22,0.8) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                }}
            />

            {/* CSS Keyframes */}
            <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          75% {
            transform: translate(-30px, -20px) scale(1.02);
          }
        }
      `}</style>
        </div>
    );
}
