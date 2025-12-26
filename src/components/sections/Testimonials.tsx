import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Testimonial } from '../../lib/firestore';
import { Star, Quote, Plus, X, Send, User, Building, Briefcase } from 'lucide-react';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        content: '',
        rating: 5,
    });

    const fetchTestimonials = async () => {
        try {
            const q = query(
                collection(db, COLLECTIONS.TESTIMONIALS),
                where('isPublished', '==', true),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
            setTestimonials(items);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            try {
                const snapshot = await getDocs(collection(db, COLLECTIONS.TESTIMONIALS));
                const items = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Testimonial))
                    .filter(t => t.isPublished)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                setTestimonials(items);
            } catch (err) {
                console.error('Fallback fetch failed:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), {
                ...formData,
                avatarUrl: '',
                isPublished: false, // Requires admin approval
                order: testimonials.length,
                updatedAt: serverTimestamp(),
            });
            setSubmitted(true);
            setTimeout(() => {
                setShowReviewForm(false);
                setSubmitted(false);
                setFormData({ name: '', company: '', role: '', content: '', rating: 5 });
            }, 3000);
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <section id="testimonials" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="testimonials" className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-mono mb-4">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Clients Say</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Don't just take our word for it. Here's what our clients have to say about working with us.
                    </p>

                    {/* Add Review Button */}
                    <motion.button
                        onClick={() => setShowReviewForm(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Share Your Experience
                    </motion.button>
                </motion.div>

                {/* Testimonials Grid */}
                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300">
                                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                        <Quote className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${testimonial.rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                                fill={testimonial.rating >= star ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
                                            {testimonial.avatarUrl ? (
                                                <img
                                                    src={testimonial.avatarUrl}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <span className={`text-lg font-bold text-white ${testimonial.avatarUrl ? 'hidden' : ''}`}>
                                                {testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                            <p className="text-gray-500 text-sm">
                                                {testimonial.role && `${testimonial.role}, `}{testimonial.company}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Review Submission Modal */}
            <AnimatePresence>
                {showReviewForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowReviewForm(false)}
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
                                    onClick={() => setShowReviewForm(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Share Your Review</h2>
                                    <p className="text-gray-500 text-sm mt-1">Your feedback helps us improve</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                        <Send className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                                    <p className="text-gray-400">Your review has been submitted and will be published after approval.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Company</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    placeholder="Acme Inc"
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Role</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    placeholder="CEO"
                                                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="p-1 transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                                        fill={formData.rating >= star ? 'currentColor' : 'none'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Your Experience</label>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Tell us about your experience..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
