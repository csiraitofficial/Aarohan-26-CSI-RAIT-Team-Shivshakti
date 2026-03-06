import React, { useState, useEffect } from 'react';
import { Activity, Shield, AlertCircle, Users, MapPin, ArrowRight, Info } from 'lucide-react';
import TelemetryFooter from '../components/TelemetryFooter';

const AuthorityDashboard = () => {
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Fetch live data from backend
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const [zonesRes, alertsRes] = await Promise.all([
                fetch('http://localhost:5000/api/authority/zones', { headers }),
                fetch('http://localhost:5000/api/authority/alerts', { headers })
            ]);

            if (zonesRes.ok) {
                const zonesData = await zonesRes.json();
                setZones(zonesData.data || []);
            }
            if (alertsRes.ok) {
                const alertsData = await alertsRes.json();
                setAlerts(alertsData.data || []);
            }
        } catch (error) {
            console.error("Error fetching dashboard telemetry:", error);
        }
    };

    // Initial load & Polling
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Derived Metrics
    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.90).length;
    const totalCrowd = zones.reduce((sum, z) => sum + (z.currentOccupancy || 0), 0);

    const getRiskLevel = (density) => {
        if (density >= 0.9) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' };
        if (density >= 0.75) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500' };
        if (density >= 0.5) return { label: 'MEDIUM', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' };
        return { label: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
    };

    return (
        <div className="space-y-6">
            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <AlertCircle size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Alerts</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{activeAlerts}</p>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">+2 from last hr</span>
                    </div>
                </div>

                <div className="card-base group hover:border-orange-200 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg text-orange-500 group-hover:border-orange-200 transition-colors">
                            <Shield size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Risk Zones</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{highRiskZones}</p>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{criticalZones} Critical</span>
                    </div>
                </div>

                <div className="card-base !bg-primary border-primary flex flex-col justify-between text-white group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/10 border border-white/20 rounded-lg text-white">
                            <Activity size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Total Crowd</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold tracking-tight">{totalCrowd.toLocaleString()}</p>
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">Live Telemetry</span>
                    </div>
                </div>

                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <Users size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deployment</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">42</p>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Officers Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Zone Status Overview */}
                <div className="lg:col-span-3 card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Zone Status Overview</h2>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Real-time occupancy and risk metrics</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Feed</span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {zones.map(zone => {
                                const density = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) : 0;
                                const risk = getRiskLevel(density);
                                const netFlow = (zone.entryCount || 0) - (zone.exitCount || 0);
                                return (
                                    <div key={zone._id} className={`group p-5 rounded-xl border transition-all hover:shadow-md ${risk.bg} ${risk.border}`}>
                                        <div className="flex justify-between items-start mb-5">
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-primary transition-colors">{zone.zoneName}</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector {zone._id?.substring(0, 4)}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-widest shadow-sm bg-white ${risk.border} ${risk.color}`}>
                                                {risk.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-5">
                                            <div className="bg-white/50 p-3 rounded-lg border border-white/50 shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-1">Occupancy</p>
                                                <p className="font-bold text-slate-800 text-lg">{zone.currentOccupancy} <span className="text-xs text-slate-400 font-medium">/ {zone.capacity}</span></p>
                                            </div>
                                            <div className="bg-white/50 p-3 rounded-lg border border-white/50 shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-1">Density</p>
                                                <p className={`font-bold text-lg ${risk.color}`}>{Math.round(density * 100)}%</p>
                                            </div>
                                        </div>

                                        <div className="relative pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Live Flow</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-emerald-500">+{zone.entryCount || 0}</span>
                                                        <span className="text-[9px] text-slate-400 font-medium">In</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold text-slate-500">-{zone.exitCount || 0}</span>
                                                        <span className="text-[9px] text-slate-400 font-medium">Out</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`px-2 py-1.5 rounded-lg ${netFlow >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'} flex items-center gap-1.5 shadow-sm`}>
                                                <Activity size={10} />
                                                <span className="text-[10px] font-bold tracking-widest">{netFlow > 0 ? `+${netFlow}` : netFlow}</span>
                                            </div>

                                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg border border-transparent group-hover:border-slate-200 group-hover:shadow-sm transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-secondary">
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {zones.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                    <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Synchronizing Data streams</h4>
                                <p className="text-[10px] font-medium text-slate-400 max-w-xs text-center mt-2 px-6 uppercase tracking-wider">Connecting to edge sensors and spatial analytics engine. Please standby...</p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200 shadow-sm"></div>)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Systems Linked</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Info size={14} className="text-secondary" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Auto-updating every 5s • AES-256 Encrypted</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Logs</button>
                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                            <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Export</button>
                        </div>
                    </div>
                </div>
            </div>

            <TelemetryFooter />
        </div>
    );
};

export default AuthorityDashboard;

