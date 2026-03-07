import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Activity, Clock, Zap, ArrowUp, ArrowDown, Shield } from 'lucide-react';

export default function AIPredictions() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30min');
    const [currentRisk] = useState('moderate');

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
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">AI Predictions</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">AI-powered crowd forecasting and surge detection</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <Brain size={14} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Engine Active</span>
                </div>
            </div>

            {/* Forecast Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crowd Forecast Card */}
                <div className="lg:col-span-2 card-base !p-0 overflow-hidden hover:border-slate-200">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                            <TrendingUp size={16} className="text-secondary" /> Crowd Forecast
                        </h3>
                        <div className="flex bg-slate-100/50 p-1 rounded-lg border border-slate-100">
                            {['15min', '30min', '1hr'].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setSelectedTimeframe(tf)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all ${selectedTimeframe === tf ? 'bg-white text-primary shadow border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-secondary transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Predicted Visitors</p>
                                <p className="text-3xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{forecast.predicted.toLocaleString()}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <ArrowUp size={14} className="text-critical" />
                                    <span className="text-[10px] font-bold text-critical tracking-wider">{forecast.change}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-secondary transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Confidence</p>
                                <p className="text-3xl font-bold text-emerald-600 tracking-tight">{forecast.confidence}%</p>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden shadow-inner">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${forecast.confidence}%` }}></div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-secondary transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Risk</p>
                                <p className="text-xl font-bold text-accent uppercase tracking-tight mt-1">{currentRisk}</p>
                                <div className="flex gap-1 mt-4">
                                    <div className="h-1.5 flex-1 bg-emerald-400 rounded-full shadow-inner"></div>
                                    <div className="h-1.5 flex-1 bg-accent rounded-full shadow-inner"></div>
                                    <div className="h-1.5 flex-1 bg-slate-200 rounded-full shadow-inner"></div>
                                </div>
                            </div>
                        </div>

                        {/* Simulated Chart Area */}
                        <div className="mt-6 h-48 bg-gradient-to-t from-secondary/5 to-transparent rounded-xl border border-slate-100 flex items-end px-4 pb-4 gap-2">
                            {[35, 42, 55, 48, 62, 58, 72, 68, 85, 78, 92, 88].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 shadow-sm ${h > 80 ? 'bg-critical' : h > 60 ? 'bg-accent' : 'bg-secondary'} group-hover:opacity-80`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Surge Detection */}
                <div className="card-base !p-5 hover:border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-widest">
                        <Zap size={16} className="text-orange-500" /> Surge Alerts
                    </h3>
                    <div className="space-y-3">
                        {surgeAlerts.map(alert => {
                            const colors = getRiskColor(alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'safe');
                            return (
                                <div key={alert.id} className={`p-4 rounded-xl border ${colors.border} ${colors.light}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full ${colors.bg} mt-1.5 shrink-0`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 leading-snug">{alert.message}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{alert.zone}</span>
                                                <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock size={10} /> {alert.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                                                    <div className={`h-full ${colors.bg}`} style={{ width: `${alert.probability}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{alert.probability}%</span>
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
            <div className="card-base !p-5 hover:border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-widest">
                    <Shield size={16} className="text-emerald-500" /> Zone Risk Levels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {riskLevels.map(zone => {
                        const colors = getRiskColor(zone.level);
                        return (
                            <div key={zone.zone} className={`p-4 rounded-xl border ${colors.border} group hover:shadow-md transition-all bg-white`}>
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-sm font-bold text-slate-800">{zone.zone}</p>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colors.light} ${colors.text} ${colors.border}`}>
                                        {zone.level}
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className={`text-2xl font-bold ${colors.text} tracking-tight`}>{zone.density}%</p>
                                    <div className="flex items-center gap-0.5 pb-1">
                                        {zone.trend === 'up' ? <ArrowUp size={12} className="text-critical" /> : zone.trend === 'down' ? <ArrowDown size={12} className="text-emerald-500" /> : <Activity size={12} className="text-slate-400" />}
                                        <span className={`text-[10px] font-medium tracking-wider capitalize ${zone.trend === 'up' ? 'text-critical' : zone.trend === 'down' ? 'text-emerald-500' : 'text-slate-400'}`}>{zone.trend}</span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden shadow-inner">
                                    <div className={`h-full ${colors.bg} transition-all duration-1000`} style={{ width: `${zone.density}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
