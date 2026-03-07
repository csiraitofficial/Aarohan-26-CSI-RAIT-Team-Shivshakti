import React from 'react';
import { Database, Map, Calendar, Settings, Activity, CheckCircle, AlertTriangle, Link2, XCircle } from 'lucide-react';

export default function DataSourceIntegration() {
    const connectors = [
        {
            id: 1,
            name: 'Ticket System API',
            description: 'Pulls expected occupancy data from platforms like BookMyShow or internal ticketing.',
            status: 'CONNECTED',
            lastSync: '10 mins ago',
            icon: Database,
            color: 'blue'
        },
        {
            id: 2,
            name: 'Map Services',
            description: 'Live traffic, geospatial boundary definitions via Mapbox/Google Maps.',
            status: 'CONNECTED',
            lastSync: '2 mins ago',
            icon: Map,
            color: 'green'
        },
        {
            id: 3,
            name: 'Event Schedule API',
            description: 'Syncs upcoming festivals, metro peak timings to anticipate surges.',
            status: 'DISCONNECTED',
            lastSync: 'Never',
            icon: Calendar,
            color: 'red'
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONNECTED':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Active
                    </span>
                );
            case 'DISCONNECTED':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200">
                        <XCircle className="w-3 h-3" /> Offline
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">
                        <AlertTriangle className="w-3 h-3" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868]">Data Source Integration</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage external APIs and data streams feeding into TroubleFree AI.</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-[#002868] border-2 border-[#002868] px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors font-medium">
                    <Link2 className="w-4 h-4" />
                    Add Webhook
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectors.map((connector) => {
                    const Icon = connector.icon;
                    return (
                        <div key={connector.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col relative overflow-hidden group">

                            {/* Accent top border based on status */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${connector.status === 'CONNECTED' ? 'bg-[#00AEEF]' : 'bg-gray-300'
                                }`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-gray-50 ${connector.status === 'CONNECTED' ? 'text-[#002868]' : 'text-gray-400'
                                    }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {getStatusBadge(connector.status)}
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">{connector.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">
                                {connector.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                    <Activity className="w-3 h-3" />
                                    Last Sync: {connector.lastSync}
                                </div>

                                <button className="text-[#00AEEF] hover:text-[#002868] transition-colors p-1">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
