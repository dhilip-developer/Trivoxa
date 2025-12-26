import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS } from '../../lib/firestore';
import { seedFirestore } from '../../lib/seedFirestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminStatCard,
    AdminButton,
    AdminLoader
} from '../../components/Admin';
import { RefreshCw, Layout, Layers, FolderOpen, FileText, Users, ArrowRight, Inbox, Globe, Phone, Clock, Edit3, Plus, Trash2, Scale } from 'lucide-react';

interface Stats {
    services: number;
    projects: number;
    requests: number;
}

interface ActivityLog {
    type: 'service' | 'project' | 'settings' | 'legal' | 'contact' | 'request';
    action: 'created' | 'updated' | 'deleted';
    title: string;
    timestamp: Date;
}

export default function Dashboard() {
    const { showToast } = useToast();
    const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, requests: 0 });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);

    const fetchStats = async () => {
        try {
            const [servicesSnap, projectsSnap, requestsSnap] = await Promise.all([
                getDocs(collection(db, COLLECTIONS.SERVICES)),
                getDocs(collection(db, COLLECTIONS.PROJECTS)),
                getDocs(collection(db, COLLECTIONS.REQUESTS)),
            ]);

            setStats({
                services: servicesSnap.size,
                projects: projectsSnap.size,
                requests: requestsSnap.size,
            });

            // Build activity log from updatedAt timestamps
            const activities: ActivityLog[] = [];

            // Services activity
            servicesSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.updatedAt) {
                    activities.push({
                        type: 'service',
                        action: 'updated',
                        title: data.title || 'Service',
                        timestamp: data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
                    });
                }
            });

            // Projects activity
            projectsSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.updatedAt) {
                    activities.push({
                        type: 'project',
                        action: 'updated',
                        title: data.title || 'Project',
                        timestamp: data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
                    });
                }
            });

            // Requests activity
            requestsSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.createdAt) {
                    activities.push({
                        type: 'request',
                        action: 'created',
                        title: data.name || 'New Request',
                        timestamp: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                    });
                }
            });

            // Sort by timestamp descending and take latest 8
            activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setRecentActivity(activities.slice(0, 8));

        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        const result = await seedFirestore();
        if (result.success) {
            showToast('Data synced successfully', 'success');
            fetchStats();
        } else {
            showToast(`Error: ${result.error}`, 'error');
        }
        setSyncing(false);
    };

    const quickActions = [
        { label: 'Hero Section', path: '/admin/hero', icon: <Layout className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400' },
        { label: 'Services', path: '/admin/services', icon: <Layers className="w-5 h-5" />, color: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400' },
        { label: 'Projects', path: '/admin/projects', icon: <FolderOpen className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400' },
        { label: 'About Us', path: '/admin/about', icon: <Users className="w-5 h-5" />, color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400' },
        { label: 'Requests', path: '/admin/requests', icon: <Inbox className="w-5 h-5" />, color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400' },
        { label: 'Footer', path: '/admin/footer', icon: <FileText className="w-5 h-5" />, color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400' },
        { label: 'Contact', path: '/admin/contact', icon: <Phone className="w-5 h-5" />, color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400' },
        { label: 'Legal Pages', path: '/admin/legal', icon: <Scale className="w-5 h-5" />, color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400' },
    ];

    const getActivityIcon = (type: string, action: string) => {
        if (action === 'created') return <Plus className="w-4 h-4" />;
        if (action === 'deleted') return <Trash2 className="w-4 h-4" />;
        return <Edit3 className="w-4 h-4" />;
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'service': return 'text-green-400 bg-green-500/10';
            case 'project': return 'text-purple-400 bg-purple-500/10';
            case 'request': return 'text-cyan-400 bg-cyan-500/10';
            case 'settings': return 'text-orange-400 bg-orange-500/10';
            case 'legal': return 'text-indigo-400 bg-indigo-500/10';
            default: return 'text-gray-400 bg-white/5';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) return <AdminLoader text="Loading dashboard..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Dashboard"
                subtitle="Welcome to Trivoxa Admin Panel"
                actions={
                    <AdminButton onClick={handleSync} disabled={syncing} variant="secondary">
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Data'}
                    </AdminButton>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <AdminStatCard
                    label="Services"
                    value={stats.services.toString().padStart(2, '0')}
                    icon={<Layers />}
                    color="blue"
                />
                <AdminStatCard
                    label="Projects"
                    value={stats.projects.toString().padStart(2, '0')}
                    icon={<FolderOpen />}
                    color="green"
                />
                <AdminStatCard
                    label="Requests"
                    value={stats.requests.toString().padStart(2, '0')}
                    icon={<Inbox />}
                    color="purple"
                />
                <AdminStatCard
                    label="Status"
                    value="Active"
                    icon={<Globe />}
                    color="orange"
                />
            </div>

            {/* Quick Actions */}
            <AdminCard title="Quick Actions" accentColor="orange" className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="group flex flex-col items-center gap-2 p-4 bg-black/30 border border-white/5 rounded-xl hover:border-orange-500/30 hover:bg-black/50 transition-all"
                        >
                            <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${action.color} border rounded-xl group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <p className="text-white font-medium text-xs text-center">{action.label}</p>
                        </Link>
                    ))}
                </div>
            </AdminCard>

            {/* Activity & Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <AdminCard title="Recent Activity" accentColor="blue">
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No recent activity</p>
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg group hover:bg-black/50 transition-colors">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}>
                                        {getActivityIcon(activity.type, activity.action)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm truncate">
                                            <span className="capitalize">{activity.type}</span>: {activity.title}
                                        </p>
                                        <p className="text-gray-500 text-xs capitalize">{activity.action}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-gray-500 text-xs font-mono">{formatTimeAgo(activity.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </AdminCard>

                {/* System Status */}
                <AdminCard title="System Status" accentColor="green">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400 text-sm">Firebase Connection</span>
                            <span className="flex items-center gap-2 text-green-400 text-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400 text-sm">Database Status</span>
                            <span className="flex items-center gap-2 text-green-400 text-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Operational
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400 text-sm">Last Sync</span>
                            <span className="text-gray-500 text-sm font-mono">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400 text-sm">Total Items</span>
                            <span className="text-white text-sm font-mono">
                                {stats.services + stats.projects + stats.requests}
                            </span>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
