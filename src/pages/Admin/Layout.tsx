import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { ToastProvider } from '../../components/Toast';
import { LayoutDashboard, Sparkles, Layers, FolderOpen, Users, Inbox, FileText, Phone, LogOut, Menu, X, Scale, Quote, HelpCircle, Settings } from 'lucide-react';

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/hero', label: 'Hero Section', icon: Sparkles },
    { path: '/admin/services', label: 'Services', icon: Layers },
    { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { path: '/admin/about', label: 'About Us', icon: Users },
    { path: '/admin/requests', label: 'Requests', icon: Inbox },
    { path: '/admin/testimonials', label: 'Testimonials', icon: Quote },
    { path: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/admin/footer', label: 'Footer', icon: FileText },
    { path: '/admin/contact', label: 'Contact', icon: Phone },
    { path: '/admin/legal', label: 'Legal Pages', icon: Scale },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
];


export default function AdminLayout() {
    const { user, isAdmin, loading, signOut } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-orange-500 font-mono text-sm">INITIALIZING...</span>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#0a0a0a] flex">
                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-orange-500/20 px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trivoxa%20Triangle-T4Igp0N8CleyCcUafkEQb6G2rIGwCv.png"
                            alt="Trivoxa"
                            className="w-8 h-8"
                        />
                        <span className="text-white font-bold">TRIVOXA</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    w-72 bg-black/80 backdrop-blur-xl border-r border-orange-500/20 flex flex-col
                    fixed h-screen overflow-hidden z-50
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}>
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    </div>

                    {/* Logo */}
                    <div className="p-6 border-b border-orange-500/20 relative z-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trivoxa%20Triangle-T4Igp0N8CleyCcUafkEQb6G2rIGwCv.png"
                                    alt="Trivoxa"
                                    className="w-10 h-10 relative z-10"
                                />
                            </div>
                            <div>
                                <h1 className="text-white font-bold tracking-wide">TRIVOXA</h1>
                                <p className="text-orange-500 text-xs font-mono tracking-widest">ADMIN_PANEL</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 relative z-10 overflow-y-auto">
                        <p className="text-gray-600 text-xs font-mono mb-3 px-3">// NAVIGATION</p>
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-mono text-sm ${location.pathname === item.path
                                            ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-orange-400 border-l-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                        {location.pathname === item.path && (
                                            <span className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User & Logout */}
                    <div className="p-4 border-t border-orange-500/20 relative z-10">
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <p className="text-gray-600 text-xs font-mono mb-1">// LOGGED_IN_AS</p>
                            <div className="text-gray-400 text-sm truncate font-mono">
                                {user?.email}
                            </div>
                            <button
                                onClick={signOut}
                                className="mt-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-mono border border-red-500/20 hover:border-red-500/40"
                            >
                                [ SIGN_OUT ]
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-72 overflow-auto relative min-h-screen pt-16 md:pt-0">
                    {/* Scanline effect */}
                    <div className="pointer-events-none fixed inset-0 md:ml-72 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20 z-40" />
                    <div className="min-h-screen">
                        <Outlet />
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
