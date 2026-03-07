import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, AlertCircle, Users, MapPin, ArrowRight, Radio, Briefcase, AlertTriangle } from 'lucide-react';
import TelemetryFooter from '../components/TelemetryFooter';
import { getMe, getAuthorityZones, getAuthorityAlerts } from '../../services/api';

const AuthorityDashboard = () => {
    const [user, setUser] = useState(null);
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Audio & Toast State
    const [activeToast, setActiveToast] = useState(null);
    const alertingZonesRef = useRef(new Set());
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/buzzer.mp3');
    }, []);

    const fetchAllData = async () => {
        try {
            const [meRes, zonesRes, alertsRes] = await Promise.all([
                getMe(),
                getAuthorityZones(),
                getAuthorityAlerts()
            ]);

            if (meRes.success) setUser(meRes.user);
            const incomingZones = zonesRes.data || [];
            setZones(incomingZones);
            setAlerts(alertsRes.data || []);

            // --- Audio Alert Logic ---
            let playedSound = false;
            let newToastMsg = null;
            const currentAlerts = new Set(alertingZonesRef.current);

            incomingZones.forEach(z => {
                const density = z.capacity > 0 ? (z.currentOccupancy / z.capacity) : 0;
                if (density > 1.0) {
                    if (!currentAlerts.has(z._id)) {
                        playedSound = true;
                        newToastMsg = `🚨 EMERGENCY: HIGH CROWD AT ${z.zoneName.toUpperCase()}`;
                        currentAlerts.add(z._id);
                    }
                } else {
                    currentAlerts.delete(z._id);
                }
            });

            alertingZonesRef.current = currentAlerts;

            if (playedSound) {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
                }
                if (newToastMsg) {
                    setActiveToast(newToastMsg);
                    setTimeout(() => setActiveToast(null), 8000);
                }
            }
        } catch (error) {
            console.error("Error fetching authority telemetry:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 5000);
        return () => clearInterval(interval);
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase text-xs tracking-widest">Establishing Tactical Link...</p>
            </div>
        );
    }

    // Main Dashboard
    const activeAlerts = (alerts || []).filter(a => a && a.status !== 'RESOLVED').length;
    const assignedZoneData = (zones || []).find(z => z && z._id === user?.zoneAssigned?._id);

    const getRiskLevel = (density) => {
        if (density >= 0.9) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' };
        if (density >= 0.75) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
        if (density >= 0.5) return { label: 'MEDIUM', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
        return { label: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100 italic">
                <AlertCircle className="text-red-500 mb-4" size={40} />
                <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter">Authentication Required</h2>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-2">Please login to access tacical telemetry.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification Toast */}
            {activeToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-8 fade-in duration-500 bg-red-600 border-2 border-red-400 text-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-4">
                    <div className="relative">
                        <AlertTriangle className="animate-bounce" size={28} />
                        <span className="absolute inset-0 rounded-full animate-ping border-2 border-white/50"></span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200">Urgent Dispatch</p>
                        <p className="text-lg font-black tracking-tight italic">{activeToast}</p>
                    </div>
                </div>
            )}

            {/* Sector Highlight Header */}
            {assignedZoneData && (
                <div className="bg-[#002868] p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 mb-8 border border-white/10 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-secondary/20 transition-all duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                                <MapPin size={32} className="text-secondary animate-bounce" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-secondary text-white text-[8px] font-black uppercase rounded tracking-widest shadow-lg shadow-secondary/40">Active Jurisdiction</span>
                                    <span className="text-[10px] font-bold text-sky-200/60 uppercase tracking-widest">Station: {user.nodeDetails?.gate || 'Central Node'}</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic">{assignedZoneData.zoneName}</h2>
                                <p className="text-sky-200 font-bold opacity-80 uppercase text-[10px] tracking-widest mt-1 flex items-center gap-2">
                                    <Radio size={12} /> Unit Responsibility: {user.nodeDetails?.responsibility || 'General Security'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                                <p className="text-[8px] font-black text-sky-200/50 uppercase tracking-widest mb-1">Live Density</p>
                                <p className="text-2xl font-black italic">{Math.round((assignedZoneData.currentOccupancy / assignedZoneData.capacity) * 100)}%</p>
                            </div>
                            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                                <p className="text-[8px] font-black text-sky-200/50 uppercase tracking-widest mb-1">Headcount</p>
                                <p className="text-2xl font-black italic">{assignedZoneData.currentOccupancy}</p>
                            </div>
                            <div className="px-6 py-4 bg-emerald-500/10 backdrop-blur-md rounded-2xl border border-emerald-500/30 text-center min-w-[120px]">
                                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Sector Status</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <p className="text-xl font-black text-emerald-400 italic uppercase">Stabilized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sector Capacity - from admin form */}
                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <Users size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector Capacity</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{assignedZoneData?.capacity?.toLocaleString() || '—'}</p>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Max Allowed</span>
                    </div>
                </div>

                {/* Active Crowd - synced with admin */}
                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <Activity size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Crowd</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{assignedZoneData?.currentOccupancy?.toLocaleString() || '0'}</p>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Count</span>
                    </div>
                </div>

                {/* Density Percentage */}
                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg border transition-colors ${assignedZoneData ? (() => { const d = assignedZoneData.currentOccupancy / assignedZoneData.capacity; return d >= 0.9 ? 'bg-red-50 border-red-100 text-red-500' : d >= 0.7 ? 'bg-amber-50 border-amber-100 text-amber-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'; })() : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                            <AlertTriangle size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Density</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">
                            {assignedZoneData ? `${Math.round((assignedZoneData.currentOccupancy / assignedZoneData.capacity) * 100)}%` : '—'}
                        </p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${assignedZoneData ? (() => { const d = assignedZoneData.currentOccupancy / assignedZoneData.capacity; return d >= 0.9 ? 'text-red-500' : d >= 0.7 ? 'text-amber-500' : 'text-emerald-500'; })() : 'text-slate-400'}`}>
                            {assignedZoneData ? (() => { const d = assignedZoneData.currentOccupancy / assignedZoneData.capacity; return d >= 0.9 ? 'Critical' : d >= 0.7 ? 'High' : 'Normal'; })() : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <AlertCircle size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Alerts</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{activeAlerts}</p>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Across Venue</span>
                    </div>
                </div>
            </div>

            {/* General Overview Section */}
            <div className="card-base !p-0 overflow-hidden hover:border-slate-200">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Venue-Wide Deployment View</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(zones || []).map(zone => {
                            const density = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) : 0;
                            const risk = getRiskLevel(density);
                            const isAssignedToMe = zone._id === user?.zoneAssigned?._id;

                            return (
                                <div key={zone._id} className={`p-4 rounded-xl border transition-all ${isAssignedToMe ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/20' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-slate-700 uppercase tracking-tighter text-sm flex items-center gap-2">
                                            {isAssignedToMe && <Briefcase size={12} className="text-secondary" />}
                                            {zone.zoneName}
                                        </h3>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${risk.color} ${risk.border} bg-white`}>{risk.label}</span>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Occupancy</p>
                                            <p className="font-black text-slate-800">{zone.currentOccupancy} / {zone.capacity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Density</p>
                                            <p className={`font-black ${risk.color}`}>{Math.round(density * 100)}%</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <TelemetryFooter />
        </div>
    );
};

export default AuthorityDashboard;
