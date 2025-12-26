import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, SiteSettings } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import { Eye, EyeOff, MessageCircle, Calendar, Phone } from 'lucide-react';
import {
    AdminPageHeader,
    AdminCard,
    AdminButton,
    AdminInput,
    AdminLoader
} from '../../components/Admin';

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
};

export default function SettingsEditor() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    if (loading) return <AdminLoader text="Loading settings..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Settings"
                subtitle="Configure page visibility & contact options"
                actions={
                    <AdminButton onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </AdminButton>
                }
            />

            <div className="max-w-3xl space-y-6">
                {/* Page Visibility */}
                <AdminCard title="Page Visibility" accentColor="orange">
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
