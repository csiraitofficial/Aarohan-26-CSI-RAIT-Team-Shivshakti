import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Save, Trash2, ArrowRight, Activity, Layers, Crosshair } from 'lucide-react';
import { getVenueConfig, saveVenueConfig } from '../../services/api';

export default function VenueConfigPanel() {
    const [config, setConfig] = useState({ name: '', zones: [], paths: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await getVenueConfig();
            if (res.success) {
                setConfig(res.config);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await saveVenueConfig(config);
            if (res.success) {
                setMessage({ type: 'success', text: 'Venue configuration saved successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to save configuration.' });
        } finally {
            setSaving(false);
        }
    };

    const addZone = () => {
        setConfig({
            ...config,
            zones: [...config.zones, { name: `Zone ${config.zones.length + 1}`, type: 'zone', capacity: 100, coordinates: { x: 50, y: 50 } }]
        });
    };

    const removeZone = (index) => {
        const newZones = config.zones.filter((_, i) => i !== index);
        setConfig({ ...config, zones: newZones });
    };

    const updateZone = (index, field, value) => {
        const newZones = [...config.zones];
        if (field.includes('.')) {
            const [f1, f2] = field.split('.');
            newZones[index][f1][f2] = Number(value);
        } else {
            newZones[index][field] = field === 'capacity' ? Number(value) : value;
        }
        setConfig({ ...config, zones: newZones });
    };

    const addPath = () => {
        if (config.zones.length < 2) return;
        setConfig({
            ...config,
            paths: [...config.paths, { from: config.zones[0].name, to: config.zones[1].name, distance: 10, maxFlow: 50 }]
        });
    };

    const removePath = (index) => {
        const newPaths = config.paths.filter((_, i) => i !== index);
        setConfig({ ...config, paths: newPaths });
    };

    const updatePath = (index, field, value) => {
        const newPaths = [...config.paths];
        newPaths[index][field] = (field === 'distance' || field === 'maxFlow') ? Number(value) : value;
        setConfig({ ...config, paths: newPaths });
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading Configuration...</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Venue Configuration</h2>
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">Design the stadium graph & path connections</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#002868] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/10 flex items-center gap-2 hover:bg-blue-800 transition-all disabled:opacity-50"
                >
                    {saving ? <Activity size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Zones Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Layers size={16} className="text-[#00AEEF]" />
                            Zones & Infrastructure
                        </h3>
                        <button onClick={addZone} className="p-2 bg-slate-50 text-slate-400 hover:text-[#002868] hover:bg-slate-100 rounded-lg transition-all">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {config.zones.map((zone, idx) => (
                            <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Zone Name</label>
                                        <input
                                            type="text"
                                            value={zone.name}
                                            onChange={(e) => updateZone(idx, 'name', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                        <select
                                            value={zone.type}
                                            onChange={(e) => updateZone(idx, 'type', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
                                        >
                                            <option value="entry">Entry</option>
                                            <option value="exit">Exit</option>
                                            <option value="zone">Zone</option>
                                            <option value="corridor">Corridor</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                                        <input
                                            type="number"
                                            value={zone.capacity}
                                            onChange={(e) => updateZone(idx, 'capacity', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
                                        />
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Coord X</label>
                                        <input
                                            type="number"
                                            value={zone.coordinates.x}
                                            onChange={(e) => updateZone(idx, 'coordinates.x', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
                                        />
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Coord Y</label>
                                        <input
                                            type="number"
                                            value={zone.coordinates.y}
                                            onChange={(e) => updateZone(idx, 'coordinates.y', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
                                        />
                                    </div>
                                    <button onClick={() => removeZone(idx)} className="self-end p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Paths Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Crosshair size={16} className="text-[#00AEEF]" />
                            Network Connections
                        </h3>
                        <button onClick={addPath} className="p-2 bg-slate-50 text-slate-400 hover:text-[#002868] hover:bg-slate-100 rounded-lg transition-all">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {config.paths.map((path, idx) => (
                            <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="flex-1">
                                    <select
                                        value={path.from}
                                        onChange={(e) => updatePath(idx, 'from', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-700 focus:outline-none"
                                    >
                                        {config.zones.map(z => <option key={z.name} value={z.name}>{z.name}</option>)}
                                    </select>
                                </div>
                                <ArrowRight size={14} className="text-slate-300" />
                                <div className="flex-1">
                                    <select
                                        value={path.to}
                                        onChange={(e) => updatePath(idx, 'to', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-700 focus:outline-none"
                                    >
                                        {config.zones.map(z => <option key={z.name} value={z.name}>{z.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-20">
                                    <input
                                        type="number"
                                        placeholder="Dist"
                                        value={path.distance}
                                        onChange={(e) => updatePath(idx, 'distance', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold text-slate-700"
                                    />
                                </div>
                                <button onClick={() => removePath(idx)} className="p-2 text-red-400 hover:text-red-500 rounded-lg transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Path Preview (Simplified Visualizer) */}
            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden min-h-[400px]">
                <div className="absolute top-6 left-6 z-10">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={16} className="text-[#00AEEF]" />
                        Architectural Graph Preview
                    </h3>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-[120px] font-black text-white/5 uppercase tracking-tighter select-none">STADIUM MESH</div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Render Paths First (Below Nodes) */}
                    {config.paths.map((path, idx) => {
                        const fromZone = config.zones.find(z => z.name === path.from);
                        const toZone = config.zones.find(z => z.name === path.to);
                        if (!fromZone || !toZone) return null;
                        return (
                            <line
                                key={idx}
                                x1={`${fromZone.coordinates.x}%`}
                                y1={`${fromZone.coordinates.y}%`}
                                x2={`${toZone.coordinates.x}%`}
                                y2={`${toZone.coordinates.y}%`}
                                stroke="#00AEEF"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                opacity="0.4"
                                className="animate-pulse"
                            />
                        );
                    })}
                </svg>

                {/* Render Zones */}
                <div className="absolute inset-0">
                    {config.zones.map((zone, idx) => (
                        <div
                            key={idx}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto"
                            style={{ top: `${zone.coordinates.y}%`, left: `${zone.coordinates.x}%` }}
                        >
                            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] border-4 border-[#00AEEF] transition-all group-hover:scale-150"></div>
                            <span className="mt-2 text-[8px] font-black text-white/80 uppercase tracking-widest whitespace-nowrap bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10 group-hover:text-[#00AEEF]">
                                {zone.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
