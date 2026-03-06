import React, { useState } from 'react';
import { AlertOctagon, Filter, Search, ChevronDown, MapPin, Clock, Shield, AlertTriangle, Heart, Users, X } from 'lucide-react';

const MOCK_INCIDENTS = [
    { id: 'INC-001', zone: 'North Bleachers', type: 'Overcrowding', severity: 'critical', status: 'Active', authority: 'Atharv', time: '17:32', description: 'Crowd density exceeded 95% capacity' },
    { id: 'INC-002', zone: 'South Gate', type: 'Gate Congestion', severity: 'warning', status: 'Active', authority: 'Patel', time: '17:28', description: 'Entry flow rate exceeds safe limits' },
    { id: 'INC-003', zone: 'East Wing VIP', type: 'Medical Emergency', severity: 'critical', status: 'Dispatched', authority: 'Siddhi', time: '17:15', description: 'Medical team dispatched for visitor' },
    { id: 'INC-004', zone: 'Player Tunnel', type: 'Stampede Risk', severity: 'critical', status: 'Monitoring', authority: 'Vinit', time: '17:05', description: 'Sudden crowd movement detected' },
    { id: 'INC-005', zone: 'West Wing', type: 'Overcrowding', severity: 'warning', status: 'Resolved', authority: 'Shreyash', time: '16:45', description: 'Crowd redistributed successfully' },
    { id: 'INC-006', zone: 'Perimeter', type: 'Gate Congestion', severity: 'low', status: 'Resolved', authority: 'Siddhesh', time: '16:30', description: 'Exit gate bottleneck cleared' },
    { id: 'INC-007', zone: 'Lower Concourse', type: 'Medical Emergency', severity: 'warning', status: 'Active', authority: 'Unassigned', time: '17:35', description: 'Visitor reported feeling unwell' },
    { id: 'INC-008', zone: 'Media Center', type: 'Overcrowding', severity: 'low', status: 'Monitoring', authority: 'Atharv', time: '16:00', description: 'Press area approaching capacity' },
];

export default function IncidentManagement() {
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterZone, setFilterZone] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const severityColor = (sev) => {
        if (sev === 'critical') return 'bg-red-100 text-red-700 border-red-200';
        if (sev === 'warning') return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    const statusColor = (st) => {
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

    const filteredIncidents = MOCK_INCIDENTS.filter(inc => {
        if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
        if (filterZone !== 'all' && inc.zone !== filterZone) return false;
        if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
        if (searchQuery && !inc.id.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.zone.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Incident Management</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Monitor and respond to real-time events</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary/90 transition-all">
                        <Plus size={18} /> Log Incident
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export Results
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
                            <option value="All Status">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Monitoring">Monitoring</option>
                        </select>

                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All Priority">All Priority</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                        </select>
                    </div>
                </div>

                <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/10 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Active Now</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-white tracking-tight">{filteredIncidents.filter(i => i.status === 'Active').length}</p>
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
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredIncidents.map((incident) => (
                                <tr key={incident.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">#{incident.id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{incident.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-300" />
                                            <span className="text-sm font-medium text-slate-600">{incident.zone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getPriorityStyle(incident.priority)}`}>
                                            {incident.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${incident.status === 'Resolved' ? 'bg-emerald-500' : incident.status === 'Active' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                            <span className="text-sm font-bold text-slate-700">{incident.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{incident.time}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all text-slate-400 hover:text-secondary group-hover:scale-110">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredIncidents.length === 0 && (
                    <div className="p-12 text-center">
                        <AlertOctagon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-400">No incidents match your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
