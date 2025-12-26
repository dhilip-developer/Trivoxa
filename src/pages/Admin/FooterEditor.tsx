import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, SiteSettings } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader,
} from '../../components/Admin';
import { Globe, Save, FileText, Image, Mail, Phone, MapPin } from 'lucide-react';

const defaultSettings: SiteSettings = {
    siteName: 'Trivoxa',
    tagline: 'Next-Gen Software Solutions',
    logo: '',
    footerText: 'Premium software development services to transform your ideas into reality. Custom solutions designed for your unique needs.',
    copyrightText: '© 2025 Trivoxa. All rights reserved.',
    quickLinks: [],
    serviceLinks: [],
    socialLinks: [],
    legalLinks: [],
};

interface FooterContact {
    email: string;
    phone: string;
    address: string;
}

const defaultContact: FooterContact = {
    email: 'trivoxatechnology@gmail.com',
    phone: '+91 6374106956',
    address: 'Virtualy Service All Over The World, Founders Located Chennai',
};

export default function FooterEditor() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [contact, setContact] = useState<FooterContact>(defaultContact);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch site settings
                const settingsSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
                if (settingsSnap.exists()) {
                    const data = settingsSnap.data() as SiteSettings;
                    setSettings({ ...defaultSettings, ...data });
                }

                // Fetch contact info
                const contactSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'footerContact'));
                if (contactSnap.exists()) {
                    const data = contactSnap.data() as FooterContact;
                    setContact({ ...defaultContact, ...data });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save site settings
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'main'), {
                ...settings,
                updatedAt: serverTimestamp(),
            });

            // Save footer contact
            await setDoc(doc(db, COLLECTIONS.SETTINGS, 'footerContact'), {
                ...contact,
                updatedAt: serverTimestamp(),
            });

            showToast('Footer settings saved', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLoader text="Loading footer settings..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Footer Editor"
                subtitle="Customize footer branding, description, and contact info"
                actions={
                    <AdminButton onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save All'}
                    </AdminButton>
                }
            />

            <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Logo & Branding */}
                <AdminCard title="Branding" accentColor="orange">
                    <div className="space-y-4">
                        <AdminInput
                            label="Logo URL"
                            value={settings.logo}
                            onChange={(v) => setSettings({ ...settings, logo: v })}
                            icon={<Image className="w-4 h-4" />}
                            placeholder="https://... (leave empty for default)"
                        />
                        <AdminInput
                            label="Site Name"
                            value={settings.siteName}
                            onChange={(v) => setSettings({ ...settings, siteName: v })}
                            icon={<Globe className="w-4 h-4" />}
                            placeholder="Trivoxa"
                        />
                    </div>
                </AdminCard>

                {/* Footer Description */}
                <AdminCard title="Footer Description" accentColor="blue">
                    <AdminTextarea
                        label="Description Text"
                        value={settings.footerText}
                        onChange={(v) => setSettings({ ...settings, footerText: v })}
                        icon={<FileText className="w-4 h-4" />}
                        placeholder="Premium software development services..."
                        rows={3}
                    />
                </AdminCard>

                {/* Contact Info */}
                <AdminCard title="Contact Information" accentColor="green">
                    <div className="space-y-4">
                        <AdminInput
                            label="Email Address"
                            value={contact.email}
                            onChange={(v) => setContact({ ...contact, email: v })}
                            icon={<Mail className="w-4 h-4" />}
                            placeholder="contact@example.com"
                            type="email"
                        />
                        <AdminInput
                            label="Phone Number"
                            value={contact.phone}
                            onChange={(v) => setContact({ ...contact, phone: v })}
                            icon={<Phone className="w-4 h-4" />}
                            placeholder="+91 1234567890"
                        />
                        <AdminTextarea
                            label="Address"
                            value={contact.address}
                            onChange={(v) => setContact({ ...contact, address: v })}
                            icon={<MapPin className="w-4 h-4" />}
                            placeholder="Your address or location description"
                            rows={2}
                        />
                    </div>
                </AdminCard>

                {/* Preview */}
                <AdminCard title="Preview" accentColor="purple">
                    <div className="bg-black/60 rounded-xl p-6 border border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left - Branding */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    {settings.logo ? (
                                        <img src={settings.logo} alt="Logo" className="h-8 w-auto" />
                                    ) : (
                                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-400 text-sm font-bold">T</span>
                                        </div>
                                    )}
                                    <span className="text-orange-400 font-bold text-xl">{settings.siteName || 'Trivoxa'}</span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {settings.footerText || 'Footer description...'}
                                </p>
                            </div>

                            {/* Right - Contact */}
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-sm mb-3">Contact</h4>
                                <p className="text-gray-400 text-xs flex items-start gap-2">
                                    <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                    {contact.email}
                                </p>
                                <p className="text-gray-400 text-xs flex items-start gap-2">
                                    <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                    {contact.phone}
                                </p>
                                <p className="text-gray-400 text-xs flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                    {contact.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
