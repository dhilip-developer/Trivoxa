import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Project } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader,
    AdminEmptyState,
    AdminBadge
} from '../../components/Admin';
import { Plus, Save, Trash2, X, FolderOpen, Eye, EyeOff, Image, Link2, Download, ChevronDown, Globe, Search, CheckSquare, Square } from 'lucide-react';

export default function ProjectsEditor() {
    const { showToast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fetchingThumb, setFetchingThumb] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState(false);
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        description: '',
        imageUrl: '',
        category: 'Web App',
        tags: [],
        link: '',
        order: 0,
        isPublished: true,
    });
    const [tagsInput, setTagsInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const categories = ['Web App', 'E-commerce', 'AI Tool', 'Custom Software', 'Mobile App'];

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROJECTS));
            const items = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Project))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            setProjects(items);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image must be less than 2MB', 'error');
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            callback(base64);
            showToast('Image ready', 'success');
            setUploading(false);
        };
        reader.onerror = () => {
            showToast('Failed to read image', 'error');
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    // Fetch thumbnail from project URL
    const fetchThumbnailFromUrl = (url: string, callback: (thumbUrl: string) => void) => {
        if (!url || url === '#') {
            showToast('Enter a valid project URL first', 'error');
            return;
        }
        setFetchingThumb(true);
        try {
            const thumbUrl = `https://image.thum.io/get/width/800/${url}`;
            callback(thumbUrl);
            showToast('Thumbnail fetched from URL', 'success');
        } catch (error) {
            showToast('Failed to fetch thumbnail', 'error');
        } finally {
            setFetchingThumb(false);
        }
    };

    const handleAddProject = async () => {
        if (!formData.title) return;
        setSaving(true);
        try {
            await addDoc(collection(db, COLLECTIONS.PROJECTS), {
                ...formData,
                tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
                order: projects.length,
                updatedAt: serverTimestamp(),
            });
            showToast('Project added', 'success');
            setFormData({ title: '', description: '', imageUrl: '', category: 'Web App', tags: [], link: '', order: 0, isPublished: true });
            setTagsInput('');
            setShowAddForm(false);
            fetchProjects();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProject = async (id: string, data: Partial<Project>) => {
        setSaving(true);
        try {
            await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            showToast('Project updated', 'success');
            setEditingId(null);
            fetchProjects();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
            showToast('Project deleted', 'success');
            setSelectedIds(prev => prev.filter(i => i !== id));
            fetchProjects();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    // Bulk actions
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === filteredProjects.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProjects.map(p => p.id!));
        }
    };

    const bulkPublish = async (publish: boolean) => {
        if (selectedIds.length === 0) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id =>
                updateDoc(doc(db, COLLECTIONS.PROJECTS, id), { isPublished: publish, updatedAt: serverTimestamp() })
            ));
            showToast(`${selectedIds.length} projects ${publish ? 'published' : 'unpublished'}`, 'success');
            setSelectedIds([]);
            fetchProjects();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} selected projects?`)) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id => deleteDoc(doc(db, COLLECTIONS.PROJECTS, id))));
            showToast(`${selectedIds.length} projects deleted`, 'success');
            setSelectedIds([]);
            fetchProjects();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    // Filter projects by search and category
    const filteredProjects = projects.filter(p => {
        const matchesSearch = searchQuery === '' ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <AdminLoader text="Loading projects..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Projects"
                subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} in portfolio`}
                actions={
                    <div className="flex gap-2 flex-wrap">
                        {selectedIds.length > 0 && (
                            <>
                                <AdminButton variant="secondary" onClick={() => bulkPublish(true)} disabled={bulkAction} size="sm">
                                    <Eye className="w-4 h-4 mr-1" /> Publish
                                </AdminButton>
                                <AdminButton variant="secondary" onClick={() => bulkPublish(false)} disabled={bulkAction} size="sm">
                                    <EyeOff className="w-4 h-4 mr-1" /> Unpublish
                                </AdminButton>
                                <AdminButton variant="danger" onClick={bulkDelete} disabled={bulkAction} size="sm">
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedIds.length})
                                </AdminButton>
                            </>
                        )}
                        <AdminButton onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {showAddForm ? 'Cancel' : 'Add Project'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="max-w-6xl space-y-4">
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-2 rounded-xl font-mono text-xs border transition-all ${categoryFilter === cat
                                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {cat === 'all' ? 'ALL' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Selection Header */}
                {filteredProjects.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/5">
                        <button onClick={selectAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            {selectedIds.length === filteredProjects.length && filteredProjects.length > 0 ? (
                                <CheckSquare className="w-5 h-5 text-purple-400" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
                        </button>
                        <span className="text-gray-600 text-sm">|</span>
                        <span className="text-gray-500 text-sm">{filteredProjects.length} projects</span>
                    </div>
                )}

                {/* Add New Project Form */}
                <div className={`transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-[90vh] md:max-h-[900px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <AdminCard title="New Project" accentColor="purple" className="mb-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AdminInput
                                    label="Title"
                                    value={formData.title || ''}
                                    onChange={(v) => setFormData({ ...formData, title: v })}
                                    placeholder="Project name"
                                />
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <AdminTextarea
                                label="Description"
                                value={formData.description || ''}
                                onChange={(v) => setFormData({ ...formData, description: v })}
                                rows={2}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AdminInput
                                    label="Project URL"
                                    value={formData.link || ''}
                                    onChange={(v) => setFormData({ ...formData, link: v })}
                                    placeholder="https://..."
                                    icon={<Link2 className="w-4 h-4" />}
                                />
                                <AdminInput
                                    label="Tags"
                                    value={tagsInput}
                                    onChange={setTagsInput}
                                    placeholder="React, Firebase, etc."
                                />
                            </div>

                            {/* Image Options */}
                            <div className="space-y-3">
                                <label className="text-xs font-mono text-gray-500 uppercase">Project Image</label>
                                <div className="flex flex-wrap gap-3">
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, (url) => setFormData({ ...formData, imageUrl: url }))} accept="image/*" className="hidden" />
                                    <AdminButton type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                        <Image className="w-4 h-4 mr-2" />
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </AdminButton>
                                    <AdminButton
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fetchThumbnailFromUrl(formData.link || '', (url) => setFormData({ ...formData, imageUrl: url }))}
                                        disabled={fetchingThumb || !formData.link}
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        {fetchingThumb ? 'Fetching...' : 'Auto from URL'}
                                    </AdminButton>
                                </div>
                                {formData.imageUrl && (
                                    <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AdminButton onClick={handleAddProject} disabled={saving || !formData.title}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Adding...' : 'Add Project'}
                            </AdminButton>
                        </div>
                    </AdminCard>
                </div>

                {/* Projects List */}
                {filteredProjects.length === 0 ? (
                    <AdminCard>
                        <AdminEmptyState
                            icon={<FolderOpen className="w-12 h-12" />}
                            title={searchQuery || categoryFilter !== 'all' ? "No matching projects" : "No projects yet"}
                            description={searchQuery ? `No results for "${searchQuery}"` : "Add your first project"}
                            action={
                                !searchQuery && categoryFilter === 'all' && (
                                    <AdminButton onClick={() => setShowAddForm(true)}><Plus className="w-4 h-4 mr-2" />Add Project</AdminButton>
                                )
                            }
                        />
                    </AdminCard>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                categories={categories}
                                isEditing={editingId === project.id}
                                isSelected={selectedIds.includes(project.id!)}
                                onToggleSelect={() => toggleSelect(project.id!)}
                                onEdit={() => setEditingId(editingId === project.id ? null : project.id!)}
                                onSave={(data) => handleSaveProject(project.id!, data)}
                                onDelete={() => handleDelete(project.id!)}
                                saving={saving}
                                showToast={showToast}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Individual Project Card with inline editing
function ProjectCard({
    project,
    categories,
    isEditing,
    isSelected,
    onToggleSelect,
    onEdit,
    onSave,
    onDelete,
    saving,
    showToast
}: {
    project: Project;
    categories: string[];
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onSave: (data: Partial<Project>) => void;
    onDelete: () => void;
    saving: boolean;
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}) {
    const [editData, setEditData] = useState(project);
    const [tagsInput, setTagsInput] = useState(project.tags?.join(', ') || '');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [fetchingThumb, setFetchingThumb] = useState(false);

    React.useEffect(() => {
        setEditData(project);
        setTagsInput(project.tags?.join(', ') || '');
    }, [project, isEditing]);

    const handleSave = () => {
        onSave({
            ...editData,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            showToast('No file selected', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image must be less than 2MB', 'error');
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setEditData({ ...editData, imageUrl: result });
            showToast('Image uploaded', 'success');
            setUploading(false);
        };
        reader.onerror = () => {
            showToast('Failed to read image', 'error');
            setUploading(false);
        };
        reader.readAsDataURL(file);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const fetchThumbnail = () => {
        if (!editData.link || editData.link === '#') {
            showToast('Enter a valid URL first', 'error');
            return;
        }
        setFetchingThumb(true);
        const thumbUrl = `https://image.thum.io/get/width/800/${editData.link}`;
        setEditData({ ...editData, imageUrl: thumbUrl });
        showToast('Thumbnail fetched', 'success');
        setFetchingThumb(false);
    };

    return (
        <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${isEditing ? 'lg:col-span-2' : ''} ${isSelected || isEditing ? 'ring-2 ring-purple-500/50' : 'hover:ring-1 hover:ring-white/20'}`}>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity duration-300 ${isSelected || isEditing ? 'from-purple-500/30 to-purple-600/10 opacity-40' : 'from-purple-500/10 to-transparent group-hover:opacity-30'}`} />

            {/* Header */}
            <div className="relative flex items-center gap-4 p-5 cursor-pointer" onClick={onEdit}>
                {/* Checkbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                    className="shrink-0"
                >
                    {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-purple-400" />
                    ) : (
                        <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                    )}
                </button>

                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                    {editData.imageUrl ? (
                        <img src={editData.imageUrl} alt={editData.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600"><FolderOpen className="w-6 h-6" /></div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-semibold text-lg">{editData.title}</h3>
                        <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full font-mono">{editData.category}</span>
                        {project.isPublished ? (
                            <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-mono uppercase">Live</span>
                        ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full font-mono uppercase">Draft</span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">{editData.description}</p>
                </div>

                {/* Chevron */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 transition-all duration-300 ${isEditing ? 'rotate-180 bg-purple-500/20' : 'group-hover:bg-white/10'}`}>
                    <ChevronDown className={`w-5 h-5 ${isEditing ? 'text-purple-400' : 'text-gray-500'}`} />
                </div>
            </div>

            {/* Expandable Edit Section */}
            <div className={`relative transition-all duration-500 ease-in-out ${isEditing ? 'max-h-[90vh] md:max-h-[700px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <AdminInput label="Title" value={editData.title} onChange={(v) => setEditData({ ...editData, title: v })} />
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 uppercase">Category</label>
                            <select
                                value={editData.category}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <AdminTextarea label="Description" value={editData.description} onChange={(v) => setEditData({ ...editData, description: v })} rows={2} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminInput label="Project URL" value={editData.link || ''} onChange={(v) => setEditData({ ...editData, link: v })} icon={<Link2 className="w-4 h-4" />} />
                        <AdminInput label="Tags" value={tagsInput} onChange={setTagsInput} />
                    </div>

                    {/* Image Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono text-gray-500 uppercase">Project Image</label>
                        <div className="flex flex-wrap gap-3 items-center">
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                            <AdminButton type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                <Image className="w-4 h-4 mr-2" />{uploading ? 'Uploading...' : 'Upload'}
                            </AdminButton>
                            <AdminButton type="button" variant="secondary" size="sm" onClick={fetchThumbnail} disabled={fetchingThumb || !editData.link}>
                                <Globe className="w-4 h-4 mr-2" />{fetchingThumb ? 'Fetching...' : 'Auto from URL'}
                            </AdminButton>
                            <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                <input type="checkbox" checked={editData.isPublished} onChange={(e) => setEditData({ ...editData, isPublished: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-black/40 text-orange-500" />
                                <span className="text-sm text-gray-400">Published</span>
                            </label>
                        </div>
                        {editData.imageUrl && (
                            <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-white/10 group">
                                <img src={editData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setEditData({ ...editData, imageUrl: '' })}
                                    className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <AdminButton size="sm" onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-1" />{saving ? 'Saving...' : 'Save'}</AdminButton>
                        <AdminButton size="sm" variant="ghost" onClick={onEdit}>Cancel</AdminButton>
                        <AdminButton size="sm" variant="danger" onClick={onDelete} className="ml-auto"><Trash2 className="w-4 h-4" /></AdminButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
