import React, { useState, useEffect } from 'react';
import { Activity, Shield, AlertCircle, Users, MapPin, ArrowRight, Info, CheckCircle, Radio, Briefcase, Plus, Send } from 'lucide-react';
import TelemetryFooter from '../components/TelemetryFooter';
import { getMe, setupNode, getAuthorityZones, getAuthorityAlerts, getNavigationZones } from '../../services/api';

const AuthorityDashboard = () => {
    const [user, setUser] = useState(null);
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [navZones, setNavZones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [gate, setGate] = useState('');
    const [equipment, setEquipment] = useState([]);
    const [responsibility, setResponsibility] = useState('');

    const fetchAllData = async () => {
        try {
            const [userRes, zonesRes, alertsRes, navRes] = await Promise.all([
                getMe(),
                getAuthorityZones(),
                getAuthorityAlerts(),
                getNavigationZones()
            ]);

            if (userRes.success) setUser(userRes.user);
            if (zonesRes.success) setZones(zonesRes.zones);
            if (alertsRes.success) setAlerts(alertsRes.alerts);
            if (navRes.success) setNavZones(navRes.zones);
        } catch (error) {
            console.error("Error fetching authority data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await setupNode({
                gate,
                equipment,
                responsibility
            });
            if (res.success) {
                setUser(res.user);
            }
        } catch (error) {
            console.error("Setup Error:", error);
        }
    };

    const toggleEquipment = (item) => {
        setEquipment(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase text-xs tracking-widest">Establishing Tactical Link...</p>
            </div>
        );
    }

    // 1. Initial Node Setup Form
    if (user && !user.isNodeSetup) {
        return (
            <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-secondary/20 shadow-xl shadow-secondary/10">
                        <Shield size={40} className="text-secondary animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic underline decoration-sky-400 decoration-[4px] underline-offset-8">Authority Node Setup</h1>
                    <p className="mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Initialize your command post credentials for sector stabilization.</p>
                </div>

                <div className="card-base p-8 border-t-4 border-t-secondary">
                    <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <MapPin className="text-secondary" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Jurisdiction</p>
                            <p className="text-lg font-black text-slate-800 uppercase italic">
                                {user.zoneAssigned ? user.zoneAssigned.zoneName : 'Awaiting Sector Assignment'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSetupSubmit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Primary Post / Gate</label>
                            <input
                                type="text"
                                required
                                value={gate}
                                onChange={(e) => setGate(e.target.value)}
                                placeholder="e.g., Gate 4, Main Entrance North"
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-secondary/50 outline-none placeholder:text-slate-300 italic"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Equipment Inventory</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Radio Link', 'Med Kit', 'Crowd Barrier', 'Bio-Scanner', 'Body Cam', 'Emergency Flare'].map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => toggleEquipment(item)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-tight ${equipment.includes(item) ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <Plus size={14} className={equipment.includes(item) ? 'rotate-45' : ''} />
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Operational Responsibility</label>
                            <select
                                required
                                value={responsibility}
                                onChange={(e) => setResponsibility(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-secondary/50 outline-none italic"
                            >
                                <option value="" disabled>Select Core Directive...</option>
                                <option value="Crowd Management">Crowd Management & Flow</option>
                                <option value="Access Control">Access Control & Search</option>
                                <option value="Emergency Response">Emergency Response Lead</option>
                                <option value="Perimeter Security">Perimeter & Gate Security</option>
                                <option value="VIP Escort">VIP Escort & Zone Clearance</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] italic">
                            <Send size={20} />
                            Deploy Unit
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 2. Main Dashboard (if setup complete)
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

            {!assignedZoneData && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center mb-8">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
                    <h2 className="text-xl font-black text-red-600 uppercase italic tracking-tight">Deployment Pending</h2>
                    <p className="text-sm font-bold text-red-400 uppercase tracking-widest mt-2 italic">Awaiting manual sector assignment from Admin Command Center.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <div className="card-base group hover:border-secondary transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                            <Shield size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Unit Prep</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{(user?.nodeDetails?.equipment || []).length}</p>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Items Logged</span>
                    </div>
                </div>

                <div className="card-base !bg-primary border-primary flex flex-col justify-between text-white lg:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/10 border border-white/20 rounded-lg text-white">
                            <Activity size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Unit Status</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold tracking-tight uppercase italic">{user?.isNodeSetup ? 'Active Duty' : 'Setup Required'}</p>
                            <p className="text-[10px] font-bold text-sky-300 uppercase tracking-[0.2em] mt-1">Operational ID: {user?._id?.slice(-8).toUpperCase() || 'UNKNOWN'}</p>
                        </div>
                        <CheckCircle size={40} className="text-emerald-400" />
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

            {/* Right Column: Alerts & Tasks */}
            <div className="space-y-6">
                {/* Crowd Diversion Alerts (AI Powered) */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap size={18} className="text-orange-500" />
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Crowd Diversion</h3>
                    </div>

                    <div className="space-y-4">
                        {navZones.filter(z => (z.currentOccupancy / z.capacity) > 0.7).length > 0 ? (
                            navZones.filter(z => (z.currentOccupancy / z.capacity) > 0.7).map((z, idx) => (
                                <div key={idx} className="p-4 bg-orange-50 rounded-2xl border border-orange-100 border-dashed animate-pulse">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Congestion Alert: {z.name}</p>
                                            <p className="text-[9px] font-bold text-orange-600/70 uppercase tracking-wider mt-1 leading-relaxed">
                                                Density at {Math.round((z.currentOccupancy / z.capacity) * 100)}%. Suggest diverting traffic to adjacent low-density sectors.
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="text-[8px] font-black bg-white px-2 py-1 rounded-lg text-orange-600 border border-orange-100 uppercase">Suggested Reroute</span>
                                                <ArrowRight size={10} className="text-orange-400" />
                                                <span className="text-[8px] font-black text-slate-400 uppercase">Sector B → Gate 4</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                <CheckCircle size={24} className="text-emerald-400 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Critical Congestions</p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Flow dynamics stable across all zones</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <AlertOctagon size={18} className="text-red-500" />
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Emergency Broadcasts</h3>
                        </div>
                        <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-100">Live</span>
                    </div>

                    <div className="space-y-4">
                        {alerts.length > 0 ? alerts.map((alert) => (
                            <div key={alert._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded text-white ${alert.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-800 leading-relaxed uppercase tracking-wider">{alert.message}</p>
                            </div>
                        )) : (
                            <p className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Environment</p>
                        )}
                    </div>
                </div>
            </div>

            <TelemetryFooter />
        </div>
    );
};

export default AuthorityDashboard;
