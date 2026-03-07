import React, { useState, useEffect, useMemo } from 'react';
import { AlertOctagon, Filter, Search, ChevronDown, MapPin, Clock, Shield, AlertTriangle, Heart, Users, X, Plus, Activity, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { getIncidents, getAssignments, getZones, createIncident } from '../../services/api';

export default function IncidentManagement() {
    const [incidents, setIncidents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zones, setZones] = useState([]);
    const [newIncident, setNewIncident] = useState({
        type: 'Overcrowding',
        zoneId: '',
        severity: 'Medium',
        description: '',
        locationNotes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchIncidents = async () => {
        setLoading(true);
        setError(null);
        try {
            const [res, assignRes] = await Promise.all([
                getIncidents(),
                getAssignments()
            ]);

            if (res.success) {
                setIncidents(res.data || []);
            } else {
                setError('Failed to fetch incidents from the server.');
            }

            if (assignRes.success) {
                setAssignments(assignRes.data || []);
            }
        } catch {
            setError('Network error. Could not connect to the database.');
        } finally {
            setLoading(false);
        }
    };

    const fetchZones = async () => {
        try {
            const res = await getZones();
            if (Array.isArray(res)) {
                setZones(res);
                if (res.length > 0 && !newIncident.zoneId) {
                    setNewIncident(prev => ({ ...prev, zoneId: res[0]._id }));
                }
            }
        } catch (err) {
            console.error("Failed to fetch zones for incident logging:", err);
        }
    };

    useEffect(() => {
        fetchIncidents();
        fetchZones();
        const interval = setInterval(fetchIncidents, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleCreateIncident = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createIncident(newIncident);
            if (res.success) {
                setIsModalOpen(false);
                setNewIncident({
                    type: 'Overcrowding',
                    zoneId: zones[0]?._id || '',
                    severity: 'Medium',
                    description: '',
                    locationNotes: ''
                });
                fetchIncidents();
            } else {
                alert(res.message || "Failed to log incident");
            }
        } catch (err) {
            console.error("Create Incident Error:", err);
            alert("Network error. Could not log incident.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSeverityStyle = (sev) => {
        const s = sev?.toLowerCase() || '';
        if (s === 'critical') return 'text-red-600 bg-red-50 border-red-100';
        if (s === 'high' || s === 'warning') return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-blue-600 bg-blue-50 border-blue-100'; // Medium / Low
    };

    const _statusColor = (st) => {
        if (st === 'Active') return 'bg-red-50 text-red-600';
        if (st === 'Dispatched') return 'bg-purple-50 text-purple-600';
        if (st === 'Monitoring') return 'bg-yellow-50 text-yellow-700';
        return 'bg-emerald-50 text-emerald-600';
    };

    const typeIcon = (type) => {
        if (type === 'Overcrowding') return Users;
        if (type === 'Stampede Risk') return AlertTriangle;
        if (type === 'Medical Emergency') return Heart;
        return AlertOctagon;
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredIncidents = useMemo(() => {
        return incidents.filter(inc => {
            if (filterSeverity !== 'all' && inc.severity?.toLowerCase() !== filterSeverity.toLowerCase()) return false;
            // Map 'Active' filter to 'Active', 'Dispatched', 'Monitoring'
            // Map 'Resolved' to 'Resolved'
            if (filterStatus !== 'all' && inc.status !== filterStatus) return false;

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesId = inc.incidentId?.toLowerCase().includes(searchLower);
                const matchesZone = inc.zoneId?.zoneName?.toLowerCase().includes(searchLower);
                const matchesType = inc.type?.toLowerCase().includes(searchLower);
                if (!matchesId && !matchesZone && !matchesType) return false;
            }
            return true;
        });
    }, [incidents, filterSeverity, filterStatus, searchQuery]);

    const activeCount = incidents.filter(i => i.status !== 'Resolved').length;

    if (loading && incidents.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-secondary animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Incidents...</p>
                </div>
            </div>
        );
    }

    if (error && incidents.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-bold text-slate-700">{error}</p>
                    <button onClick={fetchIncidents} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary/90 transition-all">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Incident Management</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Monitor and respond to real-time events</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchIncidents} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary/90 transition-all"
                    >
                        <Plus size={18} /> Log Incident
                    </button>
                </div>
            </div>

            {/* Filters and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 min-w-[200px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-1 focus-within:ring-secondary transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by ID, zone, or type..."
                                className="ml-3 bg-transparent outline-none w-full text-sm font-medium text-slate-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Selects */}
                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Monitoring">Monitoring</option>
                            <option value="Resolved">Resolved</option>
                        </select>

                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors"
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                        >
                            <option value="all">All Severity</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/10 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Active Now</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-white tracking-tight">{activeCount}</p>
                        <p className="text-xs font-medium text-emerald-300 pb-1.5 flex items-center gap-1">
                            <Activity size={12} /> Live response
                        </p>
                    </div>
                </div>
            </div>

            {/* Incidents Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone / Location</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredIncidents.map((incident) => {
                                // Match zone assignment to dynamically show authority even if incident.assignedTo is missing
                                const zoneAssignment = assignments.find(a =>
                                    a.zoneId && incident.zoneId &&
                                    a.zoneId._id === incident.zoneId._id &&
                                    a.status === 'Active'
                                );
                                const assignedUser = incident.assignedTo || zoneAssignment?.userId;

                                return (
                                    <tr key={incident._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">#{incident.incidentId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {React.createElement(typeIcon(incident.type), { size: 14, className: "text-slate-400" })}
                                                <span className="text-sm font-bold text-slate-700">{incident.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-slate-300" />
                                                    <span className="text-sm font-medium text-slate-600">{incident.zoneId?.zoneName || 'Unknown Zone'}</span>
                                                </div>
                                                {incident.locationNotes && (
                                                    <span className="text-[10px] text-slate-400 italic font-medium ml-6">{incident.locationNotes}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getSeverityStyle(incident.severity)}`}>
                                                {incident.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${incident.status === 'Resolved' ? 'bg-emerald-500' : incident.status === 'Active' ? 'bg-red-500' : incident.status === 'Dispatched' ? 'bg-purple-500' : 'bg-yellow-500'}`}></div>
                                                <span className="text-sm font-bold text-slate-700">{incident.status}</span>
                                            </div>
                                            {assignedUser?.name ? (
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Shield size={10} /> {assignedUser.name}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest ${assignedUser.assignmentStatus === 'Accepted' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {assignedUser.assignmentStatus === 'Accepted' ? 'ASSIGNED' : assignedUser.assignmentStatus === 'Pending' ? '[Req Pending]' : 'UNASSIGNED'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    <p className="text-[9px] font-bold text-red-500 uppercase">Unassigned</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">No Authority in Sector</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-400">{formatTime(incident.createdAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all text-slate-400 hover:text-secondary group-hover:scale-110">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredIncidents.length === 0 && !loading && (
                    <div className="p-12 text-center">
                        <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">No incidents match your criteria</p>
                        {searchQuery || filterSeverity !== 'all' || filterStatus !== 'all' ? (
                            <button onClick={() => { setSearchQuery(''); setFilterSeverity('all'); setFilterStatus('all'); }} className="mt-4 text-xs font-bold text-secondary hover:text-primary transition-colors">Clear all filters</button>
                        ) : null}
                    </div>
                )}
            </div>

            {/* --- Log Incident Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <Plus size={14} className="text-secondary" />
                                Log New Incident
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateIncident} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Incident Type</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-secondary transition-all"
                                        value={newIncident.type}
                                        onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                                    >
                                        <option value="Overcrowding">Overcrowding</option>
                                        <option value="Stampede Risk">Stampede Risk</option>
                                        <option value="Medical Emergency">Medical Emergency</option>
                                        <option value="Security Breach">Security Breach</option>
                                        <option value="Fire Hazard">Fire Hazard</option>
                                        <option value="Unattended Bag">Unattended Bag</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location / Zone</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-secondary transition-all"
                                        value={newIncident.zoneId}
                                        onChange={(e) => setNewIncident({ ...newIncident, zoneId: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select Zone</option>
                                        {zones.map(z => (
                                            <option key={z._id} value={z._id}>{z.zoneName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Severity Level</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-secondary transition-all"
                                        value={newIncident.severity}
                                        onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location Notes</label>
                                    <input
                                        type="text"
                                        placeholder="Specific gate, section..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-secondary transition-all"
                                        value={newIncident.locationNotes}
                                        onChange={(e) => setNewIncident({ ...newIncident, locationNotes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Incident Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-secondary transition-all min-h-[100px] resize-none"
                                    placeholder="Describe the situation in detail..."
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                    Broadcast Incident
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
