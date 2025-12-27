import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Testimonial } from '../../lib/firestore';
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
import { Plus, Save, Trash2, X, Star, Quote, ChevronDown, Eye, EyeOff, Search, CheckSquare, Square } from 'lucide-react';

export default function TestimonialsEditor() {
    const { showToast } = useToast();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: '',
        company: '',
        role: '',
        content: '',
        rating: 5,
        avatarUrl: '',
        isPublished: true,
        order: 0,
    });

    const fetchTestimonials = async () => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTIONS.TESTIMONIALS));
            const items = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Testimonial))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            setTestimonials(items);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleAdd = async () => {
        if (!formData.name || !formData.content) return;
        setSaving(true);
        try {
            await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), {
                ...formData,
                order: testimonials.length,
                updatedAt: serverTimestamp(),
            });
            showToast('Testimonial added', 'success');
            setFormData({ name: '', company: '', role: '', content: '', rating: 5, avatarUrl: '', isPublished: true, order: 0 });
            setShowAddForm(false);
            fetchTestimonials();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (id: string, data: Partial<Testimonial>) => {
        setSaving(true);
        try {
            await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), { ...data, updatedAt: serverTimestamp() });
            showToast('Testimonial updated', 'success');
            setEditingId(null);
            fetchTestimonials();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
            showToast('Testimonial deleted', 'success');
            setSelectedIds(prev => prev.filter(i => i !== id));
            fetchTestimonials();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} testimonials?`)) return;
        try {
            await Promise.all(selectedIds.map(id => deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id))));
            showToast(`${selectedIds.length} testimonials deleted`, 'success');
            setSelectedIds([]);
            fetchTestimonials();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === filteredTestimonials.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredTestimonials.map(t => t.id!));
        }
    };

    const filteredTestimonials = testimonials.filter(t =>
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <AdminLoader text="Loading testimonials..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Testimonials"
                subtitle={`${testimonials.length} testimonial${testimonials.length !== 1 ? 's' : ''}`}
                actions={
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <AdminButton variant="danger" size="sm" onClick={bulkDelete}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedIds.length})
                            </AdminButton>
                        )}
                        <AdminButton onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {showAddForm ? 'Cancel' : 'Add Testimonial'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search testimonials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none"
                    />
                </div>

                {/* Bulk Selection */}
                {filteredTestimonials.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/5">
                        <button onClick={selectAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            {selectedIds.length === filteredTestimonials.length && filteredTestimonials.length > 0 ? (
                                <CheckSquare className="w-5 h-5 text-orange-400" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
                        </button>
                        <span className="text-gray-600 text-sm">|</span>
                        <span className="text-gray-500 text-sm">{filteredTestimonials.length} testimonials</span>
                    </div>
                )}

                {/* Add Form */}
                <div className={`transition-all duration-500 ${showAddForm ? 'max-h-[90vh] md:max-h-[600px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <AdminCard title="New Testimonial" accentColor="green" className="mb-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AdminInput label="Name" value={formData.name || ''} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="John Doe" />
                                <AdminInput label="Company" value={formData.company || ''} onChange={(v) => setFormData({ ...formData, company: v })} placeholder="Acme Inc" />
                                <AdminInput label="Role" value={formData.role || ''} onChange={(v) => setFormData({ ...formData, role: v })} placeholder="CEO" />
                            </div>
                            <AdminTextarea label="Testimonial Content" value={formData.content || ''} onChange={(v) => setFormData({ ...formData, content: v })} rows={3} placeholder="What the client said..." />
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="text-xs font-mono text-gray-500 uppercase mb-2 block">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className={`p-1 ${(formData.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                            >
                                                <Star className="w-5 h-5" fill={(formData.rating || 0) >= star ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <AdminInput label="Avatar URL" value={formData.avatarUrl || ''} onChange={(v) => setFormData({ ...formData, avatarUrl: v })} placeholder="https://..." />
                            </div>
                            <AdminButton onClick={handleAdd} disabled={saving || !formData.name || !formData.content}>
                                <Save className="w-4 h-4 mr-2" /> {saving ? 'Adding...' : 'Add Testimonial'}
                            </AdminButton>
                        </div>
                    </AdminCard>
                </div>

                {/* List */}
                {filteredTestimonials.length === 0 ? (
                    <AdminCard>
                        <AdminEmptyState
                            icon={<Quote className="w-12 h-12" />}
                            title={searchQuery ? "No matching testimonials" : "No testimonials yet"}
                            description="Add client testimonials to build trust"
                            action={!searchQuery && <AdminButton onClick={() => setShowAddForm(true)}><Plus className="w-4 h-4 mr-2" />Add Testimonial</AdminButton>}
                        />
                    </AdminCard>
                ) : (
                    filteredTestimonials.map(testimonial => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            isEditing={editingId === testimonial.id}
                            isSelected={selectedIds.includes(testimonial.id!)}
                            onToggleSelect={() => toggleSelect(testimonial.id!)}
                            onEdit={() => setEditingId(editingId === testimonial.id ? null : testimonial.id!)}
                            onSave={(data) => handleSave(testimonial.id!, data)}
                            onDelete={() => handleDelete(testimonial.id!)}
                            saving={saving}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function TestimonialCard({
    testimonial,
    isEditing,
    isSelected,
    onToggleSelect,
    onEdit,
    onSave,
    onDelete,
    saving
}: {
    testimonial: Testimonial;
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onSave: (data: Partial<Testimonial>) => void;
    onDelete: () => void;
    saving: boolean;
}) {
    const [editData, setEditData] = useState(testimonial);

    React.useEffect(() => {
        setEditData(testimonial);
    }, [testimonial, isEditing]);

    return (
        <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${isSelected || isEditing ? 'ring-2 ring-orange-500/50' : 'hover:ring-1 hover:ring-white/20'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity ${isSelected || isEditing ? 'from-orange-500/30 to-orange-600/10 opacity-40' : 'from-orange-500/10 to-transparent group-hover:opacity-30'}`} />

            <div className="relative flex items-center gap-4 p-5 min-h-[100px]">
                <button onClick={(e) => { e.stopPropagation(); onToggleSelect(); }} className="shrink-0">
                    {isSelected ? <CheckSquare className="w-5 h-5 text-orange-400" /> : <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />}
                </button>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-500/30 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-lg" onClick={onEdit}>
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

                <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold truncate max-w-[100px] sm:max-w-none">{testimonial.name}</h3>
                        <span className="text-gray-500 text-sm truncate max-w-[60px] sm:max-w-[120px] hidden sm:inline">{testimonial.role && testimonial.company ? `${testimonial.role} @ ${testimonial.company}` : testimonial.company}</span>
                        {testimonial.isPublished ? (
                            <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-mono uppercase shrink-0">Live</span>
                        ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full font-mono uppercase shrink-0">Draft</span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">{testimonial.content}</p>
                    <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${testimonial.rating >= s ? 'text-yellow-400' : 'text-gray-600'}`} fill={testimonial.rating >= s ? 'currentColor' : 'none'} />
                        ))}
                    </div>
                </div>

                <button onClick={onEdit} className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 transition-all ${isEditing ? 'rotate-180 bg-orange-500/20' : 'group-hover:bg-white/10'}`}>
                    <ChevronDown className={`w-5 h-5 ${isEditing ? 'text-orange-400' : 'text-gray-500'}`} />
                </button>
            </div>

            <div className={`relative transition-all duration-500 ${isEditing ? 'max-h-[90vh] md:max-h-[500px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <AdminInput label="Name" value={editData.name} onChange={(v) => setEditData({ ...editData, name: v })} />
                        <AdminInput label="Company" value={editData.company} onChange={(v) => setEditData({ ...editData, company: v })} />
                        <AdminInput label="Role" value={editData.role} onChange={(v) => setEditData({ ...editData, role: v })} />
                    </div>
                    <AdminTextarea label="Content" value={editData.content} onChange={(v) => setEditData({ ...editData, content: v })} rows={3} />
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="text-xs font-mono text-gray-500 uppercase mb-2 block">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => setEditData({ ...editData, rating: star })} className={`p-1 ${editData.rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}>
                                        <Star className="w-5 h-5" fill={editData.rating >= star ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer ml-auto">
                            <input type="checkbox" checked={editData.isPublished} onChange={(e) => setEditData({ ...editData, isPublished: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-black/40 text-orange-500" />
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
