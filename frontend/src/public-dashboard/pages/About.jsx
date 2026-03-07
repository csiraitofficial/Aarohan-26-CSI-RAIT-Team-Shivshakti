import React, { useState, useEffect } from 'react';

export default function About() {
    const [status, setStatus] = useState({ version: 'v1.0.0-beta', status: 'operational' });

    useEffect(() => {
        fetch('http://localhost:5000/api/info/system-status')
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(err => console.error("Error fetching system status:", err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-[#002868] tracking-tight">About TroubleFree AI</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    A cutting-edge predictive crowd intelligence system designed to optimize venue safety through real-time sensor analytics and AI-driven behavior modeling.
                </p>
            </div>

            {/* System Status Card */}
            <div className="flex justify-center">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl flex items-center gap-8 max-w-md w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-[#10B981]"></div>
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Version</div>
                        <div className="text-2xl font-black text-[#002868]">{status.version}</div>
                    </div>
                    <div className="h-12 w-[1px] bg-gray-100"></div>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981]"></span>
                        </span>
                        <span className="text-lg font-bold text-[#10B981] capitalize">{status.status}</span>
                    </div>
                </div>
            </div>

            {/* Limitations and Future Scope */}
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-[#002868] flex items-center gap-3">
                        <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </span>
                        Current Capabilities & Limitations
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Live occupancy tracking across 6+ stadium zones",
                            "Real-time sensor data simulation and processing",
                            "Predictive routing based on crowd density",
                            "Current limitation: 2D static venue mapping",
                            "Hardware dependency on local Wi-Fi mesh"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
                                <span className="text-gray-600 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-[#002868] flex items-center gap-3">
                        <span className="p-2 bg-blue-50 text-[#00AEEF] rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </span>
                        Future Scope
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Integration with real-time weather APIs",
                            "Facial recognition for missing person search",
                            "Enhanced 3D Digital Twin venue rendering",
                            "Localized push notifications via mobile app",
                            "Predictive analytics for vendor sales trends"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00AEEF] group-hover:scale-150 transition-transform"></div>
                                <span className="text-gray-600 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Credits Footer */}
            <div className="pt-16 border-t border-gray-100 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Developed by</p>
                <div className="text-2xl font-black text-[#002868] tracking-widest">SIDDHESH</div>
                <p className="text-gray-300 text-[10px] mt-4">© 2026 TroubleFree AI. All rights reserved.</p>
            </div>
        </div>
    );
}
