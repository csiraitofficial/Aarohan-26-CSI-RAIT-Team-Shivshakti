import React, { useState } from 'react';
import { Save, Bell, Globe, Zap, Mail, ChevronDown, Brain, Shield, Camera, Smartphone, Ticket, Cpu, Plane, AlertTriangle } from 'lucide-react';

export default function SystemSettings() {
    const [settings, setSettings] = useState({
        criticalThreshold: 80,
        refreshRate: '5 seconds',
        autoAlerts: true,
        publicMap: true,
        surgePrediction: true,
        emailNotifications: false,
        // AI Controls
        predictionSensitivity: 75,
        alertThreshold: 85,
        emergencyMode: false,
        // Data Sources
        cctvCameras: true,
        mobileGPS: true,
        ticketScanner: true,
        iotSensors: false,
        droneCameras: false,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    const Toggle = ({ value, onToggle, danger }) => (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? (danger ? 'bg-red-500' : 'bg-[#00AEEF]') : 'bg-gray-200'}`}
        >
            <span className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`} />
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#002868] tracking-tight">System Settings</h1>
                    <p className="text-gray-500 mt-1 font-medium">Configure system behavior, AI controls, and data sources</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 rounded-full shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Live</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 ${saveSuccess ? 'bg-emerald-600 shadow-emerald-200' : 'bg-[#00AEEF] hover:bg-[#0096cc] shadow-blue-200'}`}
                    >
                        <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                        {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-gray-800">General</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Core system configuration</p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Critical Threshold (%)</label>
                            <input type="number" value={settings.criticalThreshold} onChange={(e) => setSettings({ ...settings, criticalThreshold: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all font-bold text-gray-700 text-sm" />
                            <p className="text-[10px] text-gray-400 font-medium">Zones exceeding this trigger critical alerts</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Data Refresh Rate</label>
                            <div className="relative">
                                <select value={settings.refreshRate} onChange={(e) => setSettings({ ...settings, refreshRate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none font-bold text-gray-700 text-sm appearance-none cursor-pointer">
                                    <option>5 seconds</option>
                                    <option>10 seconds</option>
                                    <option>30 seconds</option>
                                    <option>1 minute</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">How frequently the system polls for new data</p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-gray-800">Features</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Enable or disable system features</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { key: 'autoAlerts', icon: Bell, iconBg: 'bg-emerald-50 text-emerald-600', label: 'Automatic Alerts', desc: 'Auto-dispatch alerts when thresholds exceeded' },
                            { key: 'publicMap', icon: Globe, iconBg: 'bg-blue-50 text-blue-600', label: 'Public Map Access', desc: 'Allow public users to view live crowd maps' },
                            { key: 'surgePrediction', icon: Zap, iconBg: 'bg-purple-50 text-purple-600', label: 'Surge Prediction', desc: 'Enable AI-powered surge prediction engine' },
                            { key: 'emailNotifications', icon: Mail, iconBg: 'bg-indigo-50 text-indigo-600', label: 'Email Notifications', desc: 'Send email alerts to authority users' },
                        ].map(({ key, icon: Icon, iconBg, label, desc }) => (
                            <div key={key} className="flex items-center justify-between group">
                                <div className="flex gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{label}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{desc}</p>
                                    </div>
                                </div>
                                <Toggle value={settings[key]} onToggle={() => handleToggle(key)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Controls */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-500" /> AI Controls
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">Configure AI prediction behavior</p>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prediction Sensitivity</label>
                                <span className="text-xs font-black text-[#002868]">{settings.predictionSensitivity}%</span>
                            </div>
                            <input type="range" min="10" max="100" value={settings.predictionSensitivity} onChange={e => setSettings({ ...settings, predictionSensitivity: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            <p className="text-[10px] text-gray-400 font-medium mt-1.5">Higher values increase alert frequency</p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alert Threshold</label>
                                <span className="text-xs font-black text-[#002868]">{settings.alertThreshold}%</span>
                            </div>
                            <input type="range" min="50" max="99" value={settings.alertThreshold} onChange={e => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                            <p className="text-[10px] text-gray-400 font-medium mt-1.5">AI confidence threshold for triggering alerts</p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-red-700">Emergency Mode</h4>
                                    <p className="text-[10px] text-red-400 font-medium mt-0.5">Override all thresholds and maximize alerts</p>
                                </div>
                            </div>
                            <Toggle value={settings.emergencyMode} onToggle={() => handleToggle('emergencyMode')} danger />
                        </div>
                    </div>
                </div>

                {/* Data Sources */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#00AEEF]" /> Data Sources
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">Enable or disable input data sources</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { key: 'cctvCameras', icon: Camera, iconBg: 'bg-blue-50 text-blue-600', label: 'CCTV Cameras', desc: 'Video feed analysis for crowd detection' },
                            { key: 'mobileGPS', icon: Smartphone, iconBg: 'bg-green-50 text-green-600', label: 'Mobile GPS Data', desc: 'Anonymized location data from mobile devices' },
                            { key: 'ticketScanner', icon: Ticket, iconBg: 'bg-orange-50 text-orange-600', label: 'Ticket Scanner Data', desc: 'Entry/exit scanning records' },
                            { key: 'iotSensors', icon: Cpu, iconBg: 'bg-purple-50 text-purple-600', label: 'IoT Sensors', desc: 'Pressure and motion sensor data' },
                            { key: 'droneCameras', icon: Plane, iconBg: 'bg-cyan-50 text-cyan-600', label: 'Drone Cameras', desc: 'Aerial surveillance and monitoring' },
                        ].map(({ key, icon: Icon, iconBg, label, desc }) => (
                            <div key={key} className="flex items-center justify-between group">
                                <div className="flex gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{label}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{desc}</p>
                                    </div>
                                </div>
                                <Toggle value={settings[key]} onToggle={() => handleToggle(key)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
