import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UnifiedSidebar from './UnifiedSidebar';
import UnifiedTopBar from './UnifiedTopBar';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Map route paths to titles and descriptions for the TopBar
    const getPageContext = (pathname) => {
        const contexts = {
            '/admin': { title: 'Command Center', desc: 'Real-time monitoring and holistic system control' },
            '/admin/map': { title: 'Live Crowd Map', desc: 'Dynamic heatmaps and spatial crowd distribution' },
            '/admin/predictions': { title: 'AI Predictions', desc: 'Forecast crowd trends and proactive risk mitigation' },
            '/admin/incidents': { title: 'Incident Management', desc: 'Track and resolve active security alerts' },
            '/admin/zones': { title: 'Zone Configuration', desc: 'Manage sector definitions and capacity limits' },
            '/admin/deployment': { title: 'Authority Deployment', desc: 'Allocate resources and official personnel' },
            '/admin/analytics': { title: 'Deep Analytics', desc: 'Historical data analysis and reporting' },

            '/authority': { title: 'Assigned Zones', desc: 'Your designated sectors and live telemetry' },
            '/authority/alerts': { title: 'Live Alerts', desc: 'Critical incidents requiring immediate action' },
            '/authority/flow': { title: 'Navigation Guidance', desc: 'Direct crowd flow to optimize venue safety' },
            '/authority/status': { title: 'Deployment Status', desc: 'Real-time status of all personnel' },

            '/public': { title: 'Crowd Map', desc: 'Real-time safety insights for your movements' },
            '/public/map': { title: 'Live Venue Map', desc: 'Interactive environmental layout' },
            '/public/routes': { title: 'Safe Routes', desc: 'AI-guided navigation through least crowded areas' },
            '/public/alerts': { title: 'Safety Alerts', desc: 'Live environment broadcasts' },
            '/public/help': { title: 'Help Center', desc: 'Expert guides and live support' },
        };

        return contexts[pathname] || { title: 'Dashboard', desc: 'TroubleFree AI Command Center' };
    };

    const { title, desc } = getPageContext(location.pathname);

    return (
        <div className="flex h-screen bg-bg-main overflow-hidden font-sans">
            {/* Sidebar Component */}
            <UnifiedSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navigation Bar */}
                <UnifiedTopBar
                    toggleSidebar={toggleSidebar}
                    title={title}
                    description={desc}
                />

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
                    <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
