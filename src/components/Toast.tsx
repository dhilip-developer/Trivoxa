import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container - Bottom right on desktop, top center on mobile */}
            <div className="fixed z-[100] pointer-events-none
        bottom-4 right-4 left-4 md:left-auto md:w-96
        top-auto md:top-auto
        flex flex-col gap-2
        sm:bottom-4 sm:right-4 sm:left-auto
        max-sm:top-4 max-sm:bottom-auto max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[90vw]
      ">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto
              px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl
              border font-mono text-sm
              animate-slide-in
              flex items-center gap-3
              ${toast.type === 'success'
                                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                                : toast.type === 'error'
                                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                    : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                            }
            `}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="text-lg">
                            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
                        </span>
                        <span className="flex-1">{toast.message}</span>
                        <button className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
                    </div>
                ))}
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    );
}
