import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Shield, AlertTriangle, ArrowRight, CheckCircle, XCircle, Clock, Zap, ChevronRight } from 'lucide-react';
import { getPublicZones, getSafeRoute } from '../../services/api';

const SafeRoutePage = () => {
    const [zones, setZones] = useState([]);
    const [startZone, setStartZone] = useState('');
    const [endZone, setEndZone] = useState('');
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [zonesLoading, setZonesLoading] = useState(true);

    // Fetch zones from admin config
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await getPublicZones();
                if (res && Array.isArray(res)) {
                    setZones(res);
                } else if (res?.data) {
                    setZones(res.data);
                }
            } catch (err) {
                console.error('Error fetching zones:', err);
            } finally {
                setZonesLoading(false);
            }
        };
        fetchZones();
        const interval = setInterval(fetchZones, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleFindRoute = async () => {
        if (!startZone || !endZone) {
            setError('Please select both start and destination zones');
            return;
        }
        if (startZone === endZone) {
            setError('Start and destination must be different zones');
            return;
        }

        setLoading(true);
        setError(null);
        setRoute(null);

        try {
            const res = await getSafeRoute(startZone, endZone);
            if (res.success) {
                setRoute(res);
            } else {
                setError(res.message || 'Could not find a safe route');
            }
        } catch (err) {
            setError('Failed to calculate route. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'CRITICAL': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' };
            case 'HIGH': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' };
            case 'MODERATE': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' };
            default: return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' };
        }
    };

    const getSafetyScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getSafetyScoreRing = (score) => {
        if (score >= 80) return 'border-emerald-500';
        if (score >= 50) return 'border-amber-500';
        return 'border-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Safe Route Navigator</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">AI-powered pathfinding that avoids high-risk zones in real-time</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-emerald-100 shadow-sm px-3 py-1.5 rounded-lg">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Zone Data</span>
                    </div>
                </div>
            </header>

            {/* Route Input Controls */}
            <div className="card-base">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                        <Navigation size={18} className="text-secondary" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Plan Your Route</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
                    {/* Start Zone */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Start Point</label>
                        <select
                            value={startZone}
                            onChange={e => setStartZone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                            disabled={zonesLoading}
                        >
                            <option value="">Select start zone...</option>
                            {zones.map(z => (
                                <option key={z._id} value={z._id}>{z.zoneName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center pb-1">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <ArrowRight size={18} className="text-slate-400" />
                        </div>
                    </div>

                    {/* End Zone */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Destination</label>
                        <select
                            value={endZone}
                            onChange={e => setEndZone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                            disabled={zonesLoading}
                        >
                            <option value="">Select destination...</option>
                            {zones.map(z => (
                                <option key={z._id} value={z._id}>{z.zoneName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleFindRoute}
                        disabled={loading || !startZone || !endZone}
                        className="btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Zap size={16} />
                        )}
                        {loading ? 'Calculating...' : 'Find Safe Route'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600">
                        <XCircle size={16} />
                        {error}
                    </div>
                )}
            </div>


            {/* Route Results */}
            {route && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Safety Score + Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
                        {/* Safety Score Circle */}
                        <div className="card-base flex flex-col items-center justify-center min-w-[200px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Route Safety Score</p>
                            <div className={`w-28 h-28 rounded-full border-[6px] ${getSafetyScoreRing(route.safetyScore)} flex items-center justify-center`}>
                                <span className={`text-4xl font-black ${getSafetyScoreColor(route.safetyScore)}`}>{route.safetyScore}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">out of 100</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${getRiskColor(route.riskLevel).bg} ${getRiskColor(route.riskLevel).text} border ${getRiskColor(route.riskLevel).border}`}>
                                    {route.riskLevel} Risk
                                </span>
                            </div>
                        </div>

                        {/* Route Summary */}
                        <div className="card-base">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Shield size={16} className="text-secondary" />
                                Route Summary
                            </h3>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stops</p>
                                    <p className="text-2xl font-black text-slate-800">{route.totalStops}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Time</p>
                                    <p className="text-2xl font-black text-slate-800">{route.estimatedTime}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avoided</p>
                                    <p className="text-2xl font-black text-red-500">{route.avoidedZones?.length || 0}</p>
                                </div>
                            </div>

                            {/* Path Visualization */}
                            <div className="flex items-center flex-wrap gap-2">
                                {route.path?.map((zone, i) => {
                                    const riskStyle = getRiskColor(zone.riskLevel);
                                    return (
                                        <React.Fragment key={zone._id}>
                                            <div className={`px-3 py-2 rounded-xl border ${riskStyle.border} ${riskStyle.bg} flex items-center gap-2`}>
                                                <MapPin size={12} className={riskStyle.text} />
                                                <span className="text-xs font-bold text-slate-700">{zone.name}</span>
                                                <span className={`text-[9px] font-black ${riskStyle.text}`}>{zone.density}%</span>
                                            </div>
                                            {i < route.path.length - 1 && (
                                                <ChevronRight size={16} className="text-slate-300" />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Turn-by-Turn Instructions */}
                    <div className="card-base !p-0 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Turn-by-Turn Navigation</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Follow these steps for the safest route</p>
                        </div>
                        <div className="p-6 space-y-3">
                            {route.instructions?.filter(i => i.step !== null).map((inst, idx) => {
                                const isStart = inst.action === 'START';
                                const isArrive = inst.action === 'ARRIVE';
                                const iconColor = isStart ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : isArrive ? 'text-blue-500 bg-blue-50 border-blue-200' : 'text-secondary bg-secondary/5 border-secondary/20';
                                const Icon = isStart ? MapPin : isArrive ? CheckCircle : ArrowRight;

                                return (
                                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-secondary/20 hover:shadow-sm transition-all group">
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconColor}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Step {inst.step}</span>
                                                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{inst.action}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{inst.detail}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Avoided Zones */}
                            {route.instructions?.filter(i => i.action === 'AVOIDED').length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        Zones Avoided (Safety Reasons)
                                    </h4>
                                    {route.instructions.filter(i => i.action === 'AVOIDED').map((inst, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-red-50/50 rounded-xl border border-red-200/50 mb-2">
                                            <div className="w-10 h-10 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center shrink-0">
                                                <XCircle size={18} className="text-red-500" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Bypassed</span>
                                                <p className="text-sm font-medium text-red-700 leading-relaxed mt-0.5">{inst.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SafeRoutePage;
