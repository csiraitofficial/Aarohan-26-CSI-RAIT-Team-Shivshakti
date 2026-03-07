import React, { useState, useEffect, useRef } from 'react';
import { Users, Shield, AlertTriangle, Activity, Database, Bell, MapPin, Clock, ArrowUp, ArrowDown, Zap, AlertCircle } from 'lucide-react';
import { getMyVenue, getAssignments, getZones, getIncidents, getAlerts } from '../../services/api';

export default function CommandCenter() {
    const [venue, setVenue] = useState(null);
    const [zones, setZones] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [_alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Audio & Toast State
    const [activeToast, setActiveToast] = useState(null);
    const alertingZonesRef = useRef(new Set());
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/buzzer.mp3');
    }, []);

    const fetchData = async () => {
        try {
            const [venueRes, assignmentsRes, zonesRes] = await Promise.all([
                getMyVenue(),
                getAssignments(),
                getZones()
            ]);

            if (venueRes.success) {
                setVenue(venueRes.venue);

                // Use the live zones array instead of the static venue setup array
                const incomingZones = Array.isArray(zonesRes) ? zonesRes.filter(z => z.venueId === venueRes.venue._id) : (venueRes.zones || []);
                setZones(incomingZones);

                // --- Audio Alert Logic ---
                let playedSound = false;
                let newToastMsg = null;
                const currentAlerts = new Set(alertingZonesRef.current);

                incomingZones.forEach(z => {
                    const density = z.capacity > 0 ? (z.currentOccupancy / z.capacity) : 0;
                    if (density > 1.0) {
                        if (!currentAlerts.has(z._id)) {
                            playedSound = true;
                            newToastMsg = `🚨 CRITICAL OVERCROWDING IN ${z.zoneName.toUpperCase()}`;
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
                        setTimeout(() => setActiveToast(null), 8000); // hide after 8s
                    }
                }
            }
            if (assignmentsRes.success) {
                setAssignments(assignmentsRes.data || []);
            }

            // Fetch Real-time Alerts & Incidents
            const [alertsRes, incidentsRes] = await Promise.all([
                getAlerts(),
                getIncidents()
            ]);

            if (alertsRes.success) setAlerts(alertsRes.data || []);
            if (incidentsRes.success) setIncidents(incidentsRes.data || []);
        } catch (err) {
            console.error("Command Center Fetch Error:", err);
            setError("Failed to synchronize with Command Engine.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Derived Metrics
    const totalVisitors = zones.reduce((sum, z) => sum + (z.currentOccupancy || 0), 0);
    const totalCapacity = zones.reduce((sum, z) => sum + (z.capacity || 0), 0);
    const zonesMonitored = new Set((assignments || []).map(a => a?.zoneId?._id || a?.zoneId)).size;

    // Crowd State Logic
    const occupancyRate = totalCapacity > 0 ? (totalVisitors / totalCapacity) : 0;

    let crowdState = {
        label: 'NORMAL',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        hover: 'hover:border-emerald-300',
        icon: Users,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50'
    };

    if (occupancyRate > 1.1) {
        crowdState = {
            label: 'EMERGENCY',
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            hover: 'hover:border-red-400',
            icon: Zap,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100'
        };
    } else if (occupancyRate > 1.0) {
        crowdState = {
            label: 'SURGE',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            hover: 'hover:border-orange-400',
            icon: AlertTriangle,
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100'
        };
    }

    if (error && !venue) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100 italic">
                <AlertCircle className="text-red-500 mb-4" size={40} />
                <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter">Command Sync Failed</h2>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-2 px-6 text-center">{error}</p>
                <button onClick={fetchData} className="mt-6 px-6 py-2 bg-white border border-red-200 text-red-600 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 transition-all">Retry Link</button>
            </div>
        );
    }

    if (loading && !venue) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-secondary rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Tactical Grid...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Notification Toast */}
            {activeToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-8 fade-in duration-500 bg-red-600 border-2 border-red-400 text-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-4">
                    <div className="relative">
                        <AlertTriangle className="animate-bounce" size={28} />
                        <span className="absolute inset-0 rounded-full animate-ping border-2 border-white/50"></span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200">System Alert</p>
                        <p className="text-lg font-black tracking-tight italic">{activeToast}</p>
                    </div>
                </div>
            )}

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Visitors Card - DYNAMIC STATE */}
                <div className={`card-base group ${crowdState.bg} ${crowdState.border} ${crowdState.hover} transition-all duration-500`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Visitors</p>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest bg-white ${crowdState.color} ${crowdState.border.replace('bg-', 'border-')}`}>
                                {crowdState.label}
                            </span>
                        </div>
                        <div className={`p-2 ${crowdState.iconBg} rounded-lg ${crowdState.iconColor} transition-colors shadow-sm`}>
                            <crowdState.icon size={20} />
                        </div>
                    </div>
                    <p className={`text-4xl font-black ${crowdState.color.replace('text-', 'text-slate-800')} tracking-tight italic`}>
                        {totalVisitors.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden border border-slate-100/50">
                            <div
                                className={`h-full ${crowdState.color === 'text-emerald-500' ? 'bg-emerald-500' : (crowdState.color === 'text-orange-600' ? 'bg-orange-500' : 'bg-red-500')} transition-all duration-1000`}
                                style={{ width: `${Math.min(occupancyRate * 100, 100)}%` }}
                            ></div>
                        </div>
                        <span className={`text-[10px] font-black ${crowdState.color} italic`}>{Math.round(occupancyRate * 100)}%</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight italic">
                        Limit: {totalCapacity.toLocaleString()} Personnel
                    </p>
                </div>

                <div className="card-base group hover:border-secondary transition-all bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Zones Monitored</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-secondary group-hover:bg-secondary/10 transition-colors">
                            <Shield size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight italic">{zonesMonitored}</p>
                    <p className="text-[10px] font-black text-emerald-500 mt-2 flex items-center gap-2 uppercase tracking-widest italic">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                        {zonesMonitored === (zones || []).length ? 'Full Coverage' : 'Partial Patrol'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight italic">
                        {(zones || []).length} Sectors Detected
                    </p>
                </div>

                <div className="card-base group hover:border-critical transition-all bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Incidents Today</p>
                        <div className="p-2 bg-critical/5 rounded-lg text-critical">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight italic">{incidents.length}</p>
                    <p className={`text-[10px] font-black ${incidents.filter(i => i.status !== 'Resolved').length > 0 ? 'text-critical' : 'text-emerald-500'} mt-2 uppercase tracking-widest italic`}>
                        {incidents.filter(i => i.status !== 'Resolved').length > 0 ? `${incidents.filter(i => i.status !== 'Resolved').length} Active Incidents` : 'All Cleared'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight italic">
                        {venue?.name} Node
                    </p>
                </div>

                <div className={`card-base group transition-all bg-white border ${crowdState.border} ${crowdState.hover}`}>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Command Mode</p>
                        <div className={`p-2 rounded-lg ${crowdState.iconBg} transition-colors`}>
                            <Activity size={20} className={crowdState.iconColor} />
                        </div>
                    </div>
                    <p className={`text-3xl font-black ${crowdState.color} tracking-tight italic uppercase`}>
                        {crowdState.label}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">
                        {crowdState.label === 'EMERGENCY' ? 'Critical — Immediate Action' : crowdState.label === 'SURGE' ? 'Elevated — Monitor Closely' : 'Tactical Awareness High'}
                    </p>
                    <p className="text-[9px] font-black text-primary mt-1 uppercase tracking-tight italic shadow-sm inline-block">
                        AI Core Online
                    </p>
                </div>
            </div>

            {/* Simulated Chart Placeholder for Visual Polish */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card-base lg:col-span-2 bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Sector Density Distribution</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider italic">Real-time load balancing across {zones.length} segments</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase italic">Live Load</span>
                        </div>
                    </div>

                    <div className="h-48 flex items-end gap-2 px-2 overflow-x-auto custom-scrollbar">
                        {zones.length > 0 ? zones.map((z, i) => (
                            <div key={i} className="flex-1 min-w-[50px] flex flex-col items-center gap-1 group">
                                <span className={`text-[9px] font-black ${z.currentOccupancy / z.capacity > 0.9 ? 'text-red-500' : (z.currentOccupancy / z.capacity > 0.7 ? 'text-orange-500' : 'text-slate-600')} transition-colors`}>
                                    {z.currentOccupancy.toLocaleString()}
                                </span>
                                <div className="w-full bg-slate-50 rounded-t-xl border border-slate-100 flex items-end overflow-hidden group-hover:border-secondary/30 transition-all" style={{ height: '140px' }}>
                                    <div
                                        className={`w-full transition-all duration-1000 ${z.currentOccupancy / z.capacity > 0.9 ? 'bg-red-400' : (z.currentOccupancy / z.capacity > 0.7 ? 'bg-orange-400' : 'bg-secondary')}`}
                                        style={{ height: `${Math.min((z.currentOccupancy / z.capacity) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate w-full text-center">{z.zoneName}</span>
                            </div>
                        )) : (
                            <div className="w-full flex items-center justify-center h-full text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                Initialize Venue Data
                            </div>
                        )}
                    </div>
                </div>

                {/* Authority Linkage Status */}
                <div className="card-base bg-white border-t-4 border-t-primary">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic mb-6">Field Unit Status</h3>
                    <div className="space-y-4">
                        {assignments.length > 0 ? assignments.map((a, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-secondary transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-secondary group-hover:border-secondary/20 uppercase transition-all">
                                        {a.userId?.name?.slice(0, 2) || 'AU'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-700 uppercase italic truncate max-w-[100px]">{a.userId?.name || 'Officer'}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{a.zoneId?.zoneName || 'Patrol'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                    <span className="text-[8px] font-black text-emerald-500 uppercase italic">Linked</span>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <Users size={24} className="text-slate-200 mx-auto mb-2" />
                                <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">No Field Assignments</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
