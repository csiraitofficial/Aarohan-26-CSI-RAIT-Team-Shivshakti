import React, { useState } from 'react';
import { MapPin, Navigation, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function ManageCrowdForm({ onComplete }) {
    const [formData, setFormData] = useState({
        venueName: '',
        eventType: 'Match',
        expectedCrowd: '',
        lat: '',
        lng: ''
    });

    const [geoStatus, setGeoStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    // 1. Geolocation API Logic
    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setGeoStatus('ERROR');
            return;
        }

        setGeoStatus('LOADING');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6)
                }));
                setGeoStatus('SUCCESS');
            },
            (error) => {
                console.error("Error detecting location:", error);
                setGeoStatus('ERROR');
            }
        );
    };

    // 2. Form Submission Flow
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoadingText('Processing Location Data...');

        // Simulate the Multi-step AI initialization from before
        setTimeout(() => setLoadingText('Connecting to Satellite Feeds...'), 1000);
        setTimeout(() => setLoadingText('Calibrating Heat Map Sensors...'), 2000);
        setTimeout(() => {
            // Pass the formData back to the parent to switch to the ACTIVE dashboard view
            onComplete(formData);
        }, 3000);
    };

    // If we are in the loading sequence, show the Loading State View
    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[80vh] bg-[#F5F7FB]">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#00AEEF] rounded-full animate-spin mb-8 shadow-sm"></div>
                <h2 className="text-2xl font-bold text-[#002868] animate-pulse">Initializing Setup...</h2>
                <p className="text-gray-500 font-medium mt-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 transition-all duration-300">
                    {loadingText}
                </p>
            </div>
        );
    }

    // Regular Form View
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[80vh] bg-[#F5F7FB] p-6 text-gray-800">

            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#002868]/10 rounded-full mb-4 shadow-sm">
                    <MapPin className="w-8 h-8 text-[#002868]" />
                </div>
                <h2 className="text-3xl font-black text-[#002868] tracking-tight mb-2">Venue Setup</h2>
                <p className="text-gray-500 font-medium max-w-md">Define the location and event parameters to initialize the Live Operations Command Center.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg w-full">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Venue Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Venue Name</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.venueName}
                                onChange={e => setFormData({ ...formData, venueName: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-transparent transition-all"
                                placeholder="e.g., DY Patil Stadium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Event Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                            <select
                                value={formData.eventType}
                                onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-transparent font-medium text-gray-700 bg-white"
                            >
                                <option>Match</option>
                                <option>Concert</option>
                                <option>Protest / Rally</option>
                                <option>Public Gathering</option>
                            </select>
                        </div>

                        {/* Expected Crowd */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expected Crowd</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.expectedCrowd}
                                onChange={e => setFormData({ ...formData, expectedCrowd: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-transparent"
                                placeholder="e.g. 55000"
                            />
                        </div>
                    </div>

                    {/* Geographic Coordinates Divider */}
                    <div className="pt-4 pb-2 border-t border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Geographic Bounds</h3>
                        {geoStatus === 'SUCCESS' && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Locked</span>}
                        {geoStatus === 'ERROR' && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Access Denied</span>}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={geoStatus === 'LOADING'}
                            className="w-full flex justify-center items-center gap-2 bg-white border-2 border-[#002868] text-[#002868] font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            {geoStatus === 'LOADING' ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#002868] rounded-full animate-spin"></div>
                            ) : (
                                <Navigation className="w-4 h-4" />
                            )}
                            {geoStatus === 'LOADING' ? 'Detecting...' : 'Detect My Location'}
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Latitude</label>
                                <input
                                    type="text"
                                    readOnly
                                    required
                                    value={formData.lat}
                                    placeholder="--.------"
                                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 font-mono focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Longitude</label>
                                <input
                                    type="text"
                                    readOnly
                                    required
                                    value={formData.lng}
                                    placeholder="--.------"
                                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 font-mono focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-4 mt-4 bg-[#002868] text-white rounded-xl font-bold shadow-md hover:bg-[#001f52] transition-colors flex justify-center items-center gap-2 text-lg"
                    >
                        Launch Command Center
                    </button>
                </form>
            </div>
        </div>
    );
}
