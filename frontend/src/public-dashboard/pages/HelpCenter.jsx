import React, { useState, useEffect } from 'react';
import TicketModal from '../components/TicketModal';

export default function HelpCenter() {
    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/info/faqs')
            .then(res => res.json())
            .then(data => {
                setFaqs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching FAQs:", err);
                // Fallback dummy data
                setFaqs([
                    { id: 1, question: "How do I resolve a critical alert?", answer: "Navigate to Safety Alerts and click 'Mark as Resolved'." },
                    { id: 2, question: "Why is the camera feed delayed?", answer: "Processing time for AI takes 1-3 seconds." },
                    { id: 3, question: "How does predictive routing work?", answer: "AI analyzes density to find safer paths." }
                ]);
                setLoading(false);
            });
    }, []);

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-12">
            {/* Ticket Modal */}
            <TicketModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />

            {/* Search Bar Section */}
            <div className="text-center space-y-6">
                <h2 className="text-3xl font-black text-[#002868]">How can we help you today?</h2>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for articles, guides, or troubleshooting..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 outline-none transition-all shadow-sm text-lg"
                    />
                </div>
            </div>

            {/* Knowledge Base Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Dashboard Basics', desc: 'Learn how to navigate your live crowd console.', icon: 'M4 6h16M4 12h16m-7 6h7' },
                    { title: 'Alert Management', desc: 'Understanding critical, warning, and resolved levels.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                    { title: 'Safe Routes', desc: 'How predictive routing keeps pedestrians safe.', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' }
                ].map((item, i) => (
                    <div key={i} className="card-base group cursor-pointer hover:border-secondary">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:text-secondary group-hover:bg-slate-100 rounded-xl flex items-center justify-center mb-6 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* FAQ Accordion */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-2xl font-black text-[#002868]">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="p-4 bg-gray-50 rounded-xl animate-pulse h-20"></div>
                        ) : (
                            faqs.map(faq => (
                                <div key={faq.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-bold text-[#002868]">{faq.question}</span>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === faq.id && (
                                        <div className="px-6 pb-5 text-gray-600 text-[15px] leading-relaxed animate-in slide-in-from-top-2">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Support Widget */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-[#002868]">Need more help?</h3>
                    <div className="bg-[#002868] p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-4">Emergency IT Contact</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="font-semibold">+91 999 000 1234</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="font-semibold">support@troublefree.ai</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTicketModalOpen(true)}
                                className="w-full mt-8 bg-white text-[#002868] py-3 rounded-xl font-bold hover:bg-[#F0F9FF] transition-colors shadow-md"
                            >
                                Open a Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
