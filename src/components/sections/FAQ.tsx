import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, setDoc, doc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, FAQItem } from '../../lib/firestore';
import { HelpCircle, Plus, Minus, X, Send, MessageCircle } from 'lucide-react';

// Default FAQs for a real-world business website
const defaultFAQs: Omit<FAQItem, 'id'>[] = [
    {
        question: 'What services does your company provide?',
        answer: 'We provide a comprehensive range of digital solutions including custom web development, mobile app development, e-commerce platforms, UI/UX design, software consulting, cloud infrastructure, and ongoing maintenance & support. Our team specializes in creating scalable, modern solutions tailored to your business needs.',
        category: 'Services',
        isPublished: true,
        order: 0,
    },
    {
        question: 'How much does a typical project cost?',
        answer: 'Project costs vary based on scope, complexity, and timeline. Simple websites start from $2,000, while custom web applications range from $5,000-$50,000+. We provide detailed, transparent quotes after understanding your requirements. No hidden fees - what we quote is what you pay.',
        category: 'Pricing',
        isPublished: true,
        order: 1,
    },
    {
        question: 'What is your development process?',
        answer: 'Our process includes: 1) Discovery & Planning - understanding your needs, 2) Design - creating wireframes and mockups, 3) Development - building with modern technologies, 4) Testing - rigorous QA across devices, 5) Launch - deploying to production, 6) Support - ongoing maintenance and updates.',
        category: 'Process',
        isPublished: true,
        order: 2,
    },
    {
        question: 'Do you offer post-launch support and maintenance?',
        answer: 'Absolutely! We offer flexible support packages including bug fixes, security updates, performance monitoring, content updates, and feature enhancements. Our support plans range from basic monthly maintenance to 24/7 priority support with guaranteed response times.',
        category: 'Support',
        isPublished: true,
        order: 3,
    },
];

export default function FAQ() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        category: 'General',
    });

    // Seed default FAQs to Firestore if none exist
    const seedDefaultFAQs = async () => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTIONS.FAQ));
            if (snapshot.empty) {
                console.log('Seeding default FAQs to Firestore...');
                for (const faq of defaultFAQs) {
                    await addDoc(collection(db, COLLECTIONS.FAQ), {
                        ...faq,
                        updatedAt: serverTimestamp(),
                    });
                }
                console.log('Default FAQs seeded successfully');
                return true; // FAQs were seeded
            }
            return false; // FAQs already exist
        } catch (error) {
            console.error('Error seeding FAQs:', error);
            return false;
        }
    };

    const fetchFAQs = async () => {
        try {
            // First, seed defaults if needed
            const seeded = await seedDefaultFAQs();

            const q = query(
                collection(db, COLLECTIONS.FAQ),
                where('isPublished', '==', true),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
            setFaqs(items);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            try {
                const snapshot = await getDocs(collection(db, COLLECTIONS.FAQ));
                const items = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as FAQItem))
                    .filter(faq => faq.isPublished)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                setFaqs(items.length > 0 ? items : defaultFAQs.map((f, i) => ({ ...f, id: `default-${i}` })));
            } catch (err) {
                console.error('Fallback fetch failed:', err);
                setFaqs(defaultFAQs.map((f, i) => ({ ...f, id: `default-${i}` })));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.FAQ), {
                question: formData.question,
                answer: '', // Admin will provide the answer
                category: formData.category,
                isPublished: false, // Requires admin approval
                order: faqs.length,
                updatedAt: serverTimestamp(),
            });
            setSubmitted(true);
            setTimeout(() => {
                setShowQuestionForm(false);
                setSubmitted(false);
                setFormData({ question: '', category: 'General' });
            }, 3000);
        } catch (error) {
            console.error('Error submitting question:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))];

    const filteredFaqs = activeCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    if (loading) {
        return (
            <section id="faq" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="faq" className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-mono mb-4">
                        FAQ
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Questions</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our services and processes.
                    </p>

                    {/* Ask a Question Button */}
                    <motion.button
                        onClick={() => setShowQuestionForm(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Ask a Question
                    </motion.button>
                </motion.div>

                {/* Category Filter */}
                {categories.length > 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-white'
                                    }`}
                            >
                                {category === 'all' ? 'All' : category}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <div
                                className={`relative bg-black/40 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index
                                    ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {/* Question */}
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeIndex === index
                                            ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                            : 'bg-white/5 border border-white/10'
                                            }`}>
                                            <HelpCircle className={`w-5 h-5 ${activeIndex === index ? 'text-white' : 'text-purple-400'}`} />
                                        </div>
                                        <h3 className={`font-semibold transition-colors ${activeIndex === index ? 'text-white' : 'text-gray-300'}`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${activeIndex === index
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'bg-white/5 text-gray-500'
                                        }`}>
                                        {activeIndex === index ? (
                                            <Minus className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                    </div>
                                </button>

                                {/* Answer */}
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0">
                                                <div className="pl-14 border-l-2 border-purple-500/30 ml-5">
                                                    <p className="text-gray-400 leading-relaxed pl-4">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Question Submission Modal */}
            <AnimatePresence>
                {showQuestionForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowQuestionForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="relative p-6 pb-0">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                                <button
                                    onClick={() => setShowQuestionForm(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                                        <HelpCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Ask a Question</h2>
                                    <p className="text-gray-500 text-sm mt-1">We'll answer your question and add it to our FAQ</p>
                                </div>
                            </div>

                            {submitted ? (
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                        <Send className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Question Submitted!</h3>
                                    <p className="text-gray-400">We'll review your question and add it to our FAQ after providing an answer.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitQuestion} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500/50 focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="General">General</option>
                                            <option value="Services">Services</option>
                                            <option value="Pricing">Pricing</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Support">Support</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Your Question</label>
                                        <textarea
                                            required
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            placeholder="What would you like to know?"
                                            rows={4}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Question'}
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
