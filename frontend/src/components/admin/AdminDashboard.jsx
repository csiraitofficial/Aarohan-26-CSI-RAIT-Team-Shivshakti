import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ManageCrowd from './ManageCrowd';
import ZoneConfig from './ZoneConfig';
import ZoneAssignment from './ZoneAssignment';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import CommandCenter from './CommandCenter';
import IncidentManagement from './IncidentManagement';
import AIPredictions from './AIPredictions';
import VenueSetup from './VenueSetup';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('command-center');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navHistory, setNavHistory] = useState(['command-center']);

    // Track navigation history
    const handleSetActiveTab = (tab) => {
        setActiveTab(tab);
        setNavHistory(prev => [...prev, tab]);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'command-center':
                return <CommandCenter />;
            case 'crowd':
                return <ManageCrowd />;
            case 'zoneconfig':
                return <ZoneConfig setActiveTab={handleSetActiveTab} />;
            case 'zoneassign':
                return <ZoneAssignment />;
            case 'incidents':
                return <IncidentManagement />;
            case 'predictions':
                return <AIPredictions />;
            case 'users':
                return <UserManagement />;
            case 'venue':
                return <VenueSetup />;
            case 'settings':
                return <SystemSettings />;
            default:
                return <CommandCenter />;
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#F5F7FB] overflow-hidden font-sans">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={handleSetActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <div className="flex items-center">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-3 text-gray-500 hover:text-[#002868]"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <TopBar
                            activeTab={activeTab}
                            setActiveTab={handleSetActiveTab}
                            navHistory={navHistory}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto min-h-full">
                        {renderActiveTab()}
                    </div>
                </main>
            </div>
        </div>
    );
}
