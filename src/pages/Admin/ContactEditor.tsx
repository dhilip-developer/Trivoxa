import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, SocialLink } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminButton,
    AdminLoader,
    AdminEmptyState
} from '../../components/Admin';
import { Linkedin, Instagram, MessageCircle, Mail, MapPin, Github, Twitter, Globe, Youtube, Facebook, Phone, Plus, Trash2, Edit3, RotateCcw, Save, Check, X } from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
    'linkedin': <Linkedin className="w-5 h-5" />,
    'instagram': <Instagram className="w-5 h-5" />,
    'whatsapp': <MessageCircle className="w-5 h-5" />,
    'mail': <Mail className="w-5 h-5" />,
    'location': <MapPin className="w-5 h-5" />,
    'github': <Github className="w-5 h-5" />,
    'twitter': <Twitter className="w-5 h-5" />,
    'website': <Globe className="w-5 h-5" />,
    'youtube': <Youtube className="w-5 h-5" />,
    'facebook': <Facebook className="w-5 h-5" />,
    'phone': <Phone className="w-5 h-5" />,
};

const presetPlatforms = [
    { name: 'LinkedIn', icon: 'linkedin' },
    { name: 'WhatsApp', icon: 'whatsapp' },
    { name: 'Instagram', icon: 'instagram' },
    { name: 'Mail', icon: 'mail' },
    { name: 'Location', icon: 'location' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Twitter/X', icon: 'twitter' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'YouTube', icon: 'youtube' },
    { name: 'Website', icon: 'website' },
    { name: 'Phone', icon: 'phone' },
];

const defaultSocialLinks: SocialLink[] = [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/trivoxa", icon: "linkedin" },
    { platform: "WhatsApp", url: "https://wa.me/916374106956", icon: "whatsapp" },
    { platform: "Instagram", url: "https://www.instagram.com/trivoxa_technology/", icon: "instagram" },
    { platform: "Mail", url: "mailto:trivoxatechnology@gmail.com", icon: "mail" },
    { platform: "Location", url: "#", icon: "location" },
];

export default function ContactEditor() {
    const { showToast } = useToast();
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLink, setNewLink] = useState<SocialLink>({ platform: '', url: '', icon: '' });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const docSnap = await getDoc(doc(db, COLLECTIONS.CONTACT, 'main'));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSocialLinks(data.socialLinks || defaultSocialLinks);
                } else {
                    setSocialLinks(defaultSocialLinks);
                }
            } catch (error) {
                console.error(error);
                setSocialLinks(defaultSocialLinks);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, COLLECTIONS.CONTACT, 'main'), {
                socialLinks,
                updatedAt: serverTimestamp(),
            });
            showToast('Social links saved', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = async () => {
        if (!confirm('Reset all social links to defaults?')) return;
        setSaving(true);
        try {
            setSocialLinks(defaultSocialLinks);
            await setDoc(doc(db, COLLECTIONS.CONTACT, 'main'), {
                socialLinks: defaultSocialLinks,
                updatedAt: serverTimestamp(),
            });
            showToast('Reset to defaults', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const addSocialLink = () => {
        if (newLink.platform && newLink.url && newLink.icon) {
            setSocialLinks([...socialLinks, { ...newLink, id: Date.now().toString() }]);
            setNewLink({ platform: '', url: '', icon: '' });
            setShowAddForm(false);
            showToast('Link added', 'success');
        }
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
        showToast('Link removed', 'info');
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    const getIcon = (iconKey: string) => iconMap[iconKey] || <Globe className="w-5 h-5" />;

    if (loading) return <AdminLoader text="Loading social links..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Social Links"
                subtitle="Manage social media links displayed on your website"
                actions={
                    <>
                        <AdminButton variant="secondary" onClick={resetToDefaults} disabled={saving}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </AdminButton>
                        <AdminButton onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                        </AdminButton>
                    </>
                }
            />

            <div className="max-w-3xl space-y-6">
                {/* Social Links */}
                <AdminCard title="Social Links" accentColor="orange">
                    <div className="space-y-3">
                        {socialLinks.length === 0 ? (
                            <AdminEmptyState
                                icon={<Globe className="w-12 h-12" />}
                                title="No social links"
                                description="Add your social media links"
                            />
                        ) : (
                            socialLinks.map((link, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-black/30 border border-white/10 rounded-xl group hover:border-orange-500/30 transition-all"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 rounded-xl text-orange-400">
                                        {getIcon(link.icon)}
                                    </div>

                                    {editingIndex === index ? (
                                        <>
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                                                    placeholder="Platform"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                                                    placeholder="URL"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setEditingIndex(null)}
                                                className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-sm">{link.platform}</p>
                                                <p className="text-gray-500 text-xs font-mono truncate">{link.url}</p>
                                            </div>
                                            <button
                                                onClick={() => setEditingIndex(index)}
                                                className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeSocialLink(index)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add New Link */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        {showAddForm ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={newLink.icon}
                                        onChange={(e) => {
                                            const preset = presetPlatforms.find(p => p.icon === e.target.value);
                                            setNewLink({
                                                ...newLink,
                                                icon: e.target.value,
                                                platform: preset?.name || newLink.platform,
                                            });
                                        }}
                                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                                    >
                                        <option value="">Select Platform</option>
                                        {presetPlatforms.map(p => (
                                            <option key={p.icon} value={p.icon}>{p.name}</option>
                                        ))}
                                    </select>
                                    <AdminInput
                                        label=""
                                        value={newLink.url}
                                        onChange={(v) => setNewLink({ ...newLink, url: v })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <AdminButton size="sm" onClick={addSocialLink}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </AdminButton>
                                    <AdminButton size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                    </AdminButton>
                                </div>
                            </div>
                        ) : (
                            <AdminButton variant="secondary" onClick={() => setShowAddForm(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Social Link
                            </AdminButton>
                        )}
                    </div>
                </AdminCard>

                {/* Preview */}
                <AdminCard title="Preview" accentColor="purple">
                    <div className="flex flex-wrap gap-3 justify-center py-4">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 rounded-xl text-orange-400 hover:from-orange-500/30 hover:to-orange-500/10 transition-all"
                            >
                                {getIcon(link.icon)}
                            </a>
                        ))}
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
