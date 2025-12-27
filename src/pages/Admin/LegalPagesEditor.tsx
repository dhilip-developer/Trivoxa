import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, LegalPage } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader,
} from '../../components/Admin';
import { Save, FileText, Shield, Cookie, Scale, ChevronDown, ChevronUp } from 'lucide-react';

// Default legal page content
const defaultLegalPages: LegalPage[] = [
    {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: `<h2>1. Introduction</h2>
<p>This Privacy Policy describes how Trivoxa Technology collects, uses, and protects your personal information. We are committed to safeguarding your privacy and ensuring the security of your data.</p>

<h2>2. Information We Collect</h2>
<p>We may collect information you provide directly to us, such as your name, email address, and phone number when you contact us. We also automatically collect certain non-personal data, including your IP addresses, browser type, and usage data, to improve our services.</p>

<h2>3. How We Use Your Information</h2>
<p>The information we collect is used to:</p>
<ul>
<li>Provide and maintain our services.</li>
<li>Communicate with you regarding our services and your inquiries.</li>
<li>Improve our website's functionality and user experience.</li>
<li>Analyze and monitor usage to better understand our audience.</li>
<li>Comply with legal obligations.</li>
</ul>

<h2>4. Data Security</h2>
<p>We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

<h2>5. Your Rights</h2>
<p>You have the right to access, correct, or delete your personal data. If you wish to exercise these rights or have any questions about this policy, please contact us at trivoxatechnology@gmail.com.</p>`,
    },
    {
        slug: 'terms',
        title: 'Terms of Service',
        content: `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using our website and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.</p>

<h2>2. Services</h2>
<p>Trivoxa Technology provides professional software development services. The specifics of each project will be outlined in a separate agreement. We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>

<h2>3. User Responsibilities</h2>
<p>You are responsible for ensuring that any content you provide to us is accurate and does not violate any third-party rights. You agree not to use our services for any illegal or unauthorized purposes.</p>

<h2>4. Intellectual Property</h2>
<p>All intellectual property rights related to the services provided by Trivoxa Technology, including but not limited to software, designs, and content, remain the property of Trivoxa Technology unless otherwise specified in a separate agreement.</p>

<h2>5. Limitation of Liability</h2>
<p>Trivoxa Technology shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services. Our total liability for any claim arising from these terms will not exceed the amount you paid for the services.</p>`,
    },
    {
        slug: 'cookie',
        title: 'Cookie Policy',
        content: `<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site's owners.</p>

<h2>2. How We Use Cookies</h2>
<p>We use cookies to enhance your experience on our website. This includes:</p>
<ul>
<li><strong>Session Cookies:</strong> These are temporary and are erased when you close your browser.</li>
<li><strong>Analytics Cookies:</strong> We use these to understand how visitors interact with our website, helping us improve its functionality and content.</li>
<li><strong>Functionality Cookies:</strong> These remember your preferences to provide a more personalized experience.</li>
</ul>

<h2>3. Your Choices</h2>
<p>Most web browsers allow you to control cookies through their settings. However, disabling cookies may impact your ability to use certain features on our website. By continuing to use our site without changing your settings, you consent to our use of cookies.</p>`,
    },
    {
        slug: 'copyright',
        title: 'Copyright Notice',
        content: `<h2>1. Copyright Ownership</h2>
<p>The content, organization, graphics, design, and other matters related to this website and its services are protected under applicable copyrights and other proprietary laws. All content, including but not limited to text, images, and code, is the property of Trivoxa Technology.</p>

<h2>2. Unauthorized Use</h2>
<p>Any unauthorized use of the content or materials on this website, including but not limited to reproduction, distribution, public display, or modification, is strictly prohibited without the express written permission of Trivoxa Technology.</p>

<h2>3. Permission Requests</h2>
<p>If you wish to use any content from this website, please contact us at trivoxatechnology@gmail.com to request permission. Unauthorized use may result in legal action, including claims for monetary damages and injunctive relief.</p>`,
    },
];

