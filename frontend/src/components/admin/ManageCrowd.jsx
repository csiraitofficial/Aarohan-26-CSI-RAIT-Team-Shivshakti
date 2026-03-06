import React, { useState, useEffect } from 'react';
import { Globe, ShieldCheck, MapPin, Activity, Wifi, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import ManageCrowdForm from './ManageCrowdForm';
import stadiumMap from '../../assets/stadium_map.jpg';

export default function ManageCrowd() {
    const [step, setStep] = useState('FORM'); // FORM, ACTIVE

    // Config captured from form
    const [venueConfig, setVenueConfig] = useState(null);

    // Simulation State
    const [scenario, setScenario] = useState('NORMAL');
    const [attendance, setAttendance] = useState(274727); // Starting at User's requested number
    const [flowRate, setFlowRate] = useState(145);
    const [networkLoad, setNetworkLoad] = useState(88);
    const [regions, setRegions] = useState({
        northStand: { name: 'North Stand / Main Gate', top: '15%', left: '50%', w: '400px', h: '300px', blur: 'blur-[40px]', density: 0.95 },
        westWing: { name: 'West Wing', top: '45%', left: '20%', w: '180px', h: '350px', blur: 'blur-[40px]', density: 0.70 },
        eastWing: { name: 'East Wing / Open Field', top: '45%', left: '80%', w: '250px', h: '300px', blur: 'blur-[30px]', density: 0.40 }
    });

    // Flow control hook
    const handleFormComplete = (data) => {
        setVenueConfig(data);
        const capacity = parseInt(data.expectedCrowd || 356788);
        const startingCurrent = Math.floor(capacity * 0.77);
        // Explicitly start at requested number for the dynamic demo
        // setAttendance(Math.floor(capacity * 0.77)); 

        // Save to LocalStorage history
        const history = JSON.parse(localStorage.getItem('crowdHistory') || '[]');
        const newHistoryItem = {
            id: Date.now(),
            name: data.venueName || 'Unknown Venue',
            type: data.eventType || 'Event',
            capacity: capacity,
            current: startingCurrent,
            location: data.latitude ? `${parseFloat(data.latitude).toFixed(3)}, ${parseFloat(data.longitude).toFixed(3)}` : 'Location N/A',
            isHistory: true // flag to identify this was added dynamically
        };
        localStorage.setItem('crowdHistory', JSON.stringify([newHistoryItem, ...history]));

        setStep('ACTIVE');
    };

    // Simulation Tick for ACTIVE state
    useEffect(() => {
        let timer;
        if (step === 'ACTIVE') {
            const maxCap = venueConfig ? parseInt(venueConfig.expectedCrowd) : 356788;
            timer = setInterval(() => {
                if (scenario === 'NORMAL' && attendance < maxCap) {
                    setAttendance(prev => prev + Math.floor(Math.random() * 12) + 2);
                } else if (scenario === 'EMERGENCY' && attendance > 0) {
                    setAttendance(prev => Math.max(0, prev - Math.floor(Math.random() * 300) + 50));
                }
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [step, scenario, attendance, venueConfig]);

    const handleScenario = (type) => {
        setScenario(type);
        if (type === 'NORMAL') {
            setRegions({
                northStand: { ...regions.northStand, density: 0.95 },
                westWing: { ...regions.westWing, density: 0.70 },
                eastWing: { ...regions.eastWing, density: 0.40 },
            });
            setFlowRate(145);
            setNetworkLoad(88);
        } else if (type === 'HALF_TIME') {
            setRegions({
                northStand: { ...regions.northStand, density: 0.40 },
                westWing: { ...regions.westWing, density: 0.98 },
                eastWing: { ...regions.eastWing, density: 0.60 },
            });
            setFlowRate(18);
            setNetworkLoad(96);
        } else if (type === 'EMERGENCY') {
            setRegions({
                northStand: { ...regions.northStand, density: 0.99 },
                westWing: { ...regions.westWing, density: 0.85 },
                eastWing: { ...regions.eastWing, density: 0.90 },
            });
            setFlowRate(0);
            setNetworkLoad(100);
        }
    };

    const getGradientStyling = (density) => {
        if (density >= 0.90) return 'from-red-600/90 via-red-500/60 to-transparent animate-pulse';
        if (density >= 0.70) return 'from-orange-500/80 via-orange-400/50 to-transparent animate-pulse delay-75';
        if (density >= 0.50) return 'from-yellow-400/80 via-yellow-400/50 to-transparent animate-pulse delay-75';
        return 'from-green-500/70 via-green-400/40 to-transparent';
    };

    // --- VIEW 1: SETUP FORM ---
    if (step === 'FORM') {
        return <ManageCrowdForm onComplete={handleFormComplete} />;
    }

    const currentCapacity = venueConfig ? parseInt(venueConfig.expectedCrowd) : 356788;

    // --- VIEW 3: ACTIVE (Operations Center) ---
    return (
        <div className="space-y-6">
            {/* Operations Header */}
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
                            {venueConfig ? venueConfig.venueName : 'Main Arena'}
                        </span>
                    </div>
                </div>

                {/* Organizer Controls */}
                <div className="bg-white p-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5 shadow-sm">
                    <button
                        onClick={() => handleScenario('NORMAL')}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${scenario === 'NORMAL' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Normal
                    </button>
                    <button
                        onClick={() => handleScenario('HALF_TIME')}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${scenario === 'HALF_TIME' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Peak
                    </button>
                    <button
                        onClick={() => handleScenario('EMERGENCY')}
                        className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${scenario === 'EMERGENCY' ? 'bg-critical text-white shadow-md' : 'text-critical hover:bg-critical/5'}`}
                    >
                        <AlertTriangle size={12} /> Emergency
                    </button>
                </div>
            </div>

            {/* Live Counter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Attendance */}
                <div className="card-base group hover:border-secondary transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={16} /> Total Attendance
                        </h3>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest animate-pulse border border-emerald-100">Real-time</span>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-slate-800 tracking-tight">{attendance.toLocaleString()}</p>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target: {currentCapacity.toLocaleString()}</span>
                            <span className="text-xs font-bold text-secondary">
                                {((attendance / currentCapacity) * 100).toFixed(1)}% Usage
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 shadow-inner ${attendance / currentCapacity > 0.9 ? 'bg-critical' : 'bg-secondary'}`}
                                style={{ width: `${(attendance / currentCapacity) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Flow Rate */}
                <div className="card-base group hover:border-secondary transition-all">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Activity size={16} /> Movement Flow Rate
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2">
                            <p className="text-5xl font-bold text-slate-800 tracking-tighter">{flowRate}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">PPM</p>
                        </div>
                        <div className={`mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg w-max border ${flowRate > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {flowRate > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {flowRate > 0 ? 'Inflow Active' : 'Emergency Egress'}
                        </div>
                    </div>
                </div>

                {/* Mobile Density */}
                <div className="card-base group hover:border-secondary transition-all">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Wifi size={16} /> Device Saturation
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-baseline gap-2">
                            <p className="text-5xl font-bold text-slate-800 tracking-tighter">{networkLoad}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load</p>
                        </div>

                        {scenario !== 'NORMAL' && (
                            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 shadow-sm animate-in slide-in-from-right-2">
                                <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide leading-relaxed">
                                    {scenario === 'HALF_TIME' ? 'Surge detected in transit zones.' : 'Network spectrum fully utilized.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Realistic Integrated Map */}
            <div className="relative w-full bg-[#001432] rounded-xl shadow-lg border border-gray-200 overflow-hidden group">

                {/* High-Res Satellite Image Base */}
                <img
                    src={stadiumMap}
                    alt="Stadium Map"
                    className="w-full h-auto block transition-transform duration-[20000ms] ease-linear group-hover:scale-[1.03]"
                />
                {/* Map Header Overlay */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#002868]" />
                    <span className="font-bold text-[#002868] text-sm tracking-wide">Live Heatmap Overlay</span>
                </div>

                {/* Realistic Heat Map "Clouds" Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none mix-blend-hard-light">
                    {Object.keys(regions).map(key => {
                        const z = regions[key];
                        return (
                            <div
                                key={key}
                                className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] ${getGradientStyling(z.density)} ${z.blur} transition-colors duration-1000`}
                                style={{ top: z.top, left: z.left, width: z.w, height: z.h }}
                            ></div>
                        )
                    })}
                </div>

                {/* Area Labels Layer */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {Object.keys(regions).map(key => {
                        const z = regions[key];
                        return (
                            <div
                                key={key + '-label'}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                style={{ top: z.top, left: z.left }}
                            >
                                <span className="bg-white/90 backdrop-blur-md text-[#002868] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm border border-gray-100">
                                    {z.name}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* AI Status Overlay */}
                <div className="absolute bottom-5 right-5 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-5">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 text-right">AI Analytics Engine</p>
                        <p className="text-sm font-black text-[#002868]">Satellite Array 04</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-end justify-center min-w-[70px]">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span className="text-xs font-black text-green-600 uppercase tracking-widest">SYNCING</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
