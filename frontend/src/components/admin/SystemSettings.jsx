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
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${value ? (danger ? 'bg-critical' : 'bg-primary') : 'bg-slate-200'}`}
        >
            <span className={`${value ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm`} />
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">System Settings</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Configure system behavior, AI controls, and data sources</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-100 rounded-lg shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-70 ${saveSuccess ? 'bg-emerald-500 text-white' : 'btn-primary'}`}
                    >
                        <Save size={14} className={`${isSaving ? 'animate-spin' : ''}`} />
                        {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="card-base group hover:border-slate-200">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">General</h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Core system configuration</p>
                    </div>
                    <div className="space-y-5 mt-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Critical Threshold (%)</label>
                            <input type="number" value={settings.criticalThreshold} onChange={(e) => setSettings({ ...settings, criticalThreshold: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-bold text-slate-700 text-xs shadow-sm" />
                            <p className="text-[9px] text-slate-400 font-medium">Zones exceeding this trigger critical alerts</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Refresh Rate</label>
                            <div className="relative">
                                <select value={settings.refreshRate} onChange={(e) => setSettings({ ...settings, refreshRate: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-secondary focus:border-secondary outline-none font-bold text-slate-700 text-xs appearance-none cursor-pointer shadow-sm">
                                    <option>5 seconds</option>
                                    <option>10 seconds</option>
                                    <option>30 seconds</option>
                                    <option>1 minute</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium">How frequently the system polls for new data</p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="card-base group hover:border-slate-200">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Features</h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Enable or disable system features</p>
                    </div>
                    <div className="space-y-4 mt-6">
                        {[
                            { key: 'autoAlerts', icon: Bell, iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', label: 'Automatic Alerts', desc: 'Auto-dispatch alerts when thresholds exceeded' },
                            { key: 'publicMap', icon: Globe, iconBg: 'bg-secondary/10 text-secondary border border-secondary/20', label: 'Public Map Access', desc: 'Allow public users to view live crowd maps' },
                            { key: 'surgePrediction', icon: Zap, iconBg: 'bg-primary/10 text-primary border border-primary/20', label: 'Surge Prediction', desc: 'Enable AI-powered surge prediction engine' },
                            { key: 'emailNotifications', icon: Mail, iconBg: 'bg-purple-50 text-purple-600 border border-purple-100', label: 'Email Notifications', desc: 'Send email alerts to authority users' },
                        ].map(({ key, icon: Icon, iconBg, label, desc }) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{desc}</p>
                                    </div>
                                </div>
                                <Toggle value={settings[key]} onToggle={() => handleToggle(key)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Controls */}
                <div className="card-base group hover:border-slate-200">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                            <Brain size={16} className="text-primary" /> AI Controls
                        </h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Configure AI prediction behavior</p>
                    </div>
                    <div className="space-y-5 mt-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prediction Sensitivity</label>
                                <span className="text-xs font-bold text-primary">{settings.predictionSensitivity}%</span>
                            </div>
                            <input type="range" min="10" max="100" value={settings.predictionSensitivity} onChange={e => setSettings({ ...settings, predictionSensitivity: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                            <p className="text-[9px] text-slate-400 font-medium mt-1.5">Higher values increase alert frequency</p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alert Threshold</label>
                                <span className="text-xs font-bold text-primary">{settings.alertThreshold}%</span>
                            </div>
                            <input type="range" min="50" max="99" value={settings.alertThreshold} onChange={e => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                            <p className="text-[9px] text-slate-400 font-medium mt-1.5">AI confidence threshold for triggering alerts</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-critical/5 rounded-xl border border-critical/20">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-lg bg-critical/10 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={14} className="text-critical shrink-0" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-critical">Emergency Mode</h4>
                                    <p className="text-[9px] text-critical/70 font-medium mt-0.5">Override thresholds & maximize alerts</p>
                                </div>
                            </div>
                            <Toggle value={settings.emergencyMode} onToggle={() => handleToggle('emergencyMode')} danger />
                        </div>
                    </div>
                </div>

                {/* Data Sources */}
                <div className="card-base group hover:border-slate-200">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                            <Shield size={16} className="text-secondary" /> Data Sources
                        </h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Enable or disable input data sources</p>
                    </div>
                    <div className="space-y-4 mt-6">
                        {[
                            { key: 'cctvCameras', icon: Camera, iconBg: 'bg-blue-50 text-blue-600 border border-blue-100', label: 'CCTV Cameras', desc: 'Video feed analysis for crowd detection' },
                            { key: 'mobileGPS', icon: Smartphone, iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', label: 'Mobile GPS Data', desc: 'Anonymized location data from mobile devices' },
                            { key: 'ticketScanner', icon: Ticket, iconBg: 'bg-orange-50 text-orange-600 border border-orange-100', label: 'Ticket Scanner Data', desc: 'Entry/exit scanning records' },
                            { key: 'iotSensors', icon: Cpu, iconBg: 'bg-purple-50 text-purple-600 border border-purple-100', label: 'IoT Sensors', desc: 'Pressure and motion sensor data' },
                            { key: 'droneCameras', icon: Plane, iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100', label: 'Drone Cameras', desc: 'Aerial surveillance and monitoring' },
                        ].map(({ key, icon: Icon, iconBg, label, desc }) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{desc}</p>
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
