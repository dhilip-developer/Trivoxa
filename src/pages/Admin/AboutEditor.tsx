import React, { useEffect, useState, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import { useAutoSave, useKeyboardShortcuts } from '../../hooks/useAdminUtils';
import {
    AdminPageHeader,
    AdminCard,
    AdminInput,
    AdminTextarea,
    AdminButton,
    AdminLoader,
    AdminEmptyState,
    AutoSaveIndicator
} from '../../components/Admin';
import { Save, Plus, Trash2, Edit3, Users, Globe, Github, Linkedin, X, User, Upload, Link, ZoomIn, ZoomOut, Move, Check, RotateCcw } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
}

interface AboutContent {
    title: string;
    subtitle: string;
    description: string;
    team: TeamMember[];
    isPublished: boolean;
}

const defaultAbout: AboutContent = {
    title: "We Create Digital Excellence",
    subtitle: "About Us",
    description: "We're a passionate team of developers and designers dedicated to crafting exceptional digital experiences.",
    team: [],
    isPublished: true,
};

const emptyMember: TeamMember = {
    name: '',
    role: '',
    image: '',
    bio: '',
    portfolio: '',
    github: '',
    linkedin: '',
};

// Image Cropper Modal Component
interface ImageCropperProps {
    imageSrc: string;
    onCrop: (croppedImage: string) => void;
    onCancel: () => void;
}

