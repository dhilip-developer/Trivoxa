import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, SiteSettings } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import { Eye, EyeOff, MessageCircle, Calendar, Phone, Plus, Trash2, Shield, User, Lock, KeyRound, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import {
    AdminPageHeader,
    AdminCard,
    AdminButton,
    AdminInput,
    AdminLoader
} from '../../components/Admin';

// Primary admin email (always active, cannot be removed)
const PRIMARY_ADMIN_EMAIL = 'trivoxatechnology@gmail.com';

const defaultSettings: SiteSettings = {
    siteName: 'Trivoxa',
    tagline: 'Next-Gen Software Solutions',
    logo: '',
    contactEmail: 'contact@trivoxa.com',
    footerText: '© 2024 Trivoxa. All rights reserved.',
    copyrightText: '© 2024 Trivoxa',
    quickLinks: [],
    serviceLinks: [],
    socialLinks: [],
    legalLinks: [],
    pageVisibility: {
        hero: true,
        services: true,
        projects: true,
        about: true,
        testimonials: true,
        faq: true,
        contact: true,
    },
    contactMode: 'free',
    whatsappNumber: '',
    adminCredentials: [
        { id: 'Admin@trivoxa', password: 'Trivoxa@2025', name: 'Primary Admin' }
    ],
    allowedEmails: [],
};

export default function SettingsEditor() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newCredential, setNewCredential] = useState({ id: '', password: '', name: '' });
    const [newEmail, setNewEmail] = useState({ email: '', name: '' });
    const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
                if (docSnap.exists()) {
                    const data = docSnap.data() as Partial<SiteSettings>;
                    setSettings({
                        ...defaultSettings,
                        ...data,
                        pageVisibility: {
                            ...defaultSettings.pageVisibility,
                            ...(data.pageVisibility || {}),
                        },
                        adminCredentials: data.adminCredentials || defaultSettings.adminCredentials,
                        allowedEmails: data.allowedEmails || [],
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'main'), {
                ...settings,
                updatedAt: serverTimestamp(),
            });
            showToast('Settings saved', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    // Credential management
    const addCredential = () => {
        if (!newCredential.id || !newCredential.password || !newCredential.name) {
            showToast('Fill all fields', 'error');
            return;
        }
        if (settings.adminCredentials?.some(c => c.id === newCredential.id)) {
            showToast('Admin ID already exists', 'error');
            return;
        }
        setSettings({
            ...settings,
            adminCredentials: [...(settings.adminCredentials || []), { ...newCredential }]
        });
        setNewCredential({ id: '', password: '', name: '' });
        showToast('Credential added - Save to apply', 'info');
    };

    const removeCredential = (id: string) => {
        if (settings.adminCredentials?.length === 1) {
            showToast('Cannot remove last credential', 'error');
            return;
        }
        setSettings({
            ...settings,
            adminCredentials: settings.adminCredentials?.filter(c => c.id !== id) || []
        });
        showToast('Credential removed - Save to apply', 'info');
    };

    const updateCredential = (index: number, field: 'id' | 'password' | 'name', value: string) => {
        const updated = [...(settings.adminCredentials || [])];
        updated[index] = { ...updated[index], [field]: value };
        setSettings({ ...settings, adminCredentials: updated });
    };

    const toggleShowPassword = (index: number) => {
        setShowPasswords({ ...showPasswords, [index]: !showPasswords[index] });
    };

    // Email whitelist management
    const addEmail = () => {
        if (!newEmail.email || !newEmail.name) {
            showToast('Fill email and name', 'error');
            return;
        }
        const normalizedEmail = newEmail.email.toLowerCase().trim();
        if (normalizedEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
            showToast('Primary email is already authorized', 'error');
            return;
        }
        if (settings.allowedEmails?.some(e => e.email.toLowerCase() === normalizedEmail)) {
            showToast('Email already added', 'error');
            return;
        }
        setSettings({
            ...settings,
            allowedEmails: [...(settings.allowedEmails || []), { email: normalizedEmail, name: newEmail.name, enabled: true }]
        });
        setNewEmail({ email: '', name: '' });
        showToast('Email added - Save to apply', 'info');
    };

    const removeEmail = (email: string) => {
        setSettings({
            ...settings,
            allowedEmails: settings.allowedEmails?.filter(e => e.email !== email) || []
        });
        showToast('Email removed - Save to apply', 'info');
    };

    const toggleEmail = (email: string) => {
        setSettings({
            ...settings,
            allowedEmails: settings.allowedEmails?.map(e =>
                e.email === email ? { ...e, enabled: !e.enabled } : e
            ) || []
        });
    };

    if (loading) return <AdminLoader text="Loading settings..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Settings"
                subtitle="Configure admin access, page visibility & contact options"
                actions={
                    <AdminButton onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </AdminButton>
                }
            />

            <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Google Login Emails */}
                <AdminCard title="Google Login Access" accentColor="blue">
                    <p className="text-gray-500 text-sm mb-4">Manage which Google accounts can login to admin panel</p>

                    {/* Primary Email (always active) */}
                    <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-green-400" />
                            <div className="flex-1">
                                <p className="text-green-400 font-medium text-sm">Primary Admin</p>
                                <p className="text-gray-400 text-xs font-mono">{PRIMARY_ADMIN_EMAIL}</p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Always Active</span>
                        </div>
                    </div>

                    {/* Additional Emails */}
                    <div className="space-y-2 mb-4">
                        {settings.allowedEmails?.map((e, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${e.enabled
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-gray-500/10 border-gray-500/30'
                                    }`}
                            >
                                <Mail className={`w-4 h-4 ${e.enabled ? 'text-blue-400' : 'text-gray-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${e.enabled ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {e.name}
                                    </p>
                                    <p className="text-gray-500 text-xs font-mono truncate">{e.email}</p>
                                </div>
                                <button
                                    onClick={() => toggleEmail(e.email)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    title={e.enabled ? 'Revoke Access' : 'Grant Access'}
                                >
                                    {e.enabled ? (
                                        <ToggleRight className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <ToggleLeft className="w-6 h-6 text-gray-500" />
                                    )}
                                </button>
                                <button
                                    onClick={() => removeEmail(e.email)}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-500 hover:text-red-400"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Email */}
                    <div className="p-4 rounded-xl border border-dashed border-white/20 space-y-3">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs font-mono uppercase">+ Add Google Account</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AdminInput
                                label="Name"
                                value={newEmail.name}
                                onChange={(v) => setNewEmail({ ...newEmail, name: v })}
                                placeholder="e.g., Team Member"
                                icon={<User className="w-4 h-4" />}
                            />
                            <AdminInput
                                label="Gmail Address"
                                value={newEmail.email}
                                onChange={(v) => setNewEmail({ ...newEmail, email: v })}
                                placeholder="user@gmail.com"
                                icon={<Mail className="w-4 h-4" />}
                            />
                        </div>
                        <AdminButton
                            size="sm"
                            variant="secondary"
                            onClick={addEmail}
                            disabled={!newEmail.email || !newEmail.name}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Email
                        </AdminButton>
                    </div>
                </AdminCard>

                {/* Admin Credentials */}
                <AdminCard title="Admin Credentials" accentColor="orange">
                    <p className="text-gray-500 text-sm mb-4">Manage login credentials for admin panel access</p>

                    {/* Existing Credentials */}
                    <div className="space-y-3 mb-4">
                        {settings.adminCredentials?.map((cred, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-orange-400" />
                                        <span className="text-white font-medium text-sm">{cred.name}</span>
                                    </div>
                                    {(settings.adminCredentials?.length || 0) > 1 && (
                                        <button
                                            onClick={() => removeCredential(cred.id)}
                                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-500 hover:text-red-400"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Name</label>
                                        <input
                                            type="text"
                                            value={cred.name}
                                            onChange={(e) => updateCredential(i, 'name', e.target.value)}
                                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-orange-500/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Admin ID</label>
                                        <input
                                            type="text"
                                            value={cred.id}
                                            onChange={(e) => updateCredential(i, 'id', e.target.value)}
                                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm font-mono focus:border-orange-500/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords[i] ? 'text' : 'password'}
                                                value={cred.password}
                                                onChange={(e) => updateCredential(i, 'password', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 bg-black/40 border border-white/10 rounded-lg text-white text-sm font-mono focus:border-orange-500/50 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShowPassword(i)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                            >
                                                {showPasswords[i] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Credential */}
                    <div className="p-4 rounded-xl border border-dashed border-white/20 space-y-3">
                        <div className="flex items-center gap-2 text-gray-400">
                            <KeyRound className="w-4 h-4" />
                            <span className="text-xs font-mono uppercase">+ Add New Credential</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <AdminInput
                                label="Name"
                                value={newCredential.name}
                                onChange={(v) => setNewCredential({ ...newCredential, name: v })}
                                placeholder="e.g., Team Admin"
                                icon={<User className="w-4 h-4" />}
                            />
                            <AdminInput
                                label="Admin ID"
                                value={newCredential.id}
                                onChange={(v) => setNewCredential({ ...newCredential, id: v })}
                                placeholder="e.g., admin@company"
                            />
                            <AdminInput
                                label="Password"
                                value={newCredential.password}
                                onChange={(v) => setNewCredential({ ...newCredential, password: v })}
                                placeholder="Strong password"
                                icon={<Lock className="w-4 h-4" />}
                            />
                        </div>
                        <AdminButton
                            size="sm"
                            variant="secondary"
                            onClick={addCredential}
                            disabled={!newCredential.id || !newCredential.password || !newCredential.name}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Credential
                        </AdminButton>
                    </div>
                </AdminCard>

                {/* Page Visibility */}
                <AdminCard title="Page Visibility" accentColor="green">
                    <p className="text-gray-500 text-sm mb-4">Toggle visibility of website sections</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { key: 'hero', label: 'Hero Section' },
                            { key: 'services', label: 'Services' },
                            { key: 'projects', label: 'Projects' },
                            { key: 'about', label: 'About Us' },
                            { key: 'testimonials', label: 'Testimonials' },
                            { key: 'faq', label: 'FAQ' },
                            { key: 'contact', label: 'Contact' },
                        ].map(({ key, label }) => {
                            const isVisible = settings.pageVisibility?.[key as keyof typeof settings.pageVisibility] ?? true;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSettings({
                                        ...settings,
                                        pageVisibility: {
                                            ...settings.pageVisibility,
                                            [key]: !isVisible,
                                        }
                                    })}
                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isVisible
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                                        }`}
                                >
                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </AdminCard>

                {/* Contact Mode */}
                <AdminCard title="Contact Mode" accentColor="purple">
                    <p className="text-gray-500 text-sm mb-4">Choose how visitors can contact you</p>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setSettings({ ...settings, contactMode: 'free' })}
                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${settings.contactMode === 'free' || !settings.contactMode
                                ? 'bg-green-500/10 border-green-500/30 ring-2 ring-green-500/50'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <MessageCircle className={`w-8 h-8 ${settings.contactMode === 'free' || !settings.contactMode ? 'text-green-400' : 'text-gray-500'}`} />
                            <div className="text-center">
                                <h4 className={`font-semibold ${settings.contactMode === 'free' || !settings.contactMode ? 'text-green-400' : 'text-white'}`}>Free Mode</h4>
                                <p className="text-xs text-gray-500 mt-1">WhatsApp direct chat</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, contactMode: 'rush' })}
                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${settings.contactMode === 'rush'
                                ? 'bg-orange-500/10 border-orange-500/30 ring-2 ring-orange-500/50'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <Calendar className={`w-8 h-8 ${settings.contactMode === 'rush' ? 'text-orange-400' : 'text-gray-500'}`} />
                            <div className="text-center">
                                <h4 className={`font-semibold ${settings.contactMode === 'rush' ? 'text-orange-400' : 'text-white'}`}>Rush Mode</h4>
                                <p className="text-xs text-gray-500 mt-1">Appointment booking</p>
                            </div>
                        </button>
                    </div>

                    <AdminInput
                        label="WhatsApp Number (with country code)"
                        value={settings.whatsappNumber || ''}
                        onChange={(v) => setSettings({ ...settings, whatsappNumber: v })}
                        placeholder="+91 98765 43210"
                        icon={<Phone className="w-4 h-4" />}
                    />
                    <p className="text-gray-600 text-xs mt-2">Used for Free Mode WhatsApp button</p>
                </AdminCard>
            </div>
        </div>
    );
}
