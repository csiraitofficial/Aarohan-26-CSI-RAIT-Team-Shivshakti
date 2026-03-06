import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Activity, ShieldAlert, ArrowUpRight, Server } from 'lucide-react';

const data = [
    { time: '08:00', density: 1200 },
    { time: '10:00', density: 2100 },
    { time: '12:00', density: 4500 },
    { time: '14:00', density: 7800 },
    { time: '16:00', density: 6200 },
    { time: '18:00', density: 9500 },
    { time: '20:00', density: 8100 },
];

export default function SystemAnalytics() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868]">System Analytics</h2>
                    <p className="text-gray-500 text-sm mt-1">AI-driven insights and platform performance metrics.</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
                    Export Report
                </button>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Prediction Accuracy Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-[#00AEEF] flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                                strokeDasharray="176" strokeDashoffset="10.5" /* 94% of circumference (2 * pi * 28 = 175.9) */
                                className="text-[#00AEEF] transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-[#002868]">
                            94%
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-1">
                            <Target className="w-4 h-4 text-[#00AEEF]" /> AI Accuracy
                        </div>
                        <p className="text-xl font-bold text-gray-800">High Confidence</p>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3" /> +2.4% this week
                        </p>
                    </div>
                </div>

                {/* Uptime Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-green-500 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Server className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-1">
                            <Activity className="w-4 h-4 text-green-500" /> System Uptime
                        </div>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">99.9%</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            All services operational
                        </p>
                    </div>
                </div>

                {/* Alerts Averted Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-[#FF6B35] flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-8 h-8 text-[#FF6B35]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-1">
                            <ShieldAlert className="w-4 h-4 text-[#FF6B35]" /> Crises Averted
                        </div>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">12</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 gap-1">
                            <span className="text-gray-800 font-bold">4</span> this month
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Row */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Historical Congestion (24h Trend)</h3>

                <div className="h-72 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00AEEF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#002868', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="density"
                                stroke="#00AEEF"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDensity)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#FF6B35' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
