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
        <div className="space-y-6 text-gray-800 animate-in fade-in duration-700 font-sans">

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-md border-l-4 border-[#002868]">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868] flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#00AEEF]" />
                        Stadium Operations Center
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Tracking Active
                        </span>
                        <span className="text-sm font-bold text-gray-600">{venueConfig ? venueConfig.venueName : 'DY Patil Stadium'}</span>
                    </div>
                </div>

                {/* Organizer Controls */}
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Scenarios</span>
                    <button
                        onClick={() => handleScenario('NORMAL')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${scenario === 'NORMAL' ? 'bg-[#002868] text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                        Normal Entry
                    </button>
                    <button
                        onClick={() => handleScenario('HALF_TIME')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${scenario === 'HALF_TIME' ? 'bg-[#FF6B35] text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                        Half-Time Peak
                    </button>
                    <button
                        onClick={() => handleScenario('EMERGENCY')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1 ${scenario === 'EMERGENCY' ? 'bg-red-600 text-white shadow' : 'text-red-600 hover:bg-red-50'}`}
                    >
                        <AlertTriangle className="w-3 h-3" /> Panic/Emergency
                    </button>
                </div>
            </div>

            {/* Live Counter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Attendance */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#002868]" /> Live Attendance
                        </h3>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider border border-green-100 animate-pulse">Live Feed</span>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-[#002868] tracking-tight">{attendance.toLocaleString()}</p>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-sm text-gray-400 font-medium">Capacity: {currentCapacity.toLocaleString()}</span>
                            <span className="text-sm font-black text-[#FF6B35]">
                                {((attendance / currentCapacity) * 100).toFixed(1)}% Full
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${attendance / currentCapacity > 0.9 ? 'bg-red-500' : 'bg-[#002868]'}`}
                                style={{ width: `${(attendance / currentCapacity) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Flow Rate */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#00AEEF]" /> Entry Flow Rate
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <p className="text-5xl font-black text-gray-800 tracking-tighter">{flowRate}</p>
                            <p className="text-sm font-bold text-gray-400 leading-tight uppercase">People <br /> Per Min</p>
                        </div>
                        <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg w-max ${flowRate > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {flowRate > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {flowRate > 0 ? 'Steady Entry Flow' : 'Exiting Phase Active'}
                        </div>
                    </div>
                </div>

                {/* Mobile Density */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2 mb-4">
                        <Wifi className="w-5 h-5 text-[#FF6B35]" /> Network Saturation
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-5xl font-black text-gray-800 tracking-tighter">{networkLoad}%</p>
                        <p className="text-sm font-bold text-[#FF6B35] mt-1 uppercase tracking-wide">Mobile device density monitor</p>

                        {scenario !== 'NORMAL' && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2 shadow-sm animate-in slide-in-from-right-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-red-800 leading-snug">
                                    {scenario === 'HALF_TIME' ? 'Critical load shifting to Concourses.' : 'Emergency bandwidth overrides active.'}
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
