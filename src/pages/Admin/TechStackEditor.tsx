import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { COLLECTIONS, TechStackItem } from '../../lib/firestore';

export default function TechStackEditor() {
    const [items, setItems] = useState<TechStackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<Partial<TechStackItem>>({
        name: '',
        iconUrl: '',
        color: '#F97316',
        order: 0,
        isActive: true,
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.TECH_STACK));
            const data = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as TechStackItem))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            setItems(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `tech-icons/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFormData({ ...formData, iconUrl: url });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload icon' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSave = { ...formData, updatedAt: serverTimestamp() };

            if (editingId) {
                await updateDoc(doc(db, COLLECTIONS.TECH_STACK, editingId), dataToSave);
                setMessage({ type: 'success', text: 'Updated!' });
            } else {
                await addDoc(collection(db, COLLECTIONS.TECH_STACK), { ...dataToSave, order: items.length });
                setMessage({ type: 'success', text: 'Added!' });
            }
            resetForm();
            fetchItems();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleEdit = (item: TechStackItem) => {
        setEditingId(item.id || null);
        setFormData(item);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await deleteDoc(doc(db, COLLECTIONS.TECH_STACK, id));
        fetchItems();
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ name: '', iconUrl: '', color: '#F97316', order: 0, isActive: true });
    };

    if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tech Stack</h1>
            <p className="text-gray-500 mb-8">Manage floating tech icons</p>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">{editingId ? 'Edit' : 'Add'} Tech</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Icon</label>
                            <input type="file" accept="image/*" onChange={handleIconUpload} className="text-gray-400" />
                            {uploading && <p className="text-orange-500 text-sm">Uploading...</p>}
                            {formData.iconUrl && <img src={formData.iconUrl} alt="Icon" className="mt-2 w-12 h-12" />}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Color</label>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-16 h-10"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-gray-400">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            Active
                        </label>
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Items ({items.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {items.map((item) => (
                            <div key={item.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center">
                                {item.iconUrl && <img src={item.iconUrl} alt={item.name} className="w-10 h-10 mx-auto mb-2" />}
                                <p className="text-white text-sm">{item.name}</p>
                                <div className="flex justify-center gap-2 mt-2">
                                    <button onClick={() => handleEdit(item)} className="text-blue-400 text-xs">Edit</button>
                                    <button onClick={() => handleDelete(item.id!)} className="text-red-400 text-xs">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
