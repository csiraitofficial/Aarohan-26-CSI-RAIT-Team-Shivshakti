import React, { useState } from 'react';
import API_BASE_URL from '../../config';

export default function TicketModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        category: 'Dashboard UI/Login',
        urgency: 'Low',
        subject: '',
        description: '',
        attachment: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                    setFormData({
                        category: 'Dashboard UI/Login',
                        urgency: 'Low',
                        subject: '',
                        description: '',
                        attachment: null
                    });
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Submission failed. The backend might be offline, check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-[#002868]">Open a Support Ticket</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {isSuccess ? (
                    <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                        <p className="text-gray-500">Your ticket has been submitted. Our team will contact you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 outline-none transition-all"
                                >
                                    <option>Dashboard UI/Login</option>
                                    <option>Camera Feed Down</option>
                                    <option>Incorrect Occupancy Data</option>
                                    <option>Routing Algorithm Error</option>
                                    <option>Hardware Issue</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Urgency</label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 outline-none transition-all"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical (System Down)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Brief summary of the issue"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                placeholder="Please describe the issue and the affected zone..."
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Attachment (Optional)</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00AEEF]/10 file:text-[#002868] hover:file:bg-[#00AEEF]/20 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 border border-transparent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2.5 bg-[#002868] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#001f52] transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                )}
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
