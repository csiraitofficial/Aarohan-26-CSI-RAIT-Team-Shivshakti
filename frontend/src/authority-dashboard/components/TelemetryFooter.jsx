import React, { useState, useEffect } from 'react';

const TelemetryFooter = () => {
    const [latency, setLatency] = useState(45); // Mock starting latency in ms

    useEffect(() => {
        // Simulate real-time latency fluctuations for the demo
        const interval = setInterval(() => {
            // Fluctuate between 30ms and 120ms
            setLatency(Math.floor(Math.random() * (120 - 30 + 1) + 30));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full bg-white bg-opacity-90 backdrop-blur border-t border-gray-200 py-3 px-6 mt-auto z-10">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-500 tracking-widest uppercase">

                <div className="flex items-center space-x-6 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Server Status: <span className="text-emerald-400 font-bold">ONLINE</span></span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span>Network Latency: <span className={`${latency > 100 ? 'text-orange-400' : 'text-emerald-400'} font-bold`}>{latency}ms</span></span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        <span>Encryption: <span className="text-emerald-400 font-bold">AES-256 Validated</span></span>
                    </div>

                    <div className="opacity-70">
                        TroubleFree AI Engine v2.0.0
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default TelemetryFooter;
