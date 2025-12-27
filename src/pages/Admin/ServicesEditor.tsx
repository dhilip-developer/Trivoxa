import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Service } from '../../lib/firestore';
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
import {
    Plus, Save, Trash2, X, Layers, Eye, EyeOff, ChevronDown, Check,
    Globe, Smartphone, Palette, Settings, Bot, Cloud, Shield,
    BarChart3, ShoppingCart, Code, Rocket, Lightbulb, Zap, Database,
    Search, CheckSquare, Square, GripVertical
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Tech-style icons using lucide-react (similar to Contact social icons)
const serviceIconOptions = [
    { key: 'globe', label: 'Web', Icon: Globe },
    { key: 'smartphone', label: 'Mobile', Icon: Smartphone },
    { key: 'code', label: 'Dev', Icon: Code },
    { key: 'palette', label: 'Design', Icon: Palette },
    { key: 'settings', label: 'Software', Icon: Settings },
    { key: 'bot', label: 'AI/ML', Icon: Bot },
    { key: 'cloud', label: 'Cloud', Icon: Cloud },
    { key: 'shield', label: 'Security', Icon: Shield },
    { key: 'barchart', label: 'Analytics', Icon: BarChart3 },
    { key: 'cart', label: 'E-commerce', Icon: ShoppingCart },
    { key: 'rocket', label: 'Launch', Icon: Rocket },
    { key: 'lightbulb', label: 'Ideas', Icon: Lightbulb },
    { key: 'zap', label: 'Fast', Icon: Zap },
    { key: 'database', label: 'Data', Icon: Database },
];

// Icon map for rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    globe: Globe,
    smartphone: Smartphone,
    code: Code,
    palette: Palette,
    settings: Settings,
    bot: Bot,
    cloud: Cloud,
    shield: Shield,
    barchart: BarChart3,
    cart: ShoppingCart,
    rocket: Rocket,
    lightbulb: Lightbulb,
    zap: Zap,
    database: Database,
};

