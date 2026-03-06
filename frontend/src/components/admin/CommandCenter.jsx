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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tight">Command Center</h2>
                    <p className="text-gray-500 font-medium mt-1">Real-time operations dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-black text-gray-700 uppercase tracking-wider">System Online</span>
                    </div>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Visitors</p>
                        <Users className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-3xl font-black text-gray-800 tracking-tight">{stats.totalVisitors.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <ArrowUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500">+2.4% today</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zones Monitored</p>
                        <Shield className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-3xl font-black text-gray-800">{stats.zonesMonitored}</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1.5">All operational</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Incidents Today</p>
                        <AlertTriangle className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-3xl font-black text-gray-800">{stats.incidentsToday}</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1.5">{stats.incidentsResolved} resolved</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Uptime</p>
                        <Activity className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{stats.systemUptime}%</p>
                    <p className="text-xs font-bold text-gray-400 mt-1.5">Last 30 days</p>
                </div>
            </div>

            {/* Crowd Trend Chart + Active Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crowd Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#002868] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#00AEEF]" /> Crowd Trend
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase">Current</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-purple-400 border-2 border-dashed border-purple-300"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase">Predicted</span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-56 flex items-end gap-3 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex gap-0.5 items-end" style={{ height: '200px' }}>
                                    {d.current !== null && (
                                        <div
                                            className="flex-1 bg-[#00AEEF] rounded-t-lg transition-all duration-700 hover:bg-[#002868]"
                                            style={{ height: `${(d.current / maxVal) * 100}%` }}
                                        ></div>
                                    )}
                                    <div
                                        className={`flex-1 rounded-t-lg transition-all duration-700 ${d.current === null ? 'bg-purple-200 border-2 border-dashed border-purple-300' : 'bg-purple-100'}`}
                                        style={{ height: `${(d.predicted / maxVal) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400">{d.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#002868] flex items-center gap-2">
                            <Bell className="w-5 h-5 text-red-500" /> Active Alerts
                        </h3>
                        <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">{alerts.length}</span>
                    </div>
                    <div className="space-y-3">
                        {alerts.map(alert => {
                            const style = getAlertStyle(alert.severity);
                            return (
                                <div key={alert.id} className={`p-3 rounded-xl border-l-4 ${style.border} bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer`}>
                                    <p className="text-sm font-bold text-gray-800 leading-snug">{alert.message}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {alert.zone}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
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
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#002868] flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" /> System Health
                        </h3>
                        <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#00AEEF] transition-colors">View Logs</button>
                    </div>
                    <div className="space-y-3">
                        {healthServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${service.status === 'DEGRADED' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{service.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400">Latency: {service.latency}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border ${getStatusStyle(service.status)}`}>
                                    {service.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-[#002868] flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-[#00AEEF]" /> Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Peak Hour Visitors', value: '12,400', icon: Users },
                            { label: 'Avg. Dwell Time', value: '23 min', icon: Clock },
                            { label: 'Alerts Dispatched', value: '18', icon: Bell },
                            { label: 'Active Incidents', value: '3', icon: AlertTriangle },
                            { label: 'Critical Zones', value: '1', icon: Activity },
                            { label: 'Data Sources', value: '4 active', icon: Database },
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                                    <stat.icon className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <p className="text-xl font-black text-[#002868]">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
