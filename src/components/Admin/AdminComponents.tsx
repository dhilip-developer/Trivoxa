import React from 'react';

// Reusable Admin Card Component
export const AdminCard = ({
    title,
    children,
    className = '',
    accentColor = 'orange'
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
    accentColor?: 'orange' | 'blue' | 'green' | 'purple';
}) => {
    const accentColors = {
        orange: 'from-orange-500/10 to-transparent border-orange-500/20',
        blue: 'from-blue-500/10 to-transparent border-blue-500/20',
        green: 'from-green-500/10 to-transparent border-green-500/20',
        purple: 'from-purple-500/10 to-transparent border-purple-500/20',
    };

    return (
        <div className={`relative bg-gradient-to-br ${accentColors[accentColor]} backdrop-blur-xl border rounded-2xl p-6 overflow-hidden group hover:border-opacity-50 transition-all duration-300 ${className}`}>
            {/* Animated glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {title && (
                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-1.5 h-4 rounded-full bg-${accentColor}-500`} />
                    <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

// Reusable Input Component
export const AdminInput = ({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    icon,
    className = '',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number';
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}) => (
    <div className={`space-y-2 ${className}`}>
        <label className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wide">
            {icon && <span className="text-orange-400">{icon}</span>}
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
        />
    </div>
);

// Reusable Textarea Component
export const AdminTextarea = ({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    icon,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    icon?: React.ReactNode;
}) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wide">
            {icon && <span className="text-orange-400">{icon}</span>}
            {label}
        </label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all resize-none"
        />
    </div>
);

// Primary Button
export const AdminButton = ({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    size = 'md',
    type = 'button',
    className = '',
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40',
        secondary: 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20',
        danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-5 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`font-mono rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
};

// Page Header Component
export const AdminPageHeader = ({
    title,
    subtitle,
    actions,
}: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {title}
                </h1>
            </div>
            {subtitle && (
                <p className="text-gray-500 font-mono text-sm ml-5">{subtitle}</p>
            )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
);

// Empty State Component
export const AdminEmptyState = ({
    icon,
    title,
    description,
    action,
}: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        {icon && <div className="text-4xl mb-4 opacity-50">{icon}</div>}
        <h3 className="text-lg font-mono text-gray-400 mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        {action}
    </div>
);

// Loading Spinner
export const AdminLoader = ({ text = 'Loading...' }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
            <div className="w-12 h-12 border-2 border-orange-500/30 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
        </div>
        <span className="text-orange-400 font-mono text-sm mt-4">{text}</span>
    </div>
);

// Stat Card Component
export const AdminStatCard = ({
    label,
    value,
    icon,
    trend,
    color = 'orange',
}: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    color?: 'orange' | 'blue' | 'green' | 'purple';
}) => {
    const colors = {
        orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
        blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
        green: 'from-green-500/20 to-green-500/5 border-green-500/30',
        purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-xl border rounded-2xl p-5 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={`text-xs font-mono mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                {icon && <div className="text-2xl opacity-60">{icon}</div>}
            </div>
        </div>
    );
};

// List Item with actions
export const AdminListItem = ({
    icon,
    title,
    subtitle,
    actions,
    onClick,
}: {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    onClick?: () => void;
}) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-xl hover:bg-black/40 hover:border-white/10 transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
        {icon && (
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 rounded-xl text-lg">
                {icon}
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{title}</p>
            {subtitle && <p className="text-gray-500 text-sm font-mono truncate">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
);

// Badge Component
export const AdminBadge = ({
    children,
    variant = 'default',
}: {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) => {
    const variants = {
        default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-mono border rounded-full ${variants[variant]}`}>
            {children}
        </span>
    );
};

// Auto-save status indicator
export const AutoSaveIndicator = ({
    status,
    lastSaved,
}: {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date | null;
}) => {
    if (status === 'idle' && !lastSaved) return null;

    const statusStyles = {
        idle: 'text-gray-500',
        saving: 'text-orange-400',
        saved: 'text-green-400',
        error: 'text-red-400',
    };

    const statusText = {
        idle: lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : '',
        saving: 'Saving...',
        saved: 'Saved ✓',
        error: 'Save failed',
    };

    return (
        <div className={`flex items-center gap-2 text-xs font-mono ${statusStyles[status]} transition-colors`}>
            {status === 'saving' && (
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
            )}
            {statusText[status]}
        </div>
    );
};

// Character counter for text fields
export const CharCounter = ({
    current,
    max,
    className = '',
}: {
    current: number;
    max?: number;
    className?: string;
}) => {
    const isNearLimit = max && current >= max * 0.9;
    const isOverLimit = max && current > max;

    return (
        <span className={`text-xs font-mono ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'} ${className}`}>
            {current}{max ? `/${max}` : ''} chars
        </span>
    );
};

// Textarea with character counter
export const AdminTextareaWithCounter = ({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    maxLength,
    icon,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    icon?: React.ReactNode;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wide">
                {icon && <span className="text-orange-400">{icon}</span>}
                {label}
            </label>
            <CharCounter current={value.length} max={maxLength} />
        </div>
        <textarea
            value={value}
            onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all resize-none"
        />
    </div>
);

// Loading button with spinner
export const AdminButtonWithLoading = ({
    children,
    onClick,
    loading = false,
    disabled = false,
    variant = 'primary',
    className = '',
}: {
    children: React.ReactNode;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20',
        secondary: 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white',
        danger: 'bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
            )}
            {children}
        </button>
    );
};
