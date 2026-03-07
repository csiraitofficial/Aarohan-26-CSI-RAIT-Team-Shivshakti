import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, UserCheck, AlertOctagon, MapPin, Search, Brain, Activity, User, ChevronRight, Info } from 'lucide-react';
import { getAuthorities, getZones, getMyVenue, createAssignment, getAssignments } from '../../services/api';

export default function ZoneAssignment() {
    const [loading, setLoading] = useState(true);
    const [venue, setVenue] = useState(null);
    const [zones, setZones] = useState([]);
    const [authorities, setAuthorities] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAuth, setSelectedAuth] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const [venueRes, authRes, assignRes] = await Promise.all([
                    getMyVenue(),
                    getAuthorities(),
                    getAssignments()
                ]);

                if (!isMounted) return;

                if (venueRes.success && venueRes.exists) {
                    setVenue(venueRes.venue);
                    setZones(venueRes.zones);
                }

                if (authRes.success) {
                    setAuthorities(authRes.data);
                }

                if (assignRes.success) {
                    setAssignments(assignRes.data);
                }
            } catch (error) {
                console.error("Data Load Error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const pollData = async () => {
            try {
                const [authRes, assignRes] = await Promise.all([
                    getAuthorities(),
                    getAssignments()
                ]);
                if (!isMounted) return;

                if (authRes.success) setAuthorities(authRes.data);
                if (assignRes.success) setAssignments(assignRes.data);

                // Keep selected auth synced if they accepted
                setSelectedAuth(prev => {
                    if (!prev) return null;
                    const updated = authRes.data?.find(a => a._id === prev._id);
                    return updated || prev;
                });
            } catch (error) {
                console.error("Polling Error:", error);
            }
        };

        loadData();
        const intervalId = setInterval(pollData, 3000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const handleAssign = async (userId, zoneId) => {
        try {
            const res = await createAssignment(userId, zoneId);
            if (res.success) {
                // Refresh both assignments and authorities (to get latest assignmentStatus)
                const [assignRes, authRes] = await Promise.all([
                    getAssignments(),
                    getAuthorities()
                ]);
                if (assignRes.success) setAssignments(assignRes.data);
                if (authRes.success) setAuthorities(authRes.data);
                setSelectedAuth(null);
            }
        } catch (error) {
            console.error("Assignment Error:", error);
        }
    };

    const getAssignedZone = (userId) => {
        const assignment = assignments.find(a => a.userId?._id === userId);
        return assignment ? assignment.zoneId?.zoneName : 'UNASSIGNED';
    };

    const filteredAuthorities = (authorities || []).filter(a =>
        a.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        a.email?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#002868] rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse">Syncing Tactical Grid...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tighter uppercase italic underline decoration-[4px] decoration-sky-400 underline-offset-8">Authority Deployment Control</h2>
                    <p className="text-gray-500 font-bold mt-3 tracking-tight">Map registered personnel to venue security sectors</p>
                </div>
                {venue && (
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <MapPin className="text-sky-500 w-4 h-4" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Active Venue</p>
                            <p className="text-sm font-black text-[#002868]">{venue.name}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Tactical Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. Personnel List */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[650px]">
                    <div className="p-6 border-b border-slate-50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Registered Authorities</h3>
                                <p className="text-[10px] font-bold text-slate-400">{authorities.length} Units Available</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-400 outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {(filteredAuthorities || []).map(auth => {
                            const zone = getAssignedZone(auth._id);
                            return (
                                <button
                                    key={auth._id}
                                    onClick={() => setSelectedAuth(auth)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedAuth?._id === auth._id ? 'bg-[#002868] border-[#002868] text-white shadow-lg' : 'bg-white border-transparent hover:border-slate-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${selectedAuth?._id === auth._id ? 'border-sky-400/50 bg-sky-400/20' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black tracking-tight ${selectedAuth?._id === auth._id ? 'text-white' : 'text-slate-700'}`}>{auth.name}</p>
                                            <p className={`text-[10px] font-bold mt-1 ${selectedAuth?._id === auth._id ? 'text-sky-200' : 'text-slate-400'}`}>
                                                {zone !== 'UNASSIGNED' ? (
                                                    <span className="flex flex-wrap items-center gap-2">
                                                        <span className="flex items-center gap-1"><Shield size={10} className="text-emerald-400" /> {zone}</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black border ${auth.assignmentStatus === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                            Req: {auth.assignmentStatus || 'Pending'}
                                                        </span>
                                                    </span>
                                                ) : 'Not Deployed'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`${selectedAuth?._id === auth._id ? 'text-sky-400' : 'text-slate-200'}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Tactical Detail / Assignment Panel */}
                <div className="lg:col-span-8 space-y-6">
                    {selectedAuth ? (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                            {/* Profile Header */}
                            <div className="bg-[#002868] p-8 text-white relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <div className="relative z-10 flex items-end gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-2">
                                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-[#002868]">
                                            <User size={48} />
                                        </div>
                                    </div>
                                    <div className="pb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-sky-400 text-[#002868] text-[8px] font-black uppercase rounded tracking-widest">Authority Unit</span>
                                            <span className="text-[10px] font-bold text-sky-200/60 uppercase tracking-widest">ID: {selectedAuth._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase">{selectedAuth.name}</h3>
                                        <p className="text-sky-200 font-bold opacity-80">{selectedAuth.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Current Status Card */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={14} className="text-[#002868]" />
                                        Deployment Status
                                    </h4>
                                    <div className={`p-6 rounded-2xl border flex flex-col justify-center gap-4 ${getAssignedZone(selectedAuth._id) === 'UNASSIGNED' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Assignment</p>
                                            <p className={`text-xl font-black ${getAssignedZone(selectedAuth._id) === 'UNASSIGNED' ? 'text-red-600' : 'text-emerald-700'}`}>
                                                {getAssignedZone(selectedAuth._id)}
                                            </p>
                                        </div>
                                        {getAssignedZone(selectedAuth._id) === 'UNASSIGNED' ? (
                                            <div className="flex items-center gap-2 text-red-500 animate-pulse">
                                                <AlertOctagon size={16} />
                                                <span className="text-[10px] font-black uppercase">Unit is currently Off-Duty</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <Shield size={16} />
                                                <span className="text-[10px] font-black uppercase">Sector Stabilization Active</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Assignment Tool */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} className="text-[#002868]" />
                                        Reassign To Sector
                                    </h4>
                                    <div className="space-y-2">
                                        {(zones || []).map(zone => {
                                            const isCurrentlyAssigned = (assignments || []).find(a => a.userId?._id === selectedAuth._id && a.zoneId?._id === zone._id);
                                            return (
                                                <button
                                                    key={zone._id}
                                                    onClick={() => handleAssign(selectedAuth._id, zone._id)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${isCurrentlyAssigned ? 'bg-sky-50 border-sky-200' : 'bg-white border-slate-100 hover:border-sky-200 hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <MapPin size={14} className={isCurrentlyAssigned ? 'text-sky-500' : 'text-slate-300'} />
                                                        <span className={`text-xs font-black uppercase tracking-tight ${isCurrentlyAssigned ? 'text-[#002868]' : 'text-slate-600'}`}>{zone.zoneName}</span>
                                                    </div>
                                                    {isCurrentlyAssigned ? (
                                                        <span className="text-[8px] font-black text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-100 uppercase">Current</span>
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-slate-200 group-hover:border-sky-400 group-hover:bg-sky-400/10 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 scale-0 group-hover:scale-100 transition-transform"></div>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed p-12 text-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Select a Unit</h3>
                            <p className="max-w-xs text-sm font-medium mt-2 leading-relaxed italic">
                                Choose an authority personnel from the sidebar to view their dossier and initiate sector deployment.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Ready</p>
                                    <p className="text-2xl font-black text-slate-400">{(authorities || []).filter(a => getAssignedZone(a._id) === 'UNASSIGNED').length}</p>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Deployed</p>
                                    <p className="text-2xl font-black text-emerald-400">{(authorities || []).filter(a => getAssignedZone(a._id) !== 'UNASSIGNED').length}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tactical Briefing Panel */}
            <div className="bg-[#002868] p-6 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-blue-900/10">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Brain className="w-8 h-8 text-sky-400 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-sky-300 mb-1">AI Tactical Briefing</h4>
                        <p className="text-sm font-bold opacity-80 leading-relaxed uppercase italic">
                            Deploy units to sectors with <span className="text-sky-400">RISE</span> risk levels to ensure manual crowd stabilization.
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="h-10 w-px bg-white/20"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase opacity-60">Fleet Sync Integrity</span>
                        <span className="text-emerald-400 text-xs font-black tracking-widest">99.8% READY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
