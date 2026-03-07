import React, { useState } from 'react';
import { MapPin, Upload, Image, Save, Trash2, Eye, Plus } from 'lucide-react';

export default function VenueSetup() {
    const [venueName, setVenueName] = useState('Wankhede Stadium');
    const [venueCity, setVenueCity] = useState('Mumbai, Maharashtra');
    const [venueCapacity, setVenueCapacity] = useState('33000');
    const [uploadedMap, setUploadedMap] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [boundaries] = useState([
        { id: 1, name: 'North Boundary', lat: '18.9389', lng: '72.8258', type: 'Entry' },
        { id: 2, name: 'South Boundary', lat: '18.9375', lng: '72.8258', type: 'Exit' },
        { id: 3, name: 'East Gate', lat: '18.9382', lng: '72.8268', type: 'Entry' },
        { id: 4, name: 'West Gate', lat: '18.9382', lng: '72.8248', type: 'Entry/Exit' },
    ]);

    const handleMapUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedMap(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#002868] tracking-tight">Venue Setup</h2>
                    <p className="text-gray-500 font-medium mt-1">Configure venue boundaries and upload maps</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${saveSuccess ? 'bg-emerald-600 shadow-emerald-200' : 'bg-[#00AEEF] hover:bg-[#0096cc] shadow-blue-200'}`}
                >
                    <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Configuration'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Venue Details */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-[#002868]">Venue Details</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Venue Name</label>
                            <input
                                type="text"
                                value={venueName}
                                onChange={e => setVenueName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#00AEEF] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">City / Location</label>
                            <input
                                type="text"
                                value={venueCity}
                                onChange={e => setVenueCity(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#00AEEF] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Max Capacity</label>
                            <input
                                type="number"
                                value={venueCapacity}
                                onChange={e => setVenueCapacity(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#00AEEF] outline-none"
                            />
                        </div>
                    </div>

                    {/* Venue Boundaries */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-[#002868] uppercase tracking-wider">Venue Boundaries</h4>
                            <button className="flex items-center gap-1 text-[10px] font-black text-[#00AEEF] uppercase tracking-widest hover:text-[#002868] transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add Point
                            </button>
                        </div>
                        <div className="space-y-2">
                            {boundaries.map(b => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{b.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{b.lat}, {b.lng}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{b.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map Upload */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-[#002868]">Venue Map</h3>

                    {uploadedMap ? (
                        <div className="relative group">
                            <img
                                src={uploadedMap}
                                alt="Venue Map"
                                className="w-full h-80 object-cover rounded-xl border border-gray-100"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                <button className="p-3 bg-white rounded-xl text-gray-700 hover:text-[#00AEEF] transition-colors shadow-lg">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button onClick={() => setUploadedMap(null)} className="p-3 bg-white rounded-xl text-gray-700 hover:text-red-500 transition-colors shadow-lg">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all group">
                            <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} />
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-[#00AEEF]/10 flex items-center justify-center mb-4 transition-colors">
                                    <Upload className="w-7 h-7 text-gray-400 group-hover:text-[#00AEEF]" />
                                </div>
                                <p className="text-sm font-black text-gray-600 mb-1">Upload Venue Map</p>
                                <p className="text-xs font-medium text-gray-400">PNG, JPG or SVG up to 10MB</p>
                            </div>
                        </label>
                    )}

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-700">
                            <Image className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                            The uploaded map will be used as the base layer for heatmap overlays in the Manage Crowd module.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
