import React, { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, Activity, Database, Bell, TrendingUp, Clock, MapPin, Zap, ArrowUp } from 'lucide-react';

export default function CommandCenter() {
    const [stats, setStats] = useState({
        totalVisitors: 45200,
        zonesMonitored: 10,
        incidentsToday: 4,
        incidentsResolved: 2,
        systemUptime: 99.7,
    });

    // Auto-increment visitors to simulate live data
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({ ...prev, totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 5) }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const [healthServices] = useState([
        { id: 1, name: 'Data Ingestion Pipeline', latency: '12ms', status: 'OPERATIONAL' },
        { id: 2, name: 'Prediction Engine', latency: '45ms', status: 'OPERATIONAL' },
        { id: 3, name: 'Alert Dispatch', latency: '8ms', status: 'OPERATIONAL' },
        { id: 4, name: 'Heatmap Renderer', latency: '120ms', status: 'OPERATIONAL' },
        { id: 5, name: 'Mobile API Gateway', latency: '340ms', status: 'DEGRADED' },
    ]);

    const [alerts] = useState([
        { id: 1, message: 'Gate 3 congestion detected', severity: 'critical', zone: 'North Stand', time: '2 min ago' },
        { id: 2, message: 'Zone B critical crowd density', severity: 'critical', zone: 'East Wing', time: '5 min ago' },
        { id: 3, message: 'Entry flow overload at Gate 2', severity: 'warning', zone: 'South Gate', time: '8 min ago' },
        { id: 4, message: 'Authority deployed to Zone C', severity: 'info', zone: 'Perimeter', time: '12 min ago' },
    ]);

    // Simulated chart data points
    const chartData = [
        { time: '12:00', current: 12000, predicted: 13000 },
        { time: '13:00', current: 18000, predicted: 19500 },
        { time: '14:00', current: 25000, predicted: 24000 },
        { time: '15:00', current: 32000, predicted: 33000 },
        { time: '16:00', current: 38000, predicted: 40000 },
        { time: '17:00', current: 45200, predicted: 48000 },
        { time: '18:00', current: null, predicted: 52000 },
        { time: '19:00', current: null, predicted: 55000 },
    ];
    const maxVal = 60000;

    const getStatusStyle = (status) => {
        if (status === 'OPERATIONAL') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (status === 'DEGRADED') return 'text-orange-700 bg-orange-50 border-orange-200';
        return 'text-red-700 bg-red-50 border-red-200';
    };

    const getAlertStyle = (severity) => {
        if (severity === 'critical') return { border: 'border-l-red-500', dot: 'bg-red-500', text: 'text-red-600' };
        if (severity === 'warning') return { border: 'border-l-orange-500', dot: 'bg-orange-500', text: 'text-orange-600' };
        return { border: 'border-l-blue-500', dot: 'bg-blue-500', text: 'text-blue-600' };
    };

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-base group hover:border-secondary transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Visitors</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-secondary transition-colors">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 tracking-tight">{stats.totalVisitors.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <ArrowUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500">+2.4% today</span>
                    </div>
                </div>

                <div className="card-base group hover:border-secondary transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Zones Monitored</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-secondary transition-colors">
                            <Shield size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 tracking-tight">{stats.zonesMonitored}</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Operational
                    </p>
                </div>

                <div className="card-base group hover:border-critical transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Incidents Today</p>
                        <div className="p-2 bg-critical/5 rounded-lg text-critical">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 tracking-tight">{stats.incidentsToday}</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1.5">{stats.incidentsResolved} resolved</p>
                </div>

                <div className="card-base group hover:border-secondary transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Uptime</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-secondary transition-colors">
                            <Activity size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-secondary tracking-tight">{stats.systemUptime}%</p>
                    <p className="text-xs font-medium text-slate-400 mt-1.5 uppercase tracking-wider">Stability Rating</p>
                </div>
            </div>

            {/* Crowd Trend Chart + Active Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crowd Trend Chart */}
                <div className="card-base lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Crowd Trend Forecast</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Live occupancy vs Predictions</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Current</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-dashed border-purple-300"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Predicted</span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart Area */}
                    <div className="h-56 flex items-end gap-3 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                <div className="w-full flex gap-0.5 items-end" style={{ height: '200px' }}>
                                    {d.current !== null && (
                                        <div
                                            className="flex-1 bg-secondary rounded-t shadow-inner transition-all duration-700 group-hover:bg-primary"
                                            style={{ height: `${(d.current / maxVal) * 100}%` }}
                                        ></div>
                                    )}
                                    <div
                                        className={`flex-1 rounded-t transition-all duration-700 ${d.current === null ? 'bg-purple-200 border border-dashed border-purple-300' : 'bg-purple-100'}`}
                                        style={{ height: `${(d.predicted / maxVal) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{d.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="card-base !p-0 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Alarms</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Critical priority incidents</p>
                        </div>
                        <span className="text-[10px] font-bold text-white bg-critical px-2 py-0.5 rounded-full">{alerts.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {alerts.map(alert => {
                            const style = getAlertStyle(alert.severity);
                            return (
                                <div key={alert.id} className={`p-4 rounded-xl border-l-[3px] ${style.border} bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer`}>
                                    <p className="text-sm font-bold text-slate-800 leading-snug">{alert.message}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {alert.zone}
                                        </span>
                                        <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {alert.time}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* System Health + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <div className="card-base !p-0 flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 bg-emerald-50/10 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">System Architecture</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Infrastructure Telemetry</p>
                        </div>
                        <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-secondary transition-colors">View Logs</button>
                    </div>
                    <div className="p-4 space-y-2">
                        {healthServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${service.status === 'DEGRADED' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm leading-tight">{service.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400">Latency: {service.latency}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getStatusStyle(service.status)}`}>
                                    {service.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="card-base">
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Efficiency Metrics</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Operational KPI overview</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Peak Visitors', value: '12.4k', icon: Users },
                            { label: 'Avg. Dwell Time', value: '23m', icon: Clock },
                            { label: 'Alerts Dispatched', value: '18', icon: Bell },
                            { label: 'Active Tasks', value: '3', icon: AlertTriangle },
                            { label: 'Critical Zones', value: '1', icon: Activity },
                            { label: 'Cloud Sources', value: '4 active', icon: Database },
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-all hover:-translate-y-1">
                                <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                                    <stat.icon className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                                </div>
                                <p className="text-xl font-bold text-slate-800 leading-none">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
