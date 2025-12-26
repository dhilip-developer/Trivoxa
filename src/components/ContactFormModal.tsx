import React, { useState } from 'react';

interface ContactFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    title?: string;
    subtitle?: string;
}

export default function ContactFormModal({
    isOpen,
    closeModal,
    title = "Start Your Project",
    subtitle = "Tell us about your vision and we'll bring it to life"
}: ContactFormModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: 'web-app',
        budget: '',
        timeline: '',
        description: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            closeModal();
            setFormData({ name: '', email: '', phone: '', company: '', projectType: 'web-app', budget: '', timeline: '', description: '' });
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

            {/* Modal - Fixed height, no scroll */}
            <div className="relative w-full max-w-2xl rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-orange-500/10 overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

                {/* Close button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative p-6 md:p-8">
                    {submitted ? (
                        /* Success Message - Small & Fixed */
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Thank You!</h3>
                            <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium mb-3">
                                    Let's Build Something Amazing
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                                <p className="text-gray-400 text-sm">{subtitle}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Full Name *"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all"
                                    />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="Email *"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Company Name"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <select
                                        value={formData.projectType}
                                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500/50 focus:outline-none transition-all"
                                    >
                                        <option value="web-app" className="bg-gray-900">Web Application</option>
                                        <option value="mobile-app" className="bg-gray-900">Mobile App</option>
                                        <option value="e-commerce" className="bg-gray-900">E-commerce</option>
                                        <option value="ai-automation" className="bg-gray-900">AI & Automation</option>
                                        <option value="ui-ux" className="bg-gray-900">UI/UX Design</option>
                                        <option value="custom" className="bg-gray-900">Custom Software</option>
                                    </select>
                                    <select
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500/50 focus:outline-none transition-all"
                                    >
                                        <option value="" className="bg-gray-900">Budget</option>
                                        <option value="10k-25k" className="bg-gray-900">₹10K - ₹25K</option>
                                        <option value="25k-50k" className="bg-gray-900">₹25K - ₹50K</option>
                                        <option value="50k-1L" className="bg-gray-900">₹50K - ₹1L</option>
                                        <option value="1L+" className="bg-gray-900">₹1L+</option>
                                    </select>
                                    <select
                                        value={formData.timeline}
                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500/50 focus:outline-none transition-all"
                                    >
                                        <option value="" className="bg-gray-900">Timeline</option>
                                        <option value="asap" className="bg-gray-900">ASAP</option>
                                        <option value="1-2weeks" className="bg-gray-900">1-2 Weeks</option>
                                        <option value="1month" className="bg-gray-900">1 Month</option>
                                        <option value="flexible" className="bg-gray-900">Flexible</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                    placeholder="Tell us about your project *"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all resize-none"
                                />

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-[0.98]"
                                >
                                    Submit Request
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
