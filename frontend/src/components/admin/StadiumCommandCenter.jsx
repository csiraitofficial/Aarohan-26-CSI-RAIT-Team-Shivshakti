import React, { useState, useEffect } from 'react';
import { MapPin, Users, Activity, ShieldAlert, ArrowUpRight, Radio, RefreshCcw } from 'lucide-react';

export default function StadiumCommandCenter() {
    // Scenario State
    const [scenario, setScenario] = useState('NORMAL');

    // Dynamic metrics state
    const [attendance, setAttendance] = useState(42560);
    const [entryRate, setEntryRate] = useState(120);
    const [networkLoad, setNetworkLoad] = useState(88);

    // Heat map regions state (0-100% density)
    const [regions, setRegions] = useState({
        north: 45,
        south: 60,
        gate1: 85,
        foodCourt: 30
    });

    // Simulation Tick (Every 2s Attendance ticks up in NORMAL mode)
    useEffect(() => {
        const timer = setInterval(() => {
            if (scenario === 'NORMAL' && attendance < 55000) {
                // Randomly add 2 to 8 people every 2 seconds simulating standard entry
                setAttendance(prev => prev + Math.floor(Math.random() * 7) + 2);
            } else if (scenario === 'EMERGENCY' && attendance > 0) {
                // Rapidly drop attendance pretending a fast exit
                setAttendance(prev => Math.max(0, prev - Math.floor(Math.random() * 150) + 50));
            }
        }, 2000);
        return () => clearInterval(timer);
    }, [scenario, attendance]);

    // Handle Scenario Triggers
    const handleTriggerHalfTime = () => {
        setScenario('HALF_TIME');
        setRegions({
            north: 25,
            south: 30,
            gate1: 15,
            foodCourt: 98 // Critical density in food court
        });
        setEntryRate(12);
        setNetworkLoad(95);
    };

    const handleTriggerEmergency = () => {
        setScenario('EMERGENCY');
        setRegions({
            north: 95,
            south: 90,
            gate1: 100, // Jam at the gate
            foodCourt: 85
        });
        setEntryRate(0);
        setNetworkLoad(100);
    };

    const resetSimulation = () => {
        setScenario('NORMAL');
        setRegions({ north: 45, south: 60, gate1: 85, foodCourt: 30 });
        setAttendance(42560);
        setEntryRate(120);
        setNetworkLoad(88);
    };

    // Helper for pulsing color logic
    const getPulseColor = (density) => {
        if (density >= 90) return 'fill-red-500/60 stroke-red-600 animate-pulse';
        if (density >= 70) return 'fill-orange-500/60 stroke-orange-600 animate-pulse';
        return 'fill-green-500/40 stroke-green-500';
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border-l-4 border-[#002868]">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868]">Live Operations: DY Patil Stadium</h2>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Real-Time Tracking Active
                    </p>
                </div>

                {/* Situation Control Action Panel */}
                <div className="flex gap-3">
                    <button
                        onClick={resetSimulation}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                        title="Reset Simulation"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleTriggerHalfTime}
                        className={`px-4 py-2 font-bold text-sm rounded-lg border transition-colors ${scenario === 'HALF_TIME' ? 'bg-[#FF6B35] text-white border-transparent shadow-md' : 'btn-outline text-[#FF6B35] border-[#FF6B35] hover:bg-orange-50'}`}
                    >
                        Trigger: Half-Time Rush
                    </button>
                    <button
                        onClick={handleTriggerEmergency}
                        className={`px-4 py-2 font-bold text-sm rounded-lg flex items-center gap-2 transition-colors ${scenario === 'EMERGENCY' ? 'bg-red-600 text-white shadow-md' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}
                    >
                        <ShieldAlert className="w-4 h-4" /> Trigger: Emergency
                    </button>
                </div>
            </div>

            {/* Top Cards: Real-Time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Users className="w-4 h-4 text-[#00AEEF]" /> Live Attendance
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-[#002868]">{attendance.toLocaleString()}</span>
                        <span className="text-sm font-medium text-gray-400 mb-1">/ 55,000</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${attendance > 50000 ? 'bg-red-500' : 'bg-[#002868]'}`}
                            style={{ width: `${(attendance / 55000) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Activity className="w-4 h-4 text-green-500" /> Entry Rate
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-gray-800">{entryRate} <span className="text-lg font-medium text-gray-500">/min</span></span>
                        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${entryRate > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {entryRate > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                            Trend
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Radio className="w-4 h-4 text-[#FF6B35]" /> Mobile Density
                    </div>
                    <p className="text-3xl font-black text-gray-800">{networkLoad}% <span className="text-lg font-medium text-gray-500">Saturation</span></p>
                    <p className="text-xs text-orange-500 font-bold mt-2">Active devices logged in sector</p>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-2 relative h-[500px] overflow-hidden flex flex-col justify-center">

                {/* Simulated Satellite Image / Ground Context */}
                <div className="absolute inset-0 bg-[#e5ebf0] opacity-50 z-0 flex items-center justify-center">
                    {/* Simple CSS-based pitch placeholder just to provide context beneath the heat maps */}
                    <div className="w-[30%] h-[60%] border-4 border-white rounded-full bg-green-900/10"></div>
                </div>

                {/* Map Header Overlay */}
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow border border-gray-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#002868]" />
                    <span className="font-bold text-[#002868] text-sm">Sector 1 Satellite Relay</span>
                </div>

                {/* SVG Heat Map Coordinates Layer */}
                <svg className="absolute inset-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
                    {/* North Stand */}
                    <g className={`${getPulseColor(regions.north)} transition-colors duration-1000`}>
                        <path d="M 30% 15% Q 50% 5% 70% 15% L 60% 25% Q 50% 15% 40% 25% Z" strokeWidth="2" />
                        <text x="50%" y="12%" textAnchor="middle" fill="#000" className="text-xs font-black drop-shadow-lg">North Stand ({regions.north}%)</text>
                    </g>

                    {/* South Stand */}
                    <g className={`${getPulseColor(regions.south)} transition-colors duration-1000`}>
                        <path d="M 30% 85% Q 50% 95% 70% 85% L 60% 75% Q 50% 85% 40% 75% Z" strokeWidth="2" />
                        <text x="50%" y="89%" textAnchor="middle" fill="#000" className="text-xs font-black drop-shadow-lg">South Stand ({regions.south}%)</text>
                    </g>

                    {/* Gate 1 Box */}
                    <g className={`${getPulseColor(regions.gate1)} transition-colors duration-1000`}>
                        <rect x="80%" y="40%" width="12%" height="8%" rx="4" strokeWidth="2" />
                        <text x="86%" y="45%" textAnchor="middle" fill="#000" className="text-xs font-black drop-shadow-lg">Gate 1 ({regions.gate1}%)</text>
                    </g>

                    {/* Food Court Box */}
                    <g className={`${getPulseColor(regions.foodCourt)} transition-colors duration-1000`}>
                        <rect x="10%" y="40%" width="15%" height="15%" rx="8" strokeWidth="2" />
                        <text x="17.5%" y="48%" textAnchor="middle" fill="#000" className="text-xs font-black drop-shadow-lg">Food Court ({regions.foodCourt}%)</text>
                    </g>

                    {/* Emergency Safe Route */}
                    {scenario === 'EMERGENCY' && (
                        <path
                            d="M 50% 75% L 50% 98% L 80% 98%"
                            stroke="#22c55e"
                            strokeWidth="6"
                            strokeDasharray="12 12"
                            fill="none"
                            className="animate-[dash_1s_linear_infinite]"
                        />
                    )}
                </svg>

                {/* Dash Animation Style Block */}
                <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -24; }
          }
        `}</style>
            </div>
        </div>
    );
}
