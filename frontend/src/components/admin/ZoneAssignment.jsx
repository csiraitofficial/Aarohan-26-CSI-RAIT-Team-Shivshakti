import React, { useState } from 'react';
import { Shield, ShieldAlert, UserCheck, AlertOctagon, MapPin, Search, Brain, Activity } from 'lucide-react';

export default function ZoneAssignment() {
    // Sector stabilization data
    const [sectors, setSectors] = useState([
        { id: 'ZB-01', name: 'North Bleachers', coordinator: 'Atharv', status: 'STABILIZED' },
        { id: 'ZB-02', name: 'Player Tunnel', coordinator: null, status: 'UNASSIGNED' },
        { id: 'ZB-03', name: 'East Wing VIP', coordinator: 'Siddhi', status: 'STABILIZED' },
        { id: 'ZB-04', name: 'South Gate Entrance', coordinator: 'Patel', status: 'STABILIZED' },
        { id: 'ZB-05', name: 'Press Box Sector', coordinator: null, status: 'UNASSIGNED' },
        { id: 'ZB-06', name: 'Perimeter Patrol', coordinator: 'Vinit', status: 'STABILIZED' },
        { id: 'ZB-07', name: 'VIP Lounge Alpha', coordinator: 'Shreyash', status: 'STABILIZED' },
        { id: 'ZB-08', name: 'East Terraces', coordinator: null, status: 'UNASSIGNED' },
        { id: 'ZB-09', name: 'Media Center Delta', coordinator: 'Siddhesh', status: 'STABILIZED' },
        { id: 'ZB-10', name: 'Lower Concourse B', coordinator: null, status: 'UNASSIGNED' },
    ]);

    const authorities = ['Atharv', 'Siddhi', 'Patel', 'Vinit', 'Shreyash', 'Siddhesh'];
    const [searchQuery, setSearchQuery] = useState('');

    const handleAssign = (sectorId, authority) => {
        setSectors(prev => prev.map(s =>
            s.id === sectorId
                ? { ...s, coordinator: authority, status: 'STABILIZED' }
                : s
        ));
    };

    const handleUnassign = (sectorId) => {
        setSectors(prev => prev.map(s =>
            s.id === sectorId
                ? { ...s, coordinator: null, status: 'UNASSIGNED' }
                : s
        ));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Sector Stabilization Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tighter uppercase italic">Zone Assignment Protocol</h2>
                    <p className="text-gray-500 font-bold mt-1 tracking-tight">Deployment & Sector Stabilization Interface</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-red-100 shadow-sm animate-pulse">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                    <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">Gravity Breaches Detected</p>
                        <p className="text-xl font-black text-red-600 leading-none mt-1">
                            {sectors.filter(s => !s.coordinator).length} Sectors Vulnerable
                        </p>
                    </div>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Deployment Controls */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-[#002868]">
                        <UserCheck className="w-6 h-6" />
                        <h3 className="font-black uppercase text-sm tracking-widest">Available Authorities</h3>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Authority..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#00AEEF] outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        {authorities.map(auth => (
                            <div key={auth} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#002868] hover:text-white transition-all cursor-move group">
                                <span className="font-bold text-sm tracking-tight">{auth}</span>
                                <Shield className="w-4 h-4 text-indigo-300 group-hover:text-[#00AEEF]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tactical Deployment Table */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-black text-[#002868] uppercase text-sm tracking-widest">Active Stadium Sectors</h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                            <Activity className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sector Integrity High</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Sector ID</th>
                                    <th className="px-6 py-4">Zone Coordinates</th>
                                    <th className="px-6 py-4">Authority Status</th>
                                    <th className="px-6 py-4">Equilibrium</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sectors.map((sector) => (
                                    <tr key={sector.id} className={`group hover:bg-gray-50/80 transition-colors ${!sector.coordinator ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-[#002868] bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase">
                                                {sector.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="font-black text-gray-800 text-sm tracking-tight italic">{sector.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {sector.coordinator ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                    <span className="text-sm font-bold text-gray-600 tracking-tight">{sector.coordinator} Deployment Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <AlertOctagon className="w-4 h-4 text-red-600 animate-bounce" />
                                                    <span className="text-sm font-black text-red-600 tracking-tighter uppercase italic">Gravity Breach</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${sector.coordinator ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200 shadow-sm shadow-red-100'}`}>
                                                {sector.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {sector.coordinator ? (
                                                <button
                                                    onClick={() => handleUnassign(sector.id)}
                                                    className="text-[10px] font-black text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                                                >
                                                    Recall Unit
                                                </button>
                                            ) : (
                                                <select
                                                    onChange={(e) => handleAssign(sector.id, e.target.value)}
                                                    className="text-[10px] font-black bg-[#002868] text-white px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-[#00AEEF] cursor-pointer"
                                                >
                                                    <option value="">Deploy Unit</option>
                                                    {authorities.map(a => <option key={a} value={a}>{a}</option>)}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* AI Recommendations Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <h3 className="font-black text-[#002868] uppercase text-sm tracking-widest">AI Deployment Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        { msg: 'Deploy additional officers to Player Tunnel', priority: 'HIGH', color: 'border-red-200 bg-red-50' },
                        { msg: 'Redirect crowd from Gate 3 to Gate 5', priority: 'MEDIUM', color: 'border-orange-200 bg-orange-50' },
                        { msg: 'Open emergency exit Gate 7 for dispersal', priority: 'HIGH', color: 'border-red-200 bg-red-50' },
                        { msg: 'East Terraces require immediate coverage', priority: 'HIGH', color: 'border-red-200 bg-red-50' },
                        { msg: 'Lower Concourse B approaching capacity', priority: 'MEDIUM', color: 'border-orange-200 bg-orange-50' },
                        { msg: 'Press Box sector stable — reduce patrol', priority: 'LOW', color: 'border-blue-200 bg-blue-50' },
                    ].map((rec, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${rec.color} hover:shadow-sm transition-all cursor-pointer`}>
                            <p className="text-sm font-bold text-gray-800 leading-snug">{rec.msg}</p>
                            <span className={`inline-block mt-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${rec.priority === 'HIGH' ? 'text-red-600 border-red-300 bg-red-100' : rec.priority === 'MEDIUM' ? 'text-orange-600 border-orange-300 bg-orange-100' : 'text-blue-600 border-blue-300 bg-blue-100'}`}>
                                {rec.priority} PRIORITY
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

