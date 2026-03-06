import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Activity, Clock, Zap, ArrowUp, ArrowDown, Shield } from 'lucide-react';

export default function AIPredictions() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30min');
    const [currentRisk, setCurrentRisk] = useState('moderate');

    const forecasts = {
        '15min': { predicted: 48500, change: '+3,200', trend: 'up', confidence: 94 },
        '30min': { predicted: 52200, change: '+7,000', trend: 'up', confidence: 87 },
        '1hr': { predicted: 58700, change: '+13,500', trend: 'up', confidence: 72 },
    };

    const surgeAlerts = [
        { id: 1, message: 'Gate 2 surge expected in 10 minutes', severity: 'critical', zone: 'South Gate', time: '17:42', probability: 89 },
        { id: 2, message: 'East Wing congestion predicted', severity: 'warning', zone: 'East Wing VIP', time: '17:55', probability: 74 },
        { id: 3, message: 'North Bleachers peak approaching', severity: 'warning', zone: 'North Bleachers', time: '18:10', probability: 68 },
        { id: 4, message: 'Press Box overflow possible', severity: 'low', zone: 'Press Box', time: '18:30', probability: 45 },
    ];

    const riskLevels = [
        { zone: 'North Bleachers', level: 'critical', density: 92, trend: 'up' },
        { zone: 'South Gate Entrance', level: 'warning', density: 78, trend: 'up' },
        { zone: 'East Wing VIP', level: 'warning', density: 71, trend: 'stable' },
        { zone: 'Player Tunnel', level: 'safe', density: 45, trend: 'down' },
        { zone: 'Perimeter Patrol', level: 'safe', density: 32, trend: 'stable' },
        { zone: 'Lower Concourse', level: 'warning', density: 65, trend: 'up' },
    ];

    const getRiskColor = (level) => {
        if (level === 'critical') return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' };
        if (level === 'warning') return { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' };
        return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
    };

    const forecast = forecasts[selectedTimeframe];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tight">AI Predictions</h2>
                    <p className="text-gray-500 font-medium mt-1">AI-powered crowd forecasting and surge detection</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-black text-purple-600 uppercase tracking-wider">AI Engine Active</span>
                </div>
            </div>

            {/* Forecast Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crowd Forecast Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#002868] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#00AEEF]" /> Crowd Forecast
                        </h3>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            {['15min', '30min', '1hr'].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setSelectedTimeframe(tf)}
                                    className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${selectedTimeframe === tf ? 'bg-[#002868] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Predicted Visitors</p>
                            <p className="text-3xl font-black text-[#002868]">{forecast.predicted.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                                <span className="text-xs font-bold text-red-500">{forecast.change}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">AI Confidence</p>
                            <p className="text-3xl font-black text-emerald-600">{forecast.confidence}%</p>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${forecast.confidence}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Overall Risk</p>
                            <p className="text-3xl font-black text-orange-500 uppercase">Moderate</p>
                            <div className="flex gap-1 mt-3">
                                <div className="h-2 flex-1 bg-emerald-400 rounded-full"></div>
                                <div className="h-2 flex-1 bg-orange-400 rounded-full"></div>
                                <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Simulated Chart Area */}
                    <div className="mt-6 h-48 bg-gradient-to-t from-[#00AEEF]/5 to-transparent rounded-xl border border-gray-100 flex items-end px-4 pb-4 gap-2">
                        {[35, 42, 55, 48, 62, 58, 72, 68, 85, 78, 92, 88].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${h > 80 ? 'bg-red-400' : h > 60 ? 'bg-orange-400' : 'bg-[#00AEEF]'}`}
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Surge Detection */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-[#002868] flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-orange-500" /> Surge Alerts
                    </h3>
                    <div className="space-y-3">
                        {surgeAlerts.map(alert => {
                            const colors = getRiskColor(alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'safe');
                            return (
                                <div key={alert.id} className={`p-4 rounded-xl border ${colors.border} ${colors.light}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full ${colors.bg} mt-1.5 shrink-0`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 leading-snug">{alert.message}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">{alert.zone}</span>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {alert.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                                                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${alert.probability}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-500">{alert.probability}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Risk Level Indicator */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-[#002868] flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-emerald-500" /> Zone Risk Levels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {riskLevels.map(zone => {
                        const colors = getRiskColor(zone.level);
                        return (
                            <div key={zone.zone} className={`p-4 rounded-xl border ${colors.border} group hover:shadow-md transition-all`}>
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-sm font-black text-gray-800">{zone.zone}</p>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.light} ${colors.text} border ${colors.border}`}>
                                        {zone.level}
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className={`text-2xl font-black ${colors.text}`}>{zone.density}%</p>
                                    <div className="flex items-center gap-0.5 pb-1">
                                        {zone.trend === 'up' ? <ArrowUp className="w-3.5 h-3.5 text-red-500" /> : zone.trend === 'down' ? <ArrowDown className="w-3.5 h-3.5 text-emerald-500" /> : <Activity className="w-3.5 h-3.5 text-gray-400" />}
                                        <span className="text-[10px] font-bold text-gray-400">{zone.trend}</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
                                    <div className={`h-full ${colors.bg} rounded-full transition-all`} style={{ width: `${zone.density}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
