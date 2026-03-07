import React, { useState, useEffect } from 'react';
import { useDashboardContext } from '../context/DashboardContext';
import {
    Users,
    MapPin,
    ShieldAlert,
    TrendingUp,
    Navigation,
    Bell,
    HelpCircle,
    ChevronRight,
    Search,
    Clock,
    Activity,
    Sparkles,
    History,
    LocateFixed,
    Layers
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '1.5rem'
};

const defaultCenter = {
    lat: 19.0435, // D.Y. Patil Stadium area
    lng: 73.0163
};

export default function OverviewPage() {
    const { zones, alerts, getUserLocationZone } = useDashboardContext();
    const locationZone = getUserLocationZone();

    // Google Maps State
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [, setMap] = useState(null);
    const [mapType, setMapType] = useState('satellite');
    const [currentPos, setCurrentPos] = useState(defaultCenter);
    const [selectedZone, setSelectedZone] = useState(null);

    // Geolocation Implementation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentPos(pos);
                },
                () => {
                    console.error("Error: The Geolocation service failed.");
                }
            );
        }
    }, []);



    // Prediction data for the graph
    const predictionData = [
        { time: '12:00', current: 45, predicted: 48 },
        { time: '13:00', current: 52, predicted: 55 },
        { time: '14:00', current: 68, predicted: 62 },
        { time: '15:00', current: 85, predicted: 80 },
        { time: '16:00', current: 92, predicted: 88 },
        { time: '17:00', current: 78, predicted: 75 },
    ];

    const getRiskStyles = (level) => {
        switch (level) {
            case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
            case 'Moderate': return 'text-amber-700 bg-amber-50 border-amber-100';
            case 'High': return 'text-orange-700 bg-orange-50 border-orange-100';
            case 'Critical': return 'text-red-700 bg-red-50 border-red-100';
            default: return 'text-slate-700 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* Live Venue Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {zones.map(zone => (
                    <div key={zone.id} className="card-base group hover:border-secondary transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate max-w-[80%]">{zone.name}</p>
                            <MapPin size={14} className="text-slate-300 group-hover:text-secondary transition-colors" />
                        </div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight">{zone.density}% Full</p>
                        <div className={`mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider w-fit ${getRiskStyles(zone.riskLevel)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${zone.riskLevel === 'Critical' ? 'animate-pulse' : ''} ${zone.riskLevel === 'Low' ? 'bg-emerald-500' :
                                zone.riskLevel === 'Moderate' ? 'bg-amber-500' :
                                    zone.riskLevel === 'High' ? 'bg-orange-500' : 'bg-red-500'
                                }`}></span>
                            {zone.riskLevel} Risk
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Google Maps Integration (Matching Image 1 & 2 Requirements) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-base !p-0 overflow-hidden shadow-2xl border-slate-200/60 transition-all bg-white">
                        {/* Header: Live Navigation HUD */}
                        <div className="bg-[#002868] p-5 flex items-center justify-between text-white relative z-10 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                    <LocateFixed size={24} className="text-secondary-300" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base tracking-tighter uppercase italic leading-none">Live Navigation HUD</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1.5">Centered on Real-time GPS Telemetry</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setMapType(mapType === 'satellite' ? 'roadmap' : 'satellite')}
                                    className="flex items-center gap-2.5 text-[9px] font-black text-white px-5 py-2.5 bg-white/10 hover:bg-secondary border border-white/10 rounded-xl transition-all uppercase tracking-widest shadow-sm"
                                >
                                    <Layers size={14} className="opacity-80" />
                                    {mapType === 'satellite' ? 'Standard Map' : 'Satellite View'}
                                </button>
                                <button className="text-[9px] font-black text-white/70 hover:text-white px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all uppercase tracking-widest">Recalculate</button>
                            </div>
                        </div>

                        {/* Google Map Container */}
                        <div className="relative w-full h-[600px] bg-slate-100">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={currentPos}
                                    zoom={17}
                                    onLoad={map => setMap(map)}
                                    options={{
                                        mapTypeId: mapType,
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: true,
                                        styles: mapType === 'roadmap' ? [
                                            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#616770" }] },
                                            { "featureType": "water", "stylers": [{ "color": "#e9e9e9" }] }
                                        ] : []
                                    }}
                                >
                                    {/* User Marker - Refined for a cleaner look */}
                                    <Marker
                                        position={currentPos}
                                        icon={{
                                            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                                            fillColor: '#3B82F6',
                                            fillOpacity: 1,
                                            strokeColor: '#FFFFFF',
                                            strokeWeight: 3,
                                            scale: 10
                                        }}
                                    />

                                    {/* Zone Markers */}
                                    {zones.map(zone => (
                                        <Marker
                                            key={zone.id}
                                            position={{ lat: currentPos.lat + (Math.random() - 0.5) * 0.002, lng: currentPos.lng + (Math.random() - 0.5) * 0.002 }}
                                            onClick={() => setSelectedZone(zone)}
                                            icon={{
                                                url: `https://maps.google.com/mapfiles/ms/icons/${zone.riskLevel === 'Critical' ? 'red' : zone.riskLevel === 'High' ? 'orange' : 'green'}-dot.png`,
                                                scaledSize: new window.google.maps.Size(32, 32)
                                            }}
                                        />
                                    ))}

                                    {selectedZone && (
                                        <InfoWindow
                                            position={{ lat: currentPos.lat + 0.0005, lng: currentPos.lng }}
                                            onCloseClick={() => setSelectedZone(null)}
                                        >
                                            <div className="p-3 min-w-[180px] bg-white rounded-lg">
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                                                    <div className={`w-2 h-2 rounded-full ${selectedZone.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{selectedZone.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Congestion</span>
                                                        <span className="text-xs font-black text-slate-800">{selectedZone.density}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${selectedZone.riskLevel === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${selectedZone.density}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-4">
                                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Initializing GPS Telemetry...</p>
                                </div>
                            )}

                            {/* Live HUD Watermark */}
                            <div className="absolute bottom-6 right-6 pointer-events-none opacity-40">
                                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em] italic drop-shadow-md">Secure Venue Protocol v2.0</p>
                            </div>
                            {/* Floating Stats HUD - Repositioned and Refined */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none max-w-[280px]">
                                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 pointer-events-auto transition-transform hover:scale-[1.02] transform-gpu">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Your Location</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight">{locationZone?.name || 'North Stand (Level 1)'}</p>
                                </div>

                                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 pointer-events-auto border-l-4 border-l-red-500 transition-transform hover:scale-[1.02] transform-gpu">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <ShieldAlert size={12} className="text-red-500" />
                                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Avoid Surge</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight">Gate 4 (Exit Corridor)</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Safety Alerts Feed */}
                <div className="card-base !p-0 flex flex-col overflow-hidden max-h-[1000px]">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Safety Alerts</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Live environment broadcasts</p>
                        </div>
                        <span className="text-[10px] font-bold text-white bg-critical px-2 py-0.5 rounded-full">{alerts.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-4 rounded-xl border-l-[3px] bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer ${alert.type === 'Critical' ? 'border-l-red-500' :
                                alert.type === 'Warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-xs font-bold leading-snug ${alert.type === 'Critical' ? 'text-red-700' :
                                        alert.type === 'Warning' ? 'text-amber-700' : 'text-blue-700'
                                        }`}>{alert.title}</p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Just Now</span>
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2">{alert.message}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <button className="text-[9px] font-bold text-slate-400 group-hover:text-secondary uppercase tracking-widest flex items-center gap-1 transition-colors">
                                        View Details <ChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Predictive Insights - Integrated into sidebar for better vertical balance */}
                    <div className="p-6 border-t border-slate-50 bg-slate-50/10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Crowd Forecast</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Predictive congestion</p>
                            </div>
                        </div>
                        <div className="h-32 flex items-end gap-2">
                            {predictionData.slice(0, 4).map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div className="w-full flex flex-col justify-end gap-0.5 h-20">
                                        <div className="w-full bg-secondary/20 rounded-t h-1/2"></div>
                                        <div className="w-full bg-secondary rounded-t" style={{ height: `${d.current / 2}%` }}></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{d.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Center Quick Links Footer Row */}
            <div className="card-base">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Help Center</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Expert guides and live support</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary transition-all text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            <Clock size={14} className="text-secondary" />
                            Dashboard Basics
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary transition-all text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            <ShieldAlert size={14} className="text-critical" />
                            Alert Management
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary transition-all text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            <Navigation size={14} className="text-indigo-600" />
                            Safe Routes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
