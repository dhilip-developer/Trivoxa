import React, { useEffect, useState, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS } from '../../lib/firestore';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
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
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-3 bg-black/40 border border-dashed border-white/20 rounded-xl text-gray-400 text-sm hover:border-orange-500/50 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {value ? 'Change Image' : 'Choose Image'}
                        </button>
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

    const addMember = () => {
        if (newMember.name && newMember.role) {
            setContent({ ...content, team: [...content.team, newMember] });
            setNewMember(emptyMember);
            setShowMemberForm(false);
            showToast('Team member added', 'success');
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
                    <AdminButton onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </AdminButton>
                }
            />

            <div className="max-w-6xl space-y-6">
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

                {/* Team Members */}
                <AdminCard title="Team Members" accentColor="blue">
                    {content.team.length === 0 ? (
                        <AdminEmptyState
                            icon={<Users className="w-12 h-12" />}
                            title="No team members"
                            description="Add your first team member"
                            action={
                                <AdminButton onClick={() => setShowMemberForm(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Member
                                </AdminButton>
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Team Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {content.team.map((member, i) => (
                                    <div key={i} className="relative group">
                                        {editingMember === i ? (
                                            // Edit Mode
                                            <div className="bg-black/40 p-4 rounded-xl border border-orange-500/30 space-y-3">
                                                <AdminInput
                                                    label="Name"
                                                    value={member.name}
                                                    onChange={(v) => updateMember(i, 'name', v)}
                                                />
                                                <AdminInput
                                                    label="Role"
                                                    value={member.role}
                                                    onChange={(v) => updateMember(i, 'role', v)}
                                                />
                                                <ImageUpload
                                                    label="Profile Image"
                                                    value={member.image}
                                                    onChange={(v) => updateMember(i, 'image', v)}
                                                />
                                                <AdminTextarea
                                                    label="Bio"
                                                    value={member.bio}
                                                    onChange={(v) => updateMember(i, 'bio', v)}
                                                    rows={2}
                                                />
                                                <div className="grid grid-cols-1 gap-2">
                                                    <AdminInput
                                                        label="Portfolio"
                                                        value={member.portfolio || ''}
                                                        onChange={(v) => updateMember(i, 'portfolio', v)}
                                                        icon={<Globe className="w-4 h-4" />}
                                                    />
                                                    <AdminInput
                                                        label="GitHub"
                                                        value={member.github || ''}
                                                        onChange={(v) => updateMember(i, 'github', v)}
                                                        icon={<Github className="w-4 h-4" />}
                                                    />
                                                    <AdminInput
                                                        label="LinkedIn"
                                                        value={member.linkedin || ''}
                                                        onChange={(v) => updateMember(i, 'linkedin', v)}
                                                        icon={<Linkedin className="w-4 h-4" />}
                                                    />
                                                </div>
                                                <AdminButton size="sm" onClick={() => setEditingMember(null)}>
                                                    Done Editing
                                                </AdminButton>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 flex items-center justify-center overflow-hidden shrink-0">
                                                        {member.image ? (
                                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-orange-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{member.name}</h4>
                                                        <p className="text-orange-400 text-sm">{member.role}</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{member.bio}</p>
                                                <div className="flex gap-2">
                                                    <AdminButton size="sm" variant="ghost" onClick={() => setEditingMember(i)}>
                                                        <Edit3 className="w-4 h-4" />
                                                    </AdminButton>
                                                    <AdminButton size="sm" variant="danger" onClick={() => removeMember(i)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </AdminButton>
                                                    <div className="flex gap-1 ml-auto">
                                                        {member.github && (
                                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-white">
                                                                <Github className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {member.linkedin && (
                                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-blue-400">
                                                                <Linkedin className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Member Button */}
                            {!showMemberForm && (
                                <AdminButton variant="secondary" onClick={() => setShowMemberForm(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Team Member
                                </AdminButton>
                            )}
                        </div>
                    )}

                    {/* Add New Member Form */}
                    {showMemberForm && (
                        <div className="mt-4 bg-black/40 p-4 rounded-xl border border-dashed border-green-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-green-400 text-xs font-mono">+ NEW TEAM MEMBER</p>
                                <button onClick={() => setShowMemberForm(false)} className="text-gray-500 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                    placeholder="e.g., Developer"
                                />
                            </div>
                            <ImageUpload
                                label="Profile Image"
                                value={newMember.image}
                                onChange={(v) => setNewMember({ ...newMember, image: v })}
                            />
                            <AdminTextarea
                                label="Bio"
                                value={newMember.bio}
                                onChange={(v) => setNewMember({ ...newMember, bio: v })}
                                placeholder="Short biography..."
                                rows={2}
                            />
                            <AdminButton onClick={addMember} disabled={!newMember.name || !newMember.role}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Member
                            </AdminButton>
                        </div>
                    )}
                </AdminCard>
            </div>
        </div>
    );
}