function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    // Load image
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setImage(img);
            // Center the image initially
            setPosition({ x: 0, y: 0 });
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Draw image on canvas
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 280; // Canvas size
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Calculate dimensions
        const scale = Math.min(size / image.width, size / image.height) * zoom;
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (size - scaledWidth) / 2 + position.x;
        const y = (size - scaledHeight) / 2 + position.y;

        // Draw image
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

        // Draw circular mask overlay
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
        ctx.fill();

    }, [image, zoom, position]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
        });
    };

    const handleCrop = () => {
        if (!canvasRef.current) return;
        const croppedDataUrl = canvasRef.current.toDataURL('image/png');
        onCrop(croppedDataUrl);
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Crop Image</h3>
                    <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <Move className="w-4 h-4" /> Drag to reposition • Use slider to zoom
                </p>

                {/* Canvas Container */}
                <div
                    ref={containerRef}
                    className="relative mx-auto w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-orange-500/50 cursor-move bg-black/40"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                >
                    <canvas ref={canvasRef} className="w-full h-full" />

                    {/* Circular overlay guide */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded-full" />
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <ZoomOut className="w-4 h-4 text-gray-500" />
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <ZoomIn className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400 text-sm font-mono w-12">{Math.round(zoom * 100)}%</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        onClick={handleCrop}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
                    >
                        <Check className="w-4 h-4" />
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
}

// Image Upload Component with Cropping
interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
    const [mode, setMode] = useState<'url' | 'file'>(value && !value.startsWith('data:') ? 'url' : 'file');
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleCrop = (croppedImage: string) => {
        onChange(croppedImage);
        setShowCropper(false);
        setTempImage(null);
    };

    const handleCancelCrop = () => {
        setShowCropper(false);
        setTempImage(null);
    };

    const handleEditExisting = () => {
        if (value) {
            setTempImage(value);
            setShowCropper(true);
        }
    };

    return (
        <>
            <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-500 uppercase">{label}</label>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => setMode('file')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'file'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-white/5 text-gray-500 border border-white/10 hover:border-white/20'
                            }`}
                    >
                        <Upload className="w-3 h-3" />
                        Upload File
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'url'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-gray-500 border border-white/10 hover:border-white/20'
                            }`}
                    >
                        <Link className="w-3 h-3" />
                        URL Link
                    </button>
                </div>

                {mode === 'file' ? (
                    <div className="space-y-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`w-full px-4 py-6 border-2 border-dashed rounded-xl text-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${isDragging
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                    : 'bg-black/40 border-white/20 text-gray-400 hover:border-orange-500/50 hover:text-white'
                                }`}
                        >
                            <Upload className={`w-6 h-6 ${isDragging ? 'animate-bounce' : ''}`} />
                            <span>{isDragging ? 'Drop image here' : value ? 'Change Image' : 'Drop image or click to upload'}</span>
                            <span className="text-xs text-gray-600">Max 5MB</span>
                        </div>
                    </div>
                ) : (
                    <input
                        type="url"
                        value={value && !value.startsWith('data:') ? value : ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-orange-500/50 focus:outline-none font-mono"
                    />
                )}

                {/* Preview with Edit/Delete */}
                {value && (
                    <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/30 group">
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-1">
                            {value.startsWith('data:') && (
                                <button
                                    type="button"
                                    onClick={handleEditExisting}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    Edit Crop
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-all"
                            >
                                <Trash2 className="w-3 h-3" />
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cropper Modal */}
            {showCropper && tempImage && (
                <ImageCropper
                    imageSrc={tempImage}
                    onCrop={handleCrop}
                    onCancel={handleCancelCrop}
                />
            )}
        </>
    );
}

export default function AboutEditor() {
    const { showToast } = useToast();
    const [content, setContent] = useState<AboutContent>(defaultAbout);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingMember, setEditingMember] = useState<number | null>(null);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [newMember, setNewMember] = useState<TeamMember>(emptyMember);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [cropperTarget, setCropperTarget] = useState<'edit' | 'new' | null>(null);

    // Auto-save with debounce (1.5 seconds)
    const { status: autoSaveStatus, lastSaved } = useAutoSave(
        COLLECTIONS.PAGES,
        'about',
        content,
        {
            debounceMs: 1500,
            enabled: !loading,
            onError: (error) => showToast(`Auto-save failed: ${error.message}`, 'error'),
        }
    );

    // Keyboard shortcuts
    useKeyboardShortcuts([
        { key: 's', ctrl: true, handler: () => handleSave() },
        {
            key: 'Escape', handler: () => {
                setEditingMember(null);
                setShowMemberForm(false);
                setCropperImage(null);
            }
        },
    ]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const docSnap = await getDoc(doc(db, COLLECTIONS.PAGES, 'about'));
                if (docSnap.exists()) {
                    setContent(docSnap.data() as AboutContent);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, COLLECTIONS.PAGES, 'about'), {
                ...content,
                updatedAt: serverTimestamp(),
            });
            showToast('About content saved', 'success');
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        const newTeam = [...content.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setContent({ ...content, team: newTeam });
    };

    const addMember = async () => {
        if (newMember.name && newMember.role) {
            const updatedContent = { ...content, team: [...content.team, newMember] };
            setContent(updatedContent);
            setNewMember(emptyMember);
            setShowMemberForm(false);

            // Auto-save to Firestore
            try {
                await setDoc(doc(db, COLLECTIONS.PAGES, 'about'), {
                    ...updatedContent,
                    updatedAt: serverTimestamp(),
                });
                showToast('Team member added and saved', 'success');
            } catch (error: any) {
                showToast(`Added locally. Error saving: ${error.message}`, 'error');
            }
        }
    };

    const removeMember = (index: number) => {
        if (!confirm('Remove this team member?')) return;
        setContent({ ...content, team: content.team.filter((_, i) => i !== index) });
        showToast('Member removed', 'info');
    };

    if (loading) return <AdminLoader text="Loading about content..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="About Section"
                subtitle="Edit company info and team members"
                actions={
                    <div className="flex items-center gap-4">
                        <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
                        <span className="text-xs text-gray-600 hidden md:block">Ctrl+S to save</span>
                        <AdminButton onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </AdminButton>
                    </div>
                }
            />

            <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Main Content */}
                <AdminCard title="Section Content" accentColor="orange">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdminInput
                                label="Section Subtitle"
                                value={content.subtitle}
                                onChange={(v) => setContent({ ...content, subtitle: v })}
                                placeholder="e.g., About Us"
                            />
                            <AdminInput
                                label="Main Title"
                                value={content.title}
                                onChange={(v) => setContent({ ...content, title: v })}
                                placeholder="e.g., We Create Digital Excellence"
                            />
                        </div>
                        <AdminTextarea
                            label="Description"
                            value={content.description}
                            onChange={(v) => setContent({ ...content, description: v })}
                            placeholder="Company description..."
                            rows={4}
                        />
                    </div>
                </AdminCard>

                {/* Team Members - Individual Cards */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Team Members</h2>
                            <p className="text-gray-500 text-sm">{content.team.length} member{content.team.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Team Member Cards */}
                        {content.team.map((member, i) => (
                            <div
                                key={i}
                                onClick={() => setEditingMember(i)}
                                className="bg-black/40 rounded-xl border border-orange-500/20 p-5 hover:border-orange-500/40 hover:bg-black/50 transition-all cursor-pointer group"
                            >
                                {/* Profile Image with Orange Ring */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-black/80">
                                                    <User className="w-7 h-7 text-orange-400/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <h4 className="text-white font-medium text-sm mb-0.5">{member.name || 'Unnamed'}</h4>
                                    <p className="text-orange-400/70 text-xs mb-2">{member.role || 'No role'}</p>
                                    {member.bio && (
                                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{member.bio}</p>
                                    )}
                                </div>

                                {/* Social Links */}
                                {(member.portfolio || member.github || member.linkedin) && (
                                    <div className="flex justify-center gap-2 pt-3 border-t border-orange-500/10">
                                        {member.portfolio && (
                                            <a href={member.portfolio} target="_blank" rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400/50 hover:text-orange-400 hover:bg-orange-500/20 transition-all">
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {member.github && (
                                            <a href={member.github} target="_blank" rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400/50 hover:text-orange-400 hover:bg-orange-500/20 transition-all">
                                                <Github className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400/50 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                                <Linkedin className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Edit hint */}
                                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-orange-400/50 font-mono uppercase">Click to edit</span>
                                </div>
                            </div>
                        ))}

                        {/* Add New Member Card */}
                        <button
                            onClick={() => setShowMemberForm(true)}
                            className="bg-black/20 rounded-xl border border-dashed border-orange-500/30 p-5 min-h-[200px] flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
                                <Plus className="w-6 h-6 text-orange-400/60 group-hover:text-orange-400 transition-colors" />
                            </div>
                            <span className="text-xs text-orange-400/60 font-medium group-hover:text-orange-400 transition-colors">Add Member</span>
                        </button>
                    </div>
                </div>

                {/* Edit Member Dialog */}
                {editingMember !== null && content.team[editingMember] && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
                            onClick={() => setEditingMember(null)}
                        />
                        {/* Dialog */}
                        <div className="relative bg-black rounded-2xl border border-orange-500/30 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-orange-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            {/* Close Button */}
                            <button onClick={() => setEditingMember(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                <X className="w-4 h-4" />
                            </button>

                            {/* Profile Image at Top with Edit Controls */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                            {content.team[editingMember].image ? (
                                                <img src={content.team[editingMember].image} alt={content.team[editingMember].name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-10 h-10 text-orange-400/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Image Edit Controls - Right Side */}
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                        <label className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center cursor-pointer transition-colors shadow-lg border-2 border-black" title="Upload Image">
                                            <Upload className="w-4 h-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setCropperImage(reader.result as string);
                                                            setCropperTarget('edit');
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        {content.team[editingMember].image && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setCropperImage(content.team[editingMember].image);
                                                        setCropperTarget('edit');
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-colors shadow-lg border-2 border-black"
                                                    title="Edit Crop"
                                                >
                                                    <Move className="w-4 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => updateMember(editingMember, 'image', '')}
                                                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors shadow-lg border-2 border-black"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white mt-4">{content.team[editingMember].name || 'Edit Profile'}</h3>
                                <p className="text-orange-400/70 text-sm">{content.team[editingMember].role || 'Team Member'}</p>
                            </div>

                            {/* Form Content */}
                            <div className="space-y-4">
                                {/* Basic Info - Two Column */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AdminInput
                                        label="Name"
                                        value={content.team[editingMember].name}
                                        onChange={(v) => updateMember(editingMember, 'name', v)}
                                        placeholder="Full Name"
                                    />
                                    <AdminInput
                                        label="Role"
                                        value={content.team[editingMember].role}
                                        onChange={(v) => updateMember(editingMember, 'role', v)}
                                        placeholder="Job Title"
                                    />
                                </div>

                                <AdminTextarea
                                    label="Bio"
                                    value={content.team[editingMember].bio}
                                    onChange={(v) => updateMember(editingMember, 'bio', v)}
                                    rows={3}
                                    placeholder="Short bio about this team member..."
                                />

                                {/* Social Links - Two Column */}
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs font-mono text-gray-500 uppercase mb-3">Social Links</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AdminInput
                                            label="Portfolio"
                                            value={content.team[editingMember].portfolio || ''}
                                            onChange={(v) => updateMember(editingMember, 'portfolio', v)}
                                            icon={<Globe className="w-4 h-4" />}
                                            placeholder="https://..."
                                        />
                                        <AdminInput
                                            label="GitHub"
                                            value={content.team[editingMember].github || ''}
                                            onChange={(v) => updateMember(editingMember, 'github', v)}
                                            icon={<Github className="w-4 h-4" />}
                                            placeholder="https://github.com/..."
                                        />
                                        <AdminInput
                                            label="LinkedIn"
                                            value={content.team[editingMember].linkedin || ''}
                                            onChange={(v) => updateMember(editingMember, 'linkedin', v)}
                                            icon={<Linkedin className="w-4 h-4" />}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                                <AdminButton onClick={() => setEditingMember(null)} className="flex-1">
                                    Save & Close
                                </AdminButton>
                                <AdminButton variant="danger" onClick={() => { removeMember(editingMember); setEditingMember(null); }}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Member Dialog */}
                {showMemberForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowMemberForm(false)}
                        />
                        {/* Dialog */}
                        <div className="relative bg-black rounded-2xl border border-orange-500/30 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-orange-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            {/* Close Button */}
                            <button onClick={() => setShowMemberForm(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                <X className="w-4 h-4" />
                            </button>

                            {/* Profile Image Placeholder at Top with Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                            {newMember.image ? (
                                                <img src={newMember.image} alt="New member" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-10 h-10 text-orange-400/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Image Upload Controls - Right Side */}
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                        <label className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center cursor-pointer transition-colors shadow-lg border-2 border-black" title="Upload Image">
                                            <Upload className="w-4 h-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setCropperImage(reader.result as string);
                                                            setCropperTarget('new');
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        {newMember.image && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setCropperImage(newMember.image);
                                                        setCropperTarget('new');
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-colors shadow-lg border-2 border-black"
                                                    title="Edit Crop"
                                                >
                                                    <Move className="w-4 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => setNewMember({ ...newMember, image: '' })}
                                                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors shadow-lg border-2 border-black"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white mt-4">Add Team Member</h3>
                                <p className="text-gray-500 text-sm">Create a new profile</p>
                            </div>

                            {/* Form Content */}
                            <div className="space-y-4">
                                {/* Basic Info - Two Column */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AdminInput
                                        label="Name"
                                        value={newMember.name}
                                        onChange={(v) => setNewMember({ ...newMember, name: v })}
                                        placeholder="Full name"
                                    />
                                    <AdminInput
                                        label="Role"
                                        value={newMember.role}
                                        onChange={(v) => setNewMember({ ...newMember, role: v })}
                                        placeholder="Job title"
                                    />
                                </div>

                                <AdminTextarea
                                    label="Bio"
                                    value={newMember.bio}
                                    onChange={(v) => setNewMember({ ...newMember, bio: v })}
                                    placeholder="Short bio about this team member..."
                                    rows={3}
                                />

                                {/* Social Links - Two Column */}
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs font-mono text-gray-500 uppercase mb-3">Social Links (Optional)</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AdminInput
                                            label="Portfolio"
                                            value={newMember.portfolio || ''}
                                            onChange={(v) => setNewMember({ ...newMember, portfolio: v })}
                                            icon={<Globe className="w-4 h-4" />}
                                            placeholder="https://..."
                                        />
                                        <AdminInput
                                            label="GitHub"
                                            value={newMember.github || ''}
                                            onChange={(v) => setNewMember({ ...newMember, github: v })}
                                            icon={<Github className="w-4 h-4" />}
                                            placeholder="https://github.com/..."
                                        />
                                        <AdminInput
                                            label="LinkedIn"
                                            value={newMember.linkedin || ''}
                                            onChange={(v) => setNewMember({ ...newMember, linkedin: v })}
                                            icon={<Linkedin className="w-4 h-4" />}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                                <AdminButton onClick={addMember} disabled={!newMember.name || !newMember.role} className="flex-1">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Member
                                </AdminButton>
                                <button
                                    onClick={() => setShowMemberForm(false)}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Cropper Modal */}
                {cropperImage && cropperTarget && (
                    <ImageCropper
                        imageSrc={cropperImage}
                        onCrop={(croppedImage) => {
                            if (cropperTarget === 'edit' && editingMember !== null) {
                                updateMember(editingMember, 'image', croppedImage);
                            } else if (cropperTarget === 'new') {
                                setNewMember({ ...newMember, image: croppedImage });
                            }
                            setCropperImage(null);
                            setCropperTarget(null);
                        }}
                        onCancel={() => {
                            setCropperImage(null);
                            setCropperTarget(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
