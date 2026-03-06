import React, { useState, useEffect } from 'react';
import { Map, Users, Wifi, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, ShieldCheck, MapPin } from 'lucide-react';

export default function StadiumIntelligence() {
    const [scenario, setScenario] = useState('NORMAL');
    const [attendance, setAttendance] = useState(42500);
    const [flowRate, setFlowRate] = useState(145);
    const [mobileDensity, setMobileDensity] = useState(88);

    const [regions, setRegions] = useState({
        north: 45,
        south: 55,
        gate7: 85,
        vip: 20,
        foodCourt: 35
    });

    // Simulation Tick
    useEffect(() => {
        const timer = setInterval(() => {
            if (scenario === 'NORMAL' && attendance < 55000) {
                setAttendance(prev => prev + Math.floor(Math.random() * 8) + 1);
            } else if (scenario === 'EMERGENCY' && attendance > 0) {
                setAttendance(prev => Math.max(0, prev - Math.floor(Math.random() * 120) + 30));
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [scenario, attendance]);

    const handleScenario = (type) => {
        setScenario(type);
        if (type === 'NORMAL') {
            setRegions({ north: 45, south: 55, gate7: 85, vip: 20, foodCourt: 35 });
            setFlowRate(145);
            setMobileDensity(88);
        } else if (type === 'HALF_TIME') {
            setRegions({ north: 20, south: 25, gate7: 15, vip: 40, foodCourt: 98 });
            setFlowRate(18);
            setMobileDensity(96);
        } else if (type === 'EMERGENCY') {
            setRegions({ north: 95, south: 95, gate7: 100, vip: 80, foodCourt: 90 });
            setFlowRate(0); // Entries stopped
            setMobileDensity(100);
        }
    };

    const getHeatmapColor = (density) => {
        if (density >= 90) return 'fill-red-500/50 stroke-red-600 animate-pulse';
        if (density >= 70) return 'fill-orange-500/50 stroke-orange-600 animate-pulse';
        return 'fill-green-500/50 stroke-green-600';
    };

    return (
        <div className="space-y-6 text-gray-800">

            {/* Header: Location Selection */}
            <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-md border-l-4 border-[#002868]">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868] flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#00AEEF]" />
                        Stadium Intelligence
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Active Venue
                        </span>
                        <span className="text-sm font-bold text-gray-600">DY Patil Stadium (Simulated)</span>
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
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#002868]" /> Total Attendance
                        </h3>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+ Ticking Live</span>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-[#002868]">{attendance.toLocaleString()}</p>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-sm text-gray-500 font-medium">Capacity: 55,000</span>
                            <span className="text-sm font-bold text-[#FF6B35]">{(attendance / 55000 * 100).toFixed(1)}% Full</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${attendance > 50000 ? 'bg-red-500' : 'bg-[#002868]'}`}
                                style={{ width: `${(attendance / 55000) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Flow Rate */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-[#00AEEF]" /> Entrance Velocity
                    </h3>
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-4xl font-black text-gray-800">{flowRate}</p>
                            <p className="text-sm font-bold text-gray-500 leading-tight">People <br /> Per Min</p>
                        </div>
                        <p className={`mt-4 flex items-center gap-1 text-sm font-bold ${flowRate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {flowRate > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {flowRate > 0 ? 'Steady Entry Flow' : 'Gates Locked / Exiting'}
                        </p>
                    </div>
                </div>

                {/* Mobile Density */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2 mb-4">
                        <Wifi className="w-4 h-4 text-[#FF6B35]" /> Mobile Density
                    </h3>
                    <div>
                        <p className="text-4xl font-black text-gray-800">{mobileDensity}%</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Network Saturation</p>

                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex gap-2 items-start">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-red-700">
                                {scenario === 'HALF_TIME' ? 'Critical load in Food Court sector.' :
                                    scenario === 'EMERGENCY' ? 'Emergency Bandwidth overrides active.' :
                                        '94% saturation forming in North Stand.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Satellite Monitoring View */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-2 relative h-[550px] overflow-hidden">

                {/* Placeholder: High Res Satellite Image */}
                <div className="absolute inset-0 bg-[#cbd5e1] overflow-hidden">
                    {/* Faux grass/pitch to anchor the view */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] h-[60%] border-4 border-white/50 rounded-full bg-green-800/20"></div>
                    {/* Diagonal lines to simulate a blueprint map background if image is missing */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
                    </div>
                </div>

                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#002868]" />
                    <span className="font-bold text-[#002868] text-sm">Live Heatmap Overlay</span>
                </div>

                {/* Live Heatmap SVG Overlay */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">

                    {/* North Stand */}
                    <g className={`${getHeatmapColor(regions.north)} transition-colors duration-1000`}>
                        <circle cx="50" cy="15" r="8" strokeWidth="0.5" />
                        <text x="50" y="16" textAnchor="middle" fill="#1f2937" className="text-[3px] font-black pointer-events-none drop-shadow-md">North {regions.north}%</text>
                    </g>

                    {/* South Stand */}
                    <g className={`${getHeatmapColor(regions.south)} transition-colors duration-1000`}>
                        <circle cx="50" cy="85" r="8" strokeWidth="0.5" />
                        <text x="50" y="86" textAnchor="middle" fill="#1f2937" className="text-[3px] font-black pointer-events-none drop-shadow-md">South {regions.south}%</text>
                    </g>

                    {/* Gate 7 */}
                    <g className={`${getHeatmapColor(regions.gate7)} transition-colors duration-1000`}>
                        <circle cx="85" cy="50" r="6" strokeWidth="0.5" />
                        <text x="85" y="51" textAnchor="middle" fill="#1f2937" className="text-[2.5px] font-black pointer-events-none drop-shadow-md">Gate 7 {regions.gate7}%</text>
                    </g>

                    {/* VIP Box */}
                    <g className={`${getHeatmapColor(regions.vip)} transition-colors duration-1000`}>
                        <circle cx="15" cy="50" r="5" strokeWidth="0.5" />
                        <text x="15" y="51" textAnchor="middle" fill="#1f2937" className="text-[2px] font-black pointer-events-none drop-shadow-md">VIP {regions.vip}%</text>
                    </g>

                    {/* Food Court */}
                    <g className={`${getHeatmapColor(regions.foodCourt)} transition-colors duration-1000`}>
                        <circle cx="30" cy="25" r="7" strokeWidth="0.5" />
                        <text x="30" y="26" textAnchor="middle" fill="#1f2937" className="text-[2.5px] font-black pointer-events-none drop-shadow-md">Food {regions.foodCourt}%</text>
                    </g>

                    {/* Emergency Safe Exit Route overlay */}
                    {scenario === 'EMERGENCY' && (
                        <g>
                            <path d="M 50 75 L 50 95 L 85 95" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" fill="none" className="animate-[dash_2s_linear_infinite]" />
                            <path d="M 50 25 L 50 5 L 15 5" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" fill="none" className="animate-[dash_2s_linear_infinite]" />

                            <text x="70" y="93" fill="#22c55e" className="text-[3px] font-black">SAFE ROUTE</text>
                        </g>
                    )}
                </svg>

                <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -20; }
          }
        `}</style>
            </div>
        </div>
    );
}