const pageIcons: Record<string, React.ReactNode> = {
    privacy: <Shield className="w-5 h-5" />,
    terms: <FileText className="w-5 h-5" />,
    cookie: <Cookie className="w-5 h-5" />,
    copyright: <Scale className="w-5 h-5" />,
};

const pageColors: Record<string, string> = {
    privacy: 'from-green-500/20 to-green-500/5 border-green-500/30',
    terms: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    cookie: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    copyright: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
};

export default function LegalPagesEditor() {
    const { showToast } = useToast();
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expandedPage, setExpandedPage] = useState<string | null>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.LEGAL));
            if (querySnapshot.empty) {
                // Initialize with defaults
                setPages(defaultLegalPages);
                // Save defaults to Firestore
                for (const page of defaultLegalPages) {
                    await setDoc(doc(db, COLLECTIONS.LEGAL, page.slug), {
                        ...page,
                        updatedAt: serverTimestamp(),
                    });
                }
            } else {
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LegalPage));
                // Ensure all default pages exist
                const mergedPages = defaultLegalPages.map(defaultPage => {
                    const existingPage = items.find(p => p.slug === defaultPage.slug);
                    return existingPage || defaultPage;
                });
                setPages(mergedPages);
            }
        } catch (error) {
            console.error("Error fetching legal pages:", error);
            setPages(defaultLegalPages);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (page: LegalPage) => {
        setSaving(page.slug);
        try {
            await setDoc(doc(db, COLLECTIONS.LEGAL, page.slug), {
                ...page,
                updatedAt: serverTimestamp(),
            });
            showToast(`${page.title} saved`, 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(null);
        }
    };

    const updatePage = (slug: string, updates: Partial<LegalPage>) => {
        setPages(pages.map(p => p.slug === slug ? { ...p, ...updates } : p));
    };

    if (loading) return <AdminLoader text="Loading legal pages..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Legal Pages"
                subtitle="Edit Privacy Policy, Terms of Service, Cookie Policy content"
            />

            <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-4">
                {pages.map((page) => (
                    <div
                        key={page.slug}
                        className={`bg-gradient-to-br ${pageColors[page.slug] || pageColors.privacy} backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500`}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedPage(expandedPage === page.slug ? null : page.slug)}
                        >
                            <div className="w-12 h-12 flex items-center justify-center bg-black/30 border border-white/10 rounded-xl text-gray-300">
                                {pageIcons[page.slug]}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold">{page.title}</h3>
                                <p className="text-gray-500 text-sm font-mono">/{page.slug}</p>
                            </div>
                            <div className={`transition-transform duration-300`}>
                                {expandedPage === page.slug ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </div>

                        {/* Expanded Editor */}
                        <div className={`transition-all duration-500 ease-in-out ${expandedPage === page.slug ? 'max-h-[90vh] md:max-h-[2000px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                                <AdminInput
                                    label="Page Title"
                                    value={page.title}
                                    onChange={(v) => updatePage(page.slug, { title: v })}
                                />

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                                        Content (HTML supported)
                                    </label>
                                    <textarea
                                        value={page.content}
                                        onChange={(e) => updatePage(page.slug, { content: e.target.value })}
                                        rows={15}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all resize-y"
                                        placeholder="Enter HTML content..."
                                    />
                                </div>

                                {/* Preview */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                                        Preview
                                    </label>
                                    <div
                                        className="p-4 bg-black/40 border border-white/10 rounded-xl prose prose-sm prose-invert max-w-none overflow-auto max-h-64"
                                        dangerouslySetInnerHTML={{ __html: page.content }}
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <AdminButton
                                        onClick={() => handleSave(page)}
                                        disabled={saving === page.slug}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving === page.slug ? 'Saving...' : 'Save Changes'}
                                    </AdminButton>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