// Accent color schemes matching frontend
const accentColorStyles: Record<string, { bg: string; border: string; text: string; shadow: string; gradient: string }> = {
    blue: { bg: 'from-blue-500/30 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10', gradient: 'from-blue-500/20 to-transparent' },
    purple: { bg: 'from-purple-500/30 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400', shadow: 'shadow-purple-500/10', gradient: 'from-purple-500/20 to-transparent' },
    cyan: { bg: 'from-cyan-500/30 to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', shadow: 'shadow-cyan-500/10', gradient: 'from-cyan-500/20 to-transparent' },
    pink: { bg: 'from-pink-500/30 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400', shadow: 'shadow-pink-500/10', gradient: 'from-pink-500/20 to-transparent' },
    orange: { bg: 'from-orange-500/30 to-orange-600/10', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10', gradient: 'from-orange-500/20 to-transparent' },
    green: { bg: 'from-green-500/30 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400', shadow: 'shadow-green-500/10', gradient: 'from-green-500/20 to-transparent' },
    amber: { bg: 'from-amber-500/30 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400', shadow: 'shadow-amber-500/10', gradient: 'from-amber-500/20 to-transparent' },
    indigo: { bg: 'from-indigo-500/30 to-indigo-600/10', border: 'border-indigo-500/30', text: 'text-indigo-400', shadow: 'shadow-indigo-500/10', gradient: 'from-indigo-500/20 to-transparent' },
    violet: { bg: 'from-violet-500/30 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400', shadow: 'shadow-violet-500/10', gradient: 'from-violet-500/20 to-transparent' },
    rose: { bg: 'from-rose-500/30 to-rose-600/10', border: 'border-rose-500/30', text: 'text-rose-400', shadow: 'shadow-rose-500/10', gradient: 'from-rose-500/20 to-transparent' },
    teal: { bg: 'from-teal-500/30 to-teal-600/10', border: 'border-teal-500/30', text: 'text-teal-400', shadow: 'shadow-teal-500/10', gradient: 'from-teal-500/20 to-transparent' },
    red: { bg: 'from-red-500/30 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400', shadow: 'shadow-red-500/10', gradient: 'from-red-500/20 to-transparent' },
};

function getAccentStyles(color?: string) {
    return accentColorStyles[color || 'orange'] || accentColorStyles.orange;
}


export default function ServicesEditor() {
    const { showToast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState(false);
    const [formData, setFormData] = useState<Partial<Service>>({
        title: '',
        description: '',
        icon: 'globe',
        features: [],
        order: 0,
        isPublished: true,
        accentColor: 'orange',
        featured: false,
    });
    const [featuresInput, setFeaturesInput] = useState('');

    const fetchServices = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
            const items = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Service))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            setServices(items);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSaveService = async (id: string, data: Partial<Service>) => {
        setSaving(true);
        try {
            await updateDoc(doc(db, COLLECTIONS.SERVICES, id), {
                ...data,
                features: data.features || [],
                updatedAt: serverTimestamp(),
            });
            showToast('Service updated', 'success');
            setEditingId(null);
            fetchServices();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddService = async () => {
        if (!formData.title) return;
        setSaving(true);
        try {
            await addDoc(collection(db, COLLECTIONS.SERVICES), {
                ...formData,
                features: featuresInput.split(',').map(f => f.trim()).filter(Boolean),
                order: services.length,
                updatedAt: serverTimestamp(),
            });
            showToast('Service added', 'success');
            setFormData({ title: '', description: '', icon: 'globe', features: [], order: 0, isPublished: true, accentColor: 'orange', featured: false });
            setFeaturesInput('');
            setShowAddForm(false);
            fetchServices();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
            showToast('Service deleted', 'success');
            setSelectedIds(prev => prev.filter(i => i !== id));
            fetchServices();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    // Bulk actions
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === filteredServices.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredServices.map(s => s.id!));
        }
    };

    const bulkPublish = async (publish: boolean) => {
        if (selectedIds.length === 0) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id =>
                updateDoc(doc(db, COLLECTIONS.SERVICES, id), { isPublished: publish, updatedAt: serverTimestamp() })
            ));
            showToast(`${selectedIds.length} services ${publish ? 'published' : 'unpublished'}`, 'success');
            setSelectedIds([]);
            fetchServices();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} selected services?`)) return;
        setBulkAction(true);
        try {
            await Promise.all(selectedIds.map(id => deleteDoc(doc(db, COLLECTIONS.SERVICES, id))));
            showToast(`${selectedIds.length} services deleted`, 'success');
            setSelectedIds([]);
            fetchServices();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkAction(false);
        }
    };

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle drag end - reorder services
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = services.findIndex((s) => s.id === active.id);
            const newIndex = services.findIndex((s) => s.id === over.id);

            const reorderedServices = arrayMove(services, oldIndex, newIndex);
            setServices(reorderedServices);

            // Save new order to Firestore
            try {
                const batch = writeBatch(db);
                reorderedServices.forEach((service, index) => {
                    const serviceRef = doc(db, COLLECTIONS.SERVICES, service.id!);
                    batch.update(serviceRef, { order: index, updatedAt: serverTimestamp() });
                });
                await batch.commit();
                showToast('Service order updated', 'success');
            } catch (error: any) {
                showToast(`Error updating order: ${error.message}`, 'error');
                fetchServices(); // Revert to original order
            }
        }
    };

    // Filter services by search
    const filteredServices = services.filter(s =>
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <AdminLoader text="Loading services..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Services"
                subtitle={`${services.length} service${services.length !== 1 ? 's' : ''} configured`}
                actions={
                    <div className="flex gap-2">
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
                            {showAddForm ? 'Cancel' : 'Add Service'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="max-w-6xl space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none"
                    />
                </div>

                {/* Bulk Selection Header */}
                {filteredServices.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/5">
                        <button onClick={selectAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            {selectedIds.length === filteredServices.length && filteredServices.length > 0 ? (
                                <CheckSquare className="w-5 h-5 text-orange-400" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
                        </button>
                        <span className="text-gray-600 text-sm">|</span>
                        <span className="text-gray-500 text-sm">{filteredServices.length} services</span>
                    </div>
                )}

                {/* Add New Service Form */}
                <div className={`transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-[85vh] lg:max-h-[75vh] opacity-100 overflow-y-auto custom-scrollbar' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <AdminCard title="New Service" accentColor="green" className="mb-4">
                        <div className="space-y-4">
                            <AdminInput
                                label="Title"
                                value={formData.title || ''}
                                onChange={(v) => setFormData({ ...formData, title: v })}
                                placeholder="e.g., Web Development"
                            />

                            {/* Tech Icon Picker */}
                            <IconPicker
                                selected={formData.icon || 'globe'}
                                onSelect={(key) => setFormData({ ...formData, icon: key })}
                            />

                            <AdminTextarea
                                label="Description"
                                value={formData.description || ''}
                                onChange={(v) => setFormData({ ...formData, description: v })}
                                placeholder="Describe this service..."
                                rows={2}
                            />
                            <AdminInput
                                label="Features (comma separated)"
                                value={featuresInput}
                                onChange={setFeaturesInput}
                                placeholder="React, Node.js, Firebase, etc."
                            />

                            {/* Design Customization */}
                            <div className="space-y-3 pt-2 border-t border-white/5">
                                <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                    Design Customization
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">Accent Color</label>
                                        <select
                                            value={formData.accentColor || 'orange'}
                                            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value as any })}
                                            className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-orange-500/50 focus:outline-none"
                                        >
                                            <option value="blue">🔵 Blue</option>
                                            <option value="purple">🟣 Purple</option>
                                            <option value="cyan">🔷 Cyan</option>
                                            <option value="pink">💗 Pink</option>
                                            <option value="orange">🟠 Orange</option>
                                            <option value="green">🟢 Green</option>
                                            <option value="amber">🟡 Amber</option>
                                            <option value="indigo">🔮 Indigo</option>
                                            <option value="violet">💜 Violet</option>
                                            <option value="rose">🌹 Rose</option>
                                            <option value="teal">🩵 Teal</option>
                                            <option value="red">🔴 Red</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">Featured</label>
                                        <label className="flex items-center gap-3 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-orange-500/30 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured || false}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-600 bg-black/40 text-orange-500"
                                            />
                                            <span className="text-sm text-gray-300">⭐ Featured Service</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <AdminButton onClick={handleAddService} disabled={saving || !formData.title}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Adding...' : 'Add Service'}
                            </AdminButton>
                        </div>
                    </AdminCard>
                </div>

                {/* Services List */}
                {filteredServices.length === 0 ? (
                    <AdminCard>
                        <AdminEmptyState
                            icon={<Layers className="w-12 h-12" />}
                            title={searchQuery ? "No matching services" : "No services yet"}
                            description={searchQuery ? `No results for "${searchQuery}"` : "Add your first service to display on your website"}
                            action={
                                !searchQuery && (
                                    <AdminButton onClick={() => setShowAddForm(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Service
                                    </AdminButton>
                                )
                            }
                        />
                    </AdminCard>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredServices.map(s => s.id!)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredServices.map((service, index) => (
                                    <SortableServiceCard
                                        key={service.id}
                                        service={service}
                                        index={index}
                                        isEditing={editingId === service.id}
                                        isSelected={selectedIds.includes(service.id!)}
                                        onToggleSelect={() => toggleSelect(service.id!)}
                                        onEdit={() => setEditingId(editingId === service.id ? null : service.id!)}
                                        onSave={(data) => handleSaveService(service.id!, data)}
                                        onDelete={() => handleDelete(service.id!)}
                                        saving={saving}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}

// Tech Icon Picker Component
function IconPicker({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
    return (
        <div className="space-y-3">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wide">Service Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {serviceIconOptions.map(({ key, label, Icon }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelect(key)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group ${selected === key
                            ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/20 border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                            : 'bg-black/30 border border-white/10 hover:border-orange-500/40 hover:bg-black/50'
                            }`}
                    >
                        <Icon className={`w-6 h-6 mb-1 ${selected === key ? 'text-orange-400' : 'text-gray-400 group-hover:text-orange-400'}`} />
                        <span className={`text-[10px] font-mono ${selected === key ? 'text-orange-400' : 'text-gray-500'}`}>
                            {label}
                        </span>
                        {selected === key && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Render icon from key
function ServiceIcon({ iconKey, className = "w-6 h-6" }: { iconKey: string; className?: string }) {
    const IconComponent = iconMap[iconKey] || Settings;
    return <IconComponent className={className} />;
}

// Sortable wrapper for ServiceCard
function SortableServiceCard({
    service,
    index,
    isEditing,
    isSelected,
    onToggleSelect,
    onEdit,
    onSave,
    onDelete,
    saving
}: {
    service: Service;
    index: number;
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onSave: (data: Partial<Service>) => void;
    onDelete: () => void;
    saving: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: service.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={isEditing ? 'lg:col-span-2' : ''}>
            <ServiceCard
                service={service}
                index={index}
                isEditing={isEditing}
                isSelected={isSelected}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onSave={onSave}
                onDelete={onDelete}
                saving={saving}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

// Individual Service Card with inline editing
function ServiceCard({
    service,
    index,
    isEditing,
    isSelected,
    onToggleSelect,
    onEdit,
    onSave,
    onDelete,
    saving,
    dragHandleProps
}: {
    service: Service;
    index?: number;
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onSave: (data: Partial<Service>) => void;
    onDelete: () => void;
    saving: boolean;
    dragHandleProps?: any;
}) {
    const [editData, setEditData] = useState(service);
    const [featuresInput, setFeaturesInput] = useState(service.features?.join(', ') || '');

    React.useEffect(() => {
        setEditData(service);
        setFeaturesInput(service.features?.join(', ') || '');
    }, [service, isEditing]);

    const handleSave = () => {
        onSave({
            ...editData,
            features: featuresInput.split(',').map(f => f.trim()).filter(Boolean),
        });
    };

    return (
        <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-orange-500/50' : isEditing ? 'ring-2 ring-orange-500/50' : 'hover:ring-1 hover:ring-white/20'}`}>
            {/* Gradient Background - Uses accent color */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className={`absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity duration-300 ${isSelected || isEditing ? `${getAccentStyles(editData.accentColor).bg} opacity-40` : `${getAccentStyles(editData.accentColor).gradient} group-hover:opacity-30`}`} />

            {/* Header - Always Visible */}
            <div className="relative flex items-center gap-3 p-5 min-h-[88px]">
                {/* Drag Handle */}
                {dragHandleProps && (
                    <button
                        {...dragHandleProps}
                        className="shrink-0 touch-none cursor-grab active:cursor-grabbing p-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                    </button>
                )}

                {/* Order Badge */}
                {typeof index === 'number' && (
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-400">
                        {index + 1}
                    </span>
                )}

                {/* Checkbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                    className="shrink-0"
                >
                    {isSelected ? (
                        <CheckSquare className={`w-5 h-5 ${getAccentStyles(editData.accentColor).text}`} />
                    ) : (
                        <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                    )}
                </button>

                {/* Icon - Uses accent color */}
                <div
                    className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${getAccentStyles(editData.accentColor).bg} border ${getAccentStyles(editData.accentColor).border} rounded-2xl shrink-0 shadow-lg ${getAccentStyles(editData.accentColor).shadow} cursor-pointer transition-all duration-300`}
                    onClick={onEdit}
                >
                    <ServiceIcon iconKey={editData.icon || 'settings'} className={`w-7 h-7 ${getAccentStyles(editData.accentColor).text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-lg truncate max-w-[120px] sm:max-w-none">{editData.title}</h3>
                        {service.isPublished ? (
                            <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-mono uppercase shrink-0">Live</span>
                        ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full font-mono uppercase shrink-0">Draft</span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">{editData.description}</p>
                </div>

                {/* Chevron */}
                <button onClick={onEdit} className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 transition-all duration-300 ${isEditing ? 'rotate-180 bg-orange-500/20' : 'group-hover:bg-white/10'}`}>
                    <ChevronDown className={`w-5 h-5 ${isEditing ? 'text-orange-400' : 'text-gray-500'}`} />
                </button>
            </div>

            {/* Expandable Edit Section */}
            <div className={`relative transition-all duration-500 ease-in-out ${isEditing ? 'max-h-[80vh] lg:max-h-[65vh] opacity-100 overflow-y-auto custom-scrollbar' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                    <AdminInput
                        label="Title"
                        value={editData.title}
                        onChange={(v) => setEditData({ ...editData, title: v })}
                    />

                    {/* Icon Picker */}
                    <IconPicker
                        selected={editData.icon || 'settings'}
                        onSelect={(key) => setEditData({ ...editData, icon: key })}
                    />

                    <AdminTextarea
                        label="Description"
                        value={editData.description}
                        onChange={(v) => setEditData({ ...editData, description: v })}
                        rows={2}
                    />
                    <AdminInput
                        label="Features (comma separated)"
                        value={featuresInput}
                        onChange={setFeaturesInput}
                    />
                    {/* Design Customization */}
                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <label className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                            Design Customization
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Accent Color */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Accent Color</label>
                                <select
                                    value={editData.accentColor || 'orange'}
                                    onChange={(e) => setEditData({ ...editData, accentColor: e.target.value as any })}
                                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-orange-500/50 focus:outline-none"
                                >
                                    <option value="blue">🔵 Blue</option>
                                    <option value="purple">🟣 Purple</option>
                                    <option value="cyan">🔷 Cyan</option>
                                    <option value="pink">💗 Pink</option>
                                    <option value="orange">🟠 Orange</option>
                                    <option value="green">🟢 Green</option>
                                    <option value="amber">🟡 Amber</option>
                                    <option value="indigo">🔮 Indigo</option>
                                    <option value="violet">💜 Violet</option>
                                    <option value="rose">🌹 Rose</option>
                                    <option value="teal">🩵 Teal</option>
                                    <option value="red">🔴 Red</option>
                                </select>
                            </div>

                            {/* Featured Toggle */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500">Featured</label>
                                <label className="flex items-center gap-3 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-orange-500/30 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={editData.featured || false}
                                        onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-black/40 text-orange-500 focus:ring-orange-500/50"
                                    />
                                    <span className="text-sm text-gray-300">⭐ Featured Service</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editData.isPublished}
                                onChange={(e) => setEditData({ ...editData, isPublished: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-600 bg-black/40 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-400">Published</span>
                        </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <AdminButton size="sm" onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-1" />
                            {saving ? 'Saving...' : 'Save'}
                        </AdminButton>
                        <AdminButton size="sm" variant="ghost" onClick={onEdit}>
                            Cancel
                        </AdminButton>
                        <AdminButton size="sm" variant="danger" onClick={onDelete} className="ml-auto">
                            <Trash2 className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export icon map for use in frontend
export { iconMap, ServiceIcon };
