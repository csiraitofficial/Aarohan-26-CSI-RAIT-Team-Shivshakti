import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicSidebar from './PublicSidebar';

export default function DashboardLayout() {
    return (
        <div className="h-screen w-screen flex overflow-hidden bg-[#F5F7FB] font-sans text-[#111827]">
            {/* Sidebar is fixed on the left */}
            <PublicSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <PublicHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
                    {/* Nested routes render here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
