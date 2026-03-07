import React, { useState, useEffect } from 'react';
import { Globe, ShieldCheck, MapPin, Activity, Wifi, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCcw, LayoutGrid, Trash2, X } from 'lucide-react';
import ManageCrowdForm from './ManageCrowdForm';
import StadiumHeatmap from '../StadiumHeatmap';
import { triggerSimulation, getMyVenue, getZones, deleteVenue } from '../../services/api';

export default function ManageCrowd() {
    const [step, setStep] = useState('LOADING'); // LOADING, FORM, ACTIVE
    const [venue, setVenue] = useState(null);
    const [zones, setZones] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Simulation State
    const [scenario, setScenario] = useState('NORMAL');
    const [isSimulating, setIsSimulating] = useState(false);

    // Live Stats
    const [stats, setStats] = useState({
        totalAttendance: 0,
        flowRate: 145,
        networkLoad: 88
    });

    useEffect(() => {
        const checkVenue = async () => {
            try {
                const response = await getMyVenue();
                if (response.success && response.exists) {
                    setVenue(response.venue);
                    setZones(response.zones);
                    if (response.venue.simulationMode) {
                        setScenario(response.venue.simulationMode);
                    }
                    setStep('ACTIVE');
                } else {
                    setStep('FORM');
                }
            } catch (error) {
                console.error("Failed to check venue:", error);
                setStep('FORM');
            }
        };
        checkVenue();
    }, []);

    // Periodic Data Fetch for Stats
    useEffect(() => {
        let interval;
        if (step === 'ACTIVE') {
            const fetchData = async () => {
                try {
                    const zonesRes = await getZones();
                    if (Array.isArray(zonesRes)) {
                        const myZones = zonesRes.filter(z => z.venueId === venue?._id);
                        if (myZones.length > 0) {
                            setZones(myZones);
                            const total = myZones.reduce((acc, z) => acc + (z.currentOccupancy || 0), 0);
                            setStats(prev => ({ ...prev, totalAttendance: total }));
                        }
                    }
                } catch (err) {
                    console.error("Stats Fetch Error:", err);
                }
            };
            fetchData();
            interval = setInterval(fetchData, 3000);
        }
        return () => clearInterval(interval);
    }, [step, venue]);

    const handleFormComplete = (venueData) => {
        setVenue(venueData);
        window.location.reload(); // Refresh to ensure backend sync
    };

    const handleScenario = async (type) => {
        setScenario(type);
        setIsSimulating(true);
        try {
            await triggerSimulation(type);
            // Simulation is handled by backend, we just poll for results
            if (type === 'EMERGENCY') {
                setStats(prev => ({ ...prev, flowRate: 0, networkLoad: 100 }));
            } else if (type === 'SURGE') {
                setStats(prev => ({ ...prev, flowRate: 25, networkLoad: 95 }));
            } else {
                setStats(prev => ({ ...prev, flowRate: 145, networkLoad: 85 }));
            }
        } catch (err) {
            console.error("Simulation Trigger Error:", err);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleDeleteVenue = async () => {
        setIsSimulating(true); // Show loading spinner on confirm button
        try {
            const response = await deleteVenue();
            if (response.success) {
                setStep('FORM');
                setVenue(null);
                setZones([]);
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error("Delete Venue Error:", error);
            alert("Failed to delete venue.");
        } finally {
            setIsSimulating(false);
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'CRITICAL': return 'bg-red-600';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-yellow-400';
            default: return 'bg-emerald-500';
        }
    };

    const getGradientStyling = (risk) => {
        switch (risk) {
            case 'CRITICAL': return 'from-red-600/90 via-red-500/60 to-transparent animate-pulse';
            case 'HIGH': return 'from-orange-500/80 via-orange-400/50 to-transparent animate-pulse';
            case 'MEDIUM': return 'from-yellow-400/80 via-yellow-400/50 to-transparent';
            default: return 'from-green-500/70 via-green-400/40 to-transparent';
        }
    };

    if (step === 'LOADING') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#002868] rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse">Initializing Ops Center...</p>
            </div>
        );
    }

    if (step === 'FORM') {
        return <ManageCrowdForm onComplete={handleFormComplete} />;
    }

    const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
    const usagePercent = totalCapacity > 0 ? ((stats.totalAttendance / totalCapacity) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Operations Command Center</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Telemetry
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={12} />
                            {venue ? venue.name : 'Unknown Venue'}
                        </span>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-red-100"
                            title="Reset Venue Setup"
                        >
                            <Trash2 size={12} />
                            Reset Venue
                        </button>
                    </div>
                </div>

                <div className="bg-white p-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5 shadow-sm">
                    <button
                        onClick={() => handleScenario('NORMAL')}
                        disabled={isSimulating}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${scenario === 'NORMAL' ? 'bg-[#002868] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Normal
                    </button>
                    <button
                        onClick={() => handleScenario('SURGE')}
                        disabled={isSimulating}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${scenario === 'SURGE' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Surge
                    </button>
                    <button
                        onClick={() => handleScenario('EMERGENCY')}
                        disabled={isSimulating}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${scenario === 'EMERGENCY' ? 'bg-red-600 text-white shadow-md' : 'text-red-600 hover:bg-red-50'}`}
                    >
                        <AlertTriangle size={12} /> Emergency
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={16} /> Attendance
                        </h3>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                    </div>
                    <p className="text-4xl font-bold text-slate-800 tracking-tight">{stats.totalAttendance.toLocaleString()}</p>
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-600' : usagePercent > 75 ? 'bg-orange-500' : 'bg-[#002868]'}`}
                            style={{ width: `${usagePercent}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">{usagePercent}% of {totalCapacity.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Activity size={16} /> Entry Rate
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-bold text-slate-800 tracking-tighter">{stats.flowRate}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PPM</p>
                    </div>
                    <div className={`mt-4 inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${stats.flowRate > 30 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {stats.flowRate > 30 ? <RefreshCcw size={10} className="animate-spin" /> : <ShieldCheck size={10} />}
                        {stats.flowRate > 30 ? 'Heavy Inflow' : 'Optimal Flow'}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Wifi size={16} /> Device Saturation
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-bold text-slate-800 tracking-tighter">{stats.networkLoad}%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load</p>
                    </div>
                    <div className="mt-4 flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (stats.networkLoad / 20) ? (stats.networkLoad > 90 ? 'bg-red-500' : 'bg-[#002868]') : 'bg-slate-100'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map and Zones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative bg-slate-900 rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px]">
                    <StadiumHeatmap scenario={scenario} />

                    {/* Zones Overlay */}
                    <div className="absolute inset-0">
                        {zones.map((zone, idx) => {
                            // Pseudo-random placement based on index for demo
                            const top = 20 + (idx * 25) % 60;
                            const left = 20 + (idx * 30) % 60;
                            const risk = zone.riskLevel || 'LOW';

                            return (
                                <div key={zone._id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${top}%`, left: `${left}%` }}>
                                    <div className={`w-32 h-32 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] ${getGradientStyling(risk)} blur-2xl opacity-80`}></div>
                                    <div className="relative z-10 flex flex-col items-center mt-[-16px]">
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest ${getRiskColor(risk)} shadow-lg`}>
                                            {zone.zoneName}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#002868] shadow-lg border border-white/20">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            LIVE NETWORK MESH
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid size={16} className="text-[#002868]" />
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sector Status</h3>
                        </div>
                        <div className="space-y-3">
                            {zones.map(zone => {
                                const density = Math.round((zone.currentOccupancy / zone.capacity) * 100);
                                return (
                                    <div key={zone._id} className="p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{zone.zoneName}</span>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded text-white ${getRiskColor(zone.riskLevel)}`}>
                                                {zone.riskLevel}
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getRiskColor(zone.riskLevel)}`}
                                                style={{ width: `${density}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>{zone.currentOccupancy} / {zone.capacity}</span>
                                            <span>{density}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* --- CUSTOM DELETE MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle size={14} className="text-red-500" />
                                Confirm Data Reset
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <Trash2 size={32} className="text-red-500" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Are you absolutely sure?</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    This will permanently delete the current venue configuration, all {zones.length} zones, and local history. You will need to start the setup process from scratch.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteVenue}
                                    disabled={isSimulating}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-200 uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2"
                                >
                                    {isSimulating ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Trash2 size={12} />
                                    )}
                                    Confirm Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
