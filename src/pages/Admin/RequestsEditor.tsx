import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, ServiceRequest } from '../../lib/firestore';
import { useToast } from '../../components/Toast';
import {
    AdminPageHeader,
    AdminCard,
    AdminButton,
    AdminLoader,
    AdminEmptyState,
    AdminBadge,
    AdminStatCard
} from '../../components/Admin';
import { Inbox, Trash2, MessageCircle, Check, X, Clock, Calendar, User, Mail, Phone, FileText, Search, CheckSquare, Square } from 'lucide-react';

const statusConfig = {
    pending: { color: 'warning', label: 'Pending', icon: <Clock className="w-3 h-3" /> },
    accepted: { color: 'info', label: 'Accepted', icon: <Check className="w-3 h-3" /> },
    scheduled: { color: 'default', label: 'Scheduled', icon: <Calendar className="w-3 h-3" /> },
    completed: { color: 'success', label: 'Completed', icon: <Check className="w-3 h-3" /> },
    rejected: { color: 'danger', label: 'Rejected', icon: <X className="w-3 h-3" /> },
};

export default function RequestsEditor() {
    const { showToast } = useToast();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const fetchRequests = async () => {
        try {
            const q = query(collection(db, COLLECTIONS.REQUESTS), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
            setRequests(items);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: ServiceRequest['status']) => {
        try {
            await updateDoc(doc(db, COLLECTIONS.REQUESTS, id), { status, updatedAt: new Date() });
            showToast(`Status updated to ${status}`, 'success');
            fetchRequests();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm('Delete this request?')) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.REQUESTS, id));
            showToast('Request deleted', 'success');
            fetchRequests();
            setSelectedIds(prev => prev.filter(i => i !== id));
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} selected requests?`)) return;

        setBulkDeleting(true);
        try {
            await Promise.all(selectedIds.map(id => deleteDoc(doc(db, COLLECTIONS.REQUESTS, id))));
            showToast(`${selectedIds.length} requests deleted`, 'success');
            setSelectedIds([]);
            fetchRequests();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setBulkDeleting(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === filteredRequests.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRequests.map(r => r.id!));
        }
    };

    const sendWhatsApp = (request: ServiceRequest) => {
        const msg = `Hi ${request.name}, this is Trivoxa Team. We received your project request and would like to discuss further.`;
        const phone = request.phone?.replace(/[^0-9]/g, '');
        if (phone) window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    // Apply filters and search
    const filteredRequests = requests.filter(r => {
        const matchesFilter = filter === 'all' || r.status === filter;
        const matchesSearch = searchQuery === '' ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.projectType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.company?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <AdminLoader text="Loading requests..." />;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <AdminPageHeader
                title="Service Requests"
                subtitle="Manage incoming project inquiries"
                actions={
                    selectedIds.length > 0 && (
                        <AdminButton variant="danger" onClick={bulkDelete} disabled={bulkDeleting}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.length} Selected`}
                        </AdminButton>
                    )
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <AdminStatCard label="Total Requests" value={stats.total} icon={<Inbox />} color="blue" />
                <AdminStatCard label="Pending" value={stats.pending} icon={<Clock />} color="orange" />
                <AdminStatCard label="Completed" value={stats.completed} icon={<Check />} color="green" />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'accepted', 'scheduled', 'completed', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-2 rounded-xl font-mono text-xs border transition-all ${filter === status
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bulk Selection Header */}
            {filteredRequests.length > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 bg-black/30 rounded-xl border border-white/5">
                    <button
                        onClick={selectAll}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        {selectedIds.length === filteredRequests.length && filteredRequests.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-orange-400" />
                        ) : (
                            <Square className="w-5 h-5" />
                        )}
                        {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
                    </button>
                    <span className="text-gray-600 text-sm">|</span>
                    <span className="text-gray-500 text-sm">{filteredRequests.length} requests</span>
                </div>
            )}

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <AdminCard>
                    <AdminEmptyState
                        icon={<Inbox className="w-12 h-12" />}
                        title="No requests found"
                        description={searchQuery ? `No results for "${searchQuery}"` : filter === 'all' ? 'No service requests yet' : `No ${filter} requests`}
                    />
                </AdminCard>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map(request => (
                        <div
                            key={request.id}
                            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${selectedIds.includes(request.id!) ? 'ring-2 ring-orange-500/50' : 'hover:ring-1 hover:ring-white/20'}`}
                        >
                            {/* Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                            <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${selectedIds.includes(request.id!) ? 'from-orange-500/30 to-orange-600/10 opacity-30' : 'from-blue-500/10 to-transparent group-hover:opacity-20'}`} />

                            <div className="relative p-5">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleSelect(request.id!)}
                                        className="shrink-0"
                                    >
                                        {selectedIds.includes(request.id!) ? (
                                            <CheckSquare className="w-5 h-5 text-orange-400" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                                        )}
                                    </button>

                                    {/* Main Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <User className="w-4 h-4 text-orange-400" />
                                                {request.name}
                                            </h3>
                                            <AdminBadge variant={statusConfig[request.status]?.color as any}>
                                                {statusConfig[request.status]?.icon}
                                                <span className="ml-1">{statusConfig[request.status]?.label}</span>
                                            </AdminBadge>
                                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
                                                {request.projectType}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${request.email}`} className="hover:text-orange-400">{request.email}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Phone className="w-4 h-4" />
                                                <span>{request.phone || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {request.description && (
                                            <div className="p-3 bg-black/30 rounded-lg border border-white/5 mb-4">
                                                <p className="text-sm text-gray-400 flex gap-2">
                                                    <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                                                    {request.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Budget & Timeline */}
                                        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500">
                                            {request.budget && <span>Budget: <span className="text-green-400">{request.budget}</span></span>}
                                            {request.timeline && <span>Timeline: <span className="text-blue-400">{request.timeline}</span></span>}
                                            <span>Received: {request.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap lg:flex-col gap-2 lg:w-32">
                                        {request.status === 'pending' && (
                                            <>
                                                <AdminButton size="sm" onClick={() => updateStatus(request.id!, 'accepted')}>
                                                    <Check className="w-4 h-4 mr-1" /> Accept
                                                </AdminButton>
                                                <AdminButton size="sm" variant="danger" onClick={() => updateStatus(request.id!, 'rejected')}>
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </AdminButton>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <AdminButton size="sm" onClick={() => updateStatus(request.id!, 'scheduled')}>
                                                <Calendar className="w-4 h-4 mr-1" /> Schedule
                                            </AdminButton>
                                        )}
                                        {request.status === 'scheduled' && (
                                            <AdminButton size="sm" onClick={() => updateStatus(request.id!, 'completed')}>
                                                <Check className="w-4 h-4 mr-1" /> Complete
                                            </AdminButton>
                                        )}
                                        {request.phone && (
                                            <AdminButton size="sm" variant="secondary" onClick={() => sendWhatsApp(request)}>
                                                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                                            </AdminButton>
                                        )}
                                        <AdminButton size="sm" variant="ghost" onClick={() => deleteRequest(request.id!)}>
                                            <Trash2 className="w-4 h-4" />
                                        </AdminButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
