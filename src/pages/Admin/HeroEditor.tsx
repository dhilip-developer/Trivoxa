import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, HeroContent } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader
} from '../../components/Admin';
import { Save, Eye, EyeOff, Type, AlignLeft, MousePointer } from 'lucide-react';

const defaultHero: HeroContent = {
    badge: "Next-Gen Software Solutions",
    headline: "Transform Ideas Into Digital Reality",
    subheadline: "We engineer premium web applications, immersive 3D experiences, and scalable software that defines the future of your business.",
    primaryBtn: { text: "Start Your Project", action: "form" },
    secondaryBtn: { text: "View Our Work", action: "#work" },
    isPublished: true,
};

export default function HeroEditor() {
    const { showToast } = useToast();
    const [content, setContent] = useState<HeroContent>(defaultHero);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, COLLECTIONS.HERO, "main");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setContent({ id: docSnap.id, ...docSnap.data() } as HeroContent);
                }
            } catch (error) {
                console.error("Error fetching hero:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, COLLECTIONS.HERO, "main");
            await setDoc(docRef, {
                ...content,
                updatedAt: serverTimestamp(),
            });
            showToast('Hero content saved', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLoader text="Loading hero content..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Hero Section"
                subtitle="Edit your landing page hero content"
                actions={
                    <div className="flex gap-3">
                        <AdminButton
                            variant="secondary"
                            onClick={() => setContent({ ...content, isPublished: !content.isPublished })}
                        >
                            {content.isPublished ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                            {content.isPublished ? 'Published' : 'Draft'}
                        </AdminButton>
                        <AdminButton onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
                {/* Main Content */}
                <AdminCard title="Content" accentColor="orange" className="lg:col-span-2">
                    <div className="space-y-4">
                        <AdminInput
                            label="Badge Text"
                            value={content.badge}
                            onChange={(v) => setContent({ ...content, badge: v })}
                            placeholder="e.g., Next-Gen Solutions"
                            icon={<Type className="w-4 h-4" />}
                        />
                        <AdminInput
                            label="Headline"
                            value={content.headline}
                            onChange={(v) => setContent({ ...content, headline: v })}
                            placeholder="Main headline text"
                            icon={<Type className="w-4 h-4" />}
                        />
                        <AdminTextarea
                            label="Subheadline"
                            value={content.subheadline}
                            onChange={(v) => setContent({ ...content, subheadline: v })}
                            placeholder="Supporting description text"
                            rows={3}
                            icon={<AlignLeft className="w-4 h-4" />}
                        />
                    </div>
                </AdminCard>

                {/* Primary Button */}
                <AdminCard title="Primary Button" accentColor="blue">
                    <div className="space-y-4">
                        <AdminInput
                            label="Button Text"
                            value={content.primaryBtn.text}
                            onChange={(v) => setContent({ ...content, primaryBtn: { ...content.primaryBtn, text: v } })}
                            icon={<MousePointer className="w-4 h-4" />}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Action Type</label>
                            <select
                                value={content.primaryBtn.action}
                                onChange={(e) => setContent({ ...content, primaryBtn: { ...content.primaryBtn, action: e.target.value } })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none"
                            >
                                <option value="form">Open Contact Form</option>
                                <option value="#services">Scroll to Services</option>
                                <option value="#work">Scroll to Work</option>
                                <option value="#contact">Scroll to Contact</option>
                            </select>
                        </div>
                    </div>
                </AdminCard>

                {/* Secondary Button */}
                <AdminCard title="Secondary Button" accentColor="purple">
                    <div className="space-y-4">
                        <AdminInput
                            label="Button Text"
                            value={content.secondaryBtn.text}
                            onChange={(v) => setContent({ ...content, secondaryBtn: { ...content.secondaryBtn, text: v } })}
                            icon={<MousePointer className="w-4 h-4" />}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Action Type</label>
                            <select
                                value={content.secondaryBtn.action}
                                onChange={(e) => setContent({ ...content, secondaryBtn: { ...content.secondaryBtn, action: e.target.value } })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none"
                            >
                                <option value="#work">Scroll to Work</option>
                                <option value="#services">Scroll to Services</option>
                                <option value="#about">Scroll to About</option>
                                <option value="#contact">Scroll to Contact</option>
                            </select>
                        </div>
                    </div>
                </AdminCard>

                {/* Live Preview */}
                <AdminCard title="Preview" accentColor="green" className="lg:col-span-2">
                    <div className="bg-gradient-to-b from-black/80 to-black/40 rounded-xl p-8 border border-white/5">
                        <div className="text-center max-w-2xl mx-auto">
                            <span className="inline-block px-4 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm mb-4">
                                {content.badge}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {content.headline}
                            </h1>
                            <p className="text-gray-400 mb-6">
                                {content.subheadline}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <span className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium">
                                    {content.primaryBtn.text}
                                </span>
                                <span className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl">
                                    {content.secondaryBtn.text}
                                </span>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
