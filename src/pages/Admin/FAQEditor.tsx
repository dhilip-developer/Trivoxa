import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, FAQItem } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader,
    AdminEmptyState
} from '../../components/Admin';
import { Plus, Save, Trash2, X, HelpCircle, ChevronDown, Search, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';

export default function FAQEditor() {
    const { showToast } = useToast();
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState(false);
    const [formData, setFormData] = useState<Partial<FAQItem>>({
        question: '',
        answer: '',
        category: 'General',
        isPublished: true,
        order: 0,
    });

    const categories = ['General', 'Services', 'Pricing', 'Technical', 'Support'];

    const fetchFAQs = async () => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTIONS.FAQ));
            const items = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as FAQItem))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            setFaqs(items);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleAdd = async () => {
        if (!formData.question || !formData.answer) return;
        setSaving(true);
        try {
            await addDoc(collection(db, COLLECTIONS.FAQ), {
                ...formData,
                order: faqs.length,
                updatedAt: serverTimestamp(),
            });
            showToast('FAQ added', 'success');
            setFormData({ question: '', answer: '', category: 'General', isPublished: true, order: 0 });
            setShowAddForm(false);
            fetchFAQs();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (id: string, data: Partial<FAQItem>) => {
        setSaving(true);
        try {
            await updateDoc(doc(db, COLLECTIONS.FAQ, id), { ...data, updatedAt: serverTimestamp() });
            showToast('FAQ updated', 'success');
            setEditingId(null);
            fetchFAQs();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.FAQ, id));
            showToast('FAQ deleted', 'success');
            setSelectedIds(prev => prev.filter(i => i !== id));
            fetchFAQs();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === filteredFAQs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredFAQs.map(f => f.id!));
        }
    };

    const bulkPublish = async (publish: boolean) => {
        if (selectedIds.length === 0) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id =>
                updateDoc(doc(db, COLLECTIONS.FAQ, id), { isPublished: publish, updatedAt: serverTimestamp() })
            ));
            showToast(`${selectedIds.length} FAQs ${publish ? 'published' : 'unpublished'}`, 'success');
            setSelectedIds([]);
            fetchFAQs();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} FAQs?`)) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id => deleteDoc(doc(db, COLLECTIONS.FAQ, id))));
            showToast(`${selectedIds.length} FAQs deleted`, 'success');
            setSelectedIds([]);
            fetchFAQs();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    const filteredFAQs = faqs.filter(f => {
        const matchesSearch = searchQuery === '' ||
            f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <AdminLoader text="Loading FAQs..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="FAQ"
                subtitle={`${faqs.length} question${faqs.length !== 1 ? 's' : ''}`}
                actions={
                    <div className="flex gap-2 flex-wrap">
                        {selectedIds.length > 0 && (
                            <>
                                <AdminButton variant="secondary" size="sm" onClick={() => bulkPublish(true)} disabled={bulkAction}>
                                    <Eye className="w-4 h-4 mr-1" /> Publish
                                </AdminButton>
                                <AdminButton variant="secondary" size="sm" onClick={() => bulkPublish(false)} disabled={bulkAction}>
                                    <EyeOff className="w-4 h-4 mr-1" /> Unpublish
                                </AdminButton>
                                <AdminButton variant="danger" size="sm" onClick={bulkDelete} disabled={bulkAction}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedIds.length})
                                </AdminButton>
                            </>
                        )}
                        <AdminButton onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {showAddForm ? 'Cancel' : 'Add FAQ'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="max-w-4xl space-y-4">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-2 rounded-xl font-mono text-xs border transition-all ${categoryFilter === cat
                                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {cat === 'all' ? 'ALL' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Selection */}
                {filteredFAQs.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/5">
                        <button onClick={selectAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            {selectedIds.length === filteredFAQs.length && filteredFAQs.length > 0 ? (
                                <CheckSquare className="w-5 h-5 text-cyan-400" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
                        </button>
                        <span className="text-gray-600 text-sm">|</span>
                        <span className="text-gray-500 text-sm">{filteredFAQs.length} FAQs</span>
                    </div>
                )}

                {/* Add Form */}
                <div className={`overflow-hidden transition-all duration-500 ${showAddForm ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <AdminCard title="New FAQ" accentColor="blue" className="mb-4">
                        <div className="space-y-4">
                            <AdminInput label="Question" value={formData.question || ''} onChange={(v) => setFormData({ ...formData, question: v })} placeholder="How do I...?" />
                            <AdminTextarea label="Answer" value={formData.answer || ''} onChange={(v) => setFormData({ ...formData, answer: v })} rows={3} placeholder="Detailed answer..." />
                            <div className="flex gap-4 items-end">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-cyan-500/50 focus:outline-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <AdminButton onClick={handleAdd} disabled={saving || !formData.question || !formData.answer}>
                                <Save className="w-4 h-4 mr-2" /> {saving ? 'Adding...' : 'Add FAQ'}
                            </AdminButton>
                        </div>
                    </AdminCard>
                </div>

                {/* List */}
                {filteredFAQs.length === 0 ? (
                    <AdminCard>
                        <AdminEmptyState
                            icon={<HelpCircle className="w-12 h-12" />}
                            title={searchQuery || categoryFilter !== 'all' ? "No matching FAQs" : "No FAQs yet"}
                            description="Add frequently asked questions"
                            action={!searchQuery && categoryFilter === 'all' && <AdminButton onClick={() => setShowAddForm(true)}><Plus className="w-4 h-4 mr-2" />Add FAQ</AdminButton>}
                        />
                    </AdminCard>
                ) : (
                    filteredFAQs.map(faq => (
                        <FAQCard
                            key={faq.id}
                            faq={faq}
                            categories={categories}
                            isEditing={editingId === faq.id}
                            isSelected={selectedIds.includes(faq.id!)}
                            onToggleSelect={() => toggleSelect(faq.id!)}
                            onEdit={() => setEditingId(editingId === faq.id ? null : faq.id!)}
                            onSave={(data) => handleSave(faq.id!, data)}
                            onDelete={() => handleDelete(faq.id!)}
                            saving={saving}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function FAQCard({
    faq,
    categories,
    isEditing,
    isSelected,
    onToggleSelect,
    onEdit,
    onSave,
    onDelete,
    saving
}: {
    faq: FAQItem;
    categories: string[];
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onSave: (data: Partial<FAQItem>) => void;
    onDelete: () => void;
    saving: boolean;
}) {
    const [editData, setEditData] = useState(faq);

    React.useEffect(() => {
        setEditData(faq);
    }, [faq, isEditing]);

    return (
        <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${isSelected || isEditing ? 'ring-2 ring-cyan-500/50' : 'hover:ring-1 hover:ring-white/20'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity ${isSelected || isEditing ? 'from-cyan-500/30 to-cyan-600/10 opacity-40' : 'from-cyan-500/10 to-transparent group-hover:opacity-30'}`} />

            <div className="relative flex items-center gap-4 p-5">
                <button onClick={(e) => { e.stopPropagation(); onToggleSelect(); }} className="shrink-0">
                    {isSelected ? <CheckSquare className="w-5 h-5 text-cyan-400" /> : <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />}
                </button>

                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/10 border border-cyan-500/30 flex items-center justify-center shrink-0 cursor-pointer" onClick={onEdit}>
                    <HelpCircle className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-semibold">{faq.question}</h3>
                        <span className="px-2 py-0.5 text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full font-mono">{faq.category}</span>
                        {faq.isPublished ? (
                            <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-mono uppercase">Live</span>
                        ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full font-mono uppercase">Draft</span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">{faq.answer}</p>
                </div>

                <button onClick={onEdit} className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 transition-all ${isEditing ? 'rotate-180 bg-cyan-500/20' : 'group-hover:bg-white/10'}`}>
                    <ChevronDown className={`w-5 h-5 ${isEditing ? 'text-cyan-400' : 'text-gray-500'}`} />
                </button>
            </div>

            <div className={`relative transition-all duration-500 ${isEditing ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                    <AdminInput label="Question" value={editData.question} onChange={(v) => setEditData({ ...editData, question: v })} />
                    <AdminTextarea label="Answer" value={editData.answer} onChange={(v) => setEditData({ ...editData, answer: v })} rows={3} />
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                            <select
                                value={editData.category}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-cyan-500/50 focus:outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer ml-auto">
                            <input type="checkbox" checked={editData.isPublished} onChange={(e) => setEditData({ ...editData, isPublished: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-black/40 text-cyan-500" />
                            <span className="text-sm text-gray-400">Published</span>
                        </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <AdminButton size="sm" onClick={() => onSave(editData)} disabled={saving}><Save className="w-4 h-4 mr-1" />{saving ? 'Saving...' : 'Save'}</AdminButton>
                        <AdminButton size="sm" variant="ghost" onClick={onEdit}>Cancel</AdminButton>
                        <AdminButton size="sm" variant="danger" onClick={onDelete} className="ml-auto"><Trash2 className="w-4 h-4" /></AdminButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
