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

    const zones = [...new Set(MOCK_INCIDENTS.map(i => i.zone))];
    const activeCount = MOCK_INCIDENTS.filter(i => i.status === 'Active').length;
    const criticalCount = MOCK_INCIDENTS.filter(i => i.severity === 'critical').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tight">Incident Management</h2>
                    <p className="text-gray-500 font-medium mt-1">Monitor and respond to active incidents</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-black text-red-600">{activeCount} Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-black text-orange-600">{criticalCount} Critical</span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search incidents by ID, zone, or type..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00AEEF] outline-none cursor-pointer">
                            <option value="all">All Severity</option>
                            <option value="critical">Critical</option>
                            <option value="warning">Warning</option>
                            <option value="low">Low</option>
                        </select>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00AEEF] outline-none cursor-pointer">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Monitoring">Monitoring</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00AEEF] outline-none cursor-pointer hidden md:block">
                            <option value="all">All Zones</option>
                            {zones.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Incident Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Incident</th>
                                <th className="px-6 py-4">Zone</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Authority</th>
                                <th className="px-6 py-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredIncidents.map((inc) => {
                                const TypeIcon = typeIcon(inc.type);
                                return (
                                    <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-[#002868] bg-blue-50 px-2 py-1 rounded border border-blue-100">{inc.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-bold text-gray-700">{inc.zone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TypeIcon className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-bold text-gray-700">{inc.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${severityColor(inc.severity)}`}>
                                                {inc.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColor(inc.status)}`}>
                                                {inc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-3.5 h-3.5 text-gray-400" />
                                                <span className={`text-sm font-bold ${inc.authority === 'Unassigned' ? 'text-red-500 italic' : 'text-gray-700'}`}>{inc.authority}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{inc.time}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
