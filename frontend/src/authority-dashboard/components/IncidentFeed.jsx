import React from 'react';
import '../Theme.css';

const IncidentFeed = ({ alerts }) => {
    // Sort alerts by newest first
    const sortedAlerts = alerts ? [...alerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    const getAlertIcon = (type) => {
        switch (type) {
            case 'MEDICAL':
                return <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>;
            case 'DENSITY':
                return <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
            case 'SYSTEM':
            default:
                return <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'CRITICAL': return 'border-l-red-500 bg-red-900 bg-opacity-10';
            case 'HIGH': return 'border-l-orange-500 bg-orange-900 bg-opacity-10';
            case 'MEDIUM': return 'border-l-amber-500 bg-amber-900 bg-opacity-10';
            case 'LOW': return 'border-l-emerald-500 bg-emerald-900 bg-opacity-10';
            default: return 'border-l-gray-500 bg-gray-900 bg-opacity-10';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-500 text-white animate-pulse';
            case 'IN-PROGRESS': return 'bg-amber-500 text-black';
            case 'RESOLVED': return 'bg-emerald-500 text-white';
            default: return 'bg-gray-600 text-white';
        }
    }

    return (
        <div className="glass-card flex flex-col h-full max-h-[400px] border-opacity-40">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <h2 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-wide">Active Alerts</h2>
                </div>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">
                    {sortedAlerts.filter(a => a.status === 'OPEN').length} OPEN
                </span>
            </div>

            {sortedAlerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm font-medium">
                    <svg className="w-8 h-8 opacity-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>All sectors normal</span>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {sortedAlerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`p-3 rounded overflow-hidden border border-gray-200 border-l-4 ${getSeverityStyle(alert.severity).replace('bg-opacity-10', 'bg-opacity-5')} transition-all bg-white backdrop-blur-md shadow-sm`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="">{getAlertIcon(alert.alertType)}</span>
                                    <span className="font-bold text-xs text-[var(--color-primary)] uppercase tracking-wider">{alert.zoneName || `Zone ${alert.zoneId.substring(0, 4)}`}</span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-500">
                                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-gray-600 mb-3 leading-snug">
                                {alert.message}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${getStatusStyle(alert.status)}`}>
                                    {alert.status}
                                </span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{alert.alertType}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IncidentFeed;
