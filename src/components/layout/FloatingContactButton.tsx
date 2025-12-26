import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, X, Send, Clock, User, Phone, Mail, FileText, HelpCircle } from 'lucide-react';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, SiteSettings } from '../../lib/firestore';

export default function FloatingContactButton() {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [showBooking, setShowBooking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        purpose: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
                if (docSnap.exists()) {
                    const data = docSnap.data() as SiteSettings;
                    console.log('Loaded settings:', data);
                    setSettings(data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleWhatsApp = () => {
        // Get WhatsApp number from settings, remove non-digits
        const rawNumber = settings.whatsappNumber || '';
        const phone = rawNumber.replace(/\D/g, '');

        console.log('Opening WhatsApp. Raw number:', rawNumber, 'Cleaned:', phone);

        if (phone) {
            // Open WhatsApp with pre-filled message
            const message = encodeURIComponent("Hi! I'm interested in your services.");
            const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
            console.log('WhatsApp URL:', whatsappUrl);
            window.open(whatsappUrl, '_blank');
        } else {
            // Fallback: scroll to contact section
            const contactSection = document.getElementById('Contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const scrollToFAQ = () => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.REQUESTS), {
                ...formData,
                projectType: 'Consultation Booking',
                budget: 'N/A',
                timeline: 'Scheduled',
                description: `Appointment Request: ${formData.purpose}\nDate: ${formData.date}\nTime: ${formData.time}`,
                status: 'scheduled',
                scheduledDate: `${formData.date} ${formData.time}`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setSubmitted(true);
            setTimeout(() => {
                setShowBooking(false);
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', date: '', time: '', purpose: '' });
            }, 3000);
        } catch (error) {
            console.error('Error submitting booking:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    if (loading) return null;

    const mode = settings.contactMode || 'free';
    const hasWhatsApp = !!settings.whatsappNumber;

    return (
        <>
            {/* Floating Buttons Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {/* FAQ Button */}
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                    onClick={scrollToFAQ}
                    className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:border-purple-500/50 hover:shadow-purple-500/20 group"
                    title="FAQ"
                >
                    <HelpCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                </motion.button>

                {/* WhatsApp / Booking Button */}
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                    onClick={mode === 'free' ? handleWhatsApp : () => setShowBooking(true)}
                    className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 overflow-hidden ${mode === 'free'
                        ? 'bg-black/80 backdrop-blur-md border-2 border-orange-500/50 shadow-orange-500/30 hover:shadow-orange-500/50'
                        : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30 hover:shadow-orange-500/50'
                        }`}
                    title={mode === 'free' ? 'Chat on WhatsApp' : 'Book Appointment'}
                >
                    {/* Animated glow ring */}
                    {mode === 'free' && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 animate-pulse" />
                    )}
                    {mode === 'free' ? (
                        <MessageCircle className="w-6 h-6 text-orange-400 relative z-10" />
                    ) : (
                        <Calendar className="w-6 h-6 text-white relative z-10" />
                    )}
                </motion.button>
            </div>

            {/* Pulse Animation */}
            <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full pointer-events-none ${mode === 'free' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
            />

            {/* Booking Modal */}
            <AnimatePresence>
                {showBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowBooking(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="relative p-6 pb-0">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                                <button
                                    onClick={() => setShowBooking(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Book Consultation</h2>
                                    <p className="text-gray-500 text-sm mt-1">Schedule a free consultation with our team</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                        <Send className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Booking Confirmed!</h3>
                                    <p className="text-gray-400">We'll contact you shortly to confirm your appointment.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Your name"
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="email@example.com"
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="date"
                                                    required
                                                    min={minDate}
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-orange-500/50 focus:outline-none [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    required
                                                    value={formData.time}
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-orange-500/50 focus:outline-none [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Purpose</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                                <textarea
                                                    required
                                                    value={formData.purpose}
                                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                                    placeholder="What would you like to discuss?"
                                                    rows={3}
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                                    >
                                        {submitting ? 'Booking...' : 'Book Appointment'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
