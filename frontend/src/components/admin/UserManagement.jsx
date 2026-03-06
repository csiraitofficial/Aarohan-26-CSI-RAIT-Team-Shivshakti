import React, { useState, useMemo } from 'react';
import { Users, Shield, Search, Filter, ShieldCheck, MoreHorizontal } from 'lucide-react';

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, PUBLIC, AUTHORITY, ADMIN
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ONLINE, OFFLINE
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Mock Data matching the screenshot exactly
    const [users] = useState([
        { id: 1, name: 'Siddhesh', email: 'siddhesh@user.io', role: 'PUBLIC', status: '2 min ago' },
        { id: 2, name: 'Inspector Atharv', email: 'atharv@authority.gov', role: 'AUTHORITY', status: '5 min ago' },
        { id: 3, name: 'Admin Siddhi', email: 'siddhi@troublefree.io', role: 'ADMIN', status: 'Now' },
        { id: 4, name: 'Shreyash', email: 'shreyash@user.io', role: 'PUBLIC', status: '1 hour ago' },
        { id: 5, name: 'Officer Shreyash', email: 'shreyash@authority.gov', role: 'AUTHORITY', status: '30 min ago' },
        { id: 6, name: 'Shreyash V.', email: 'sv@user.io', role: 'PUBLIC', status: '2 hours ago' },
        { id: 7, name: 'Chief Patel', email: 'patel@authority.gov', role: 'AUTHORITY', status: 'Now' }
    ]);

    // Metric Calculations
    const totalUsers = users.length;
    const publicUsers = users.filter(u => u.role === 'PUBLIC').length;
    const authorityUsers = users.filter(u => u.role === 'AUTHORITY').length;
    const adminUsers = users.filter(u => u.role === 'ADMIN').length;
    const onlineCount = users.filter(u => u.status === 'Now' || u.status.includes('min')).length;

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

            const isOnline = user.status === 'Now' || user.status.includes('min');
            let matchesStatus = true;
            if (statusFilter === 'ONLINE') matchesStatus = isOnline;
            if (statusFilter === 'OFFLINE') matchesStatus = !isOnline;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'PUBLIC':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'AUTHORITY':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'ADMIN':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleAvatarStyle = (role) => {
        switch (role) {
            case 'PUBLIC':
                return 'bg-emerald-100 text-emerald-600';
            case 'AUTHORITY':
                return 'bg-orange-100 text-orange-600';
            case 'ADMIN':
                return 'bg-blue-100 text-[#002868]';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868]">User Management</h2>
                    <p className="text-gray-500 text-sm mt-1">{totalUsers} registered users</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-gray-700">{onlineCount} Online</span>
                </div>
            </div>

            {/* Filter Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <button
                    onClick={() => setRoleFilter(roleFilter === 'PUBLIC' ? 'ALL' : 'PUBLIC')}
                    className={`flex items-center gap-4 bg-white p-5 rounded-2xl border transition-all duration-200 text-left ${roleFilter === 'PUBLIC' ? 'border-emerald-400 shadow-md ring-2 ring-emerald-50' : 'border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-800">{publicUsers}</p>
                        <p className="text-sm font-medium text-gray-500">Public Users</p>
                    </div>
                </button>

                <button
                    onClick={() => setRoleFilter(roleFilter === 'AUTHORITY' ? 'ALL' : 'AUTHORITY')}
                    className={`flex items-center gap-4 bg-white p-5 rounded-2xl border transition-all duration-200 text-left ${roleFilter === 'AUTHORITY' ? 'border-orange-400 shadow-md ring-2 ring-orange-50' : 'border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-800">{authorityUsers}</p>
                        <p className="text-sm font-medium text-gray-500">Authorities</p>
                    </div>
                </button>

                <button
                    onClick={() => setRoleFilter(roleFilter === 'ADMIN' ? 'ALL' : 'ADMIN')}
                    className={`flex items-center gap-4 bg-white p-5 rounded-2xl border transition-all duration-200 text-left ${roleFilter === 'ADMIN' ? 'border-blue-400 shadow-md ring-2 ring-blue-50' : 'border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-800">{adminUsers}</p>
                        <p className="text-sm font-medium text-gray-500">Admins</p>
                    </div>
                </button>

            </div>

            {/* List Header & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            {roleFilter === 'ALL' ? 'All Users' : `${roleFilter.charAt(0) + roleFilter.slice(1).toLowerCase()}s`}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">System users and their roles</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={`p-2 border rounded-lg transition-colors shrink-0 flex items-center gap-2 ${isFilterMenuOpen || statusFilter !== 'ALL' ? 'border-[#002868] text-[#002868] bg-blue-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden">

                                    {/* Role Filter Section */}
                                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Filter</p>
                                    </div>
                                    <div className="flex flex-col p-2 space-y-1">
                                        <button
                                            onClick={() => setRoleFilter('ALL')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors ${roleFilter === 'ALL' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            All Roles
                                        </button>
                                        <button
                                            onClick={() => setRoleFilter('PUBLIC')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center justify-between ${roleFilter === 'PUBLIC' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            Public
                                            <span className={`w-2 h-2 rounded-full ${roleFilter === 'PUBLIC' ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                                        </button>
                                        <button
                                            onClick={() => setRoleFilter('AUTHORITY')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center justify-between ${roleFilter === 'AUTHORITY' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            Authority
                                            <span className={`w-2 h-2 rounded-full ${roleFilter === 'AUTHORITY' ? 'bg-orange-400' : 'bg-orange-500'}`}></span>
                                        </button>
                                        <button
                                            onClick={() => setRoleFilter('ADMIN')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center justify-between ${roleFilter === 'ADMIN' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            Admin
                                            <span className={`w-2 h-2 rounded-full ${roleFilter === 'ADMIN' ? 'bg-blue-400' : 'bg-blue-500'}`}></span>
                                        </button>
                                    </div>

                                    {/* Status Filter Section */}
                                    <div className="p-3 border-y border-gray-50 bg-gray-50/50 mt-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Filter</p>
                                    </div>
                                    <div className="flex flex-col p-2 space-y-1">
                                        <button
                                            onClick={() => setStatusFilter('ALL')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors ${statusFilter === 'ALL' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            All Users
                                        </button>
                                        <button
                                            onClick={() => setStatusFilter('ONLINE')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center justify-between ${statusFilter === 'ONLINE' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            Online
                                            <span className={`w-2 h-2 rounded-full ${statusFilter === 'ONLINE' ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                                        </button>
                                        <button
                                            onClick={() => setStatusFilter('OFFLINE')}
                                            className={`px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center justify-between ${statusFilter === 'OFFLINE' ? 'bg-[#002868] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}
                                        >
                                            Offline
                                            <span className={`w-2 h-2 rounded-full ${statusFilter === 'OFFLINE' ? 'bg-gray-400' : 'bg-gray-300'}`}></span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-gray-50 mt-1">
                                        <button onClick={() => setIsFilterMenuOpen(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-bold transition-colors">Done</button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* User List */}
                <div className="flex flex-col">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div key={user.id} className={`flex items-center justify-between p-4 px-6 hover:bg-gray-50/50 transition-colors ${index !== filteredUsers.length - 1 ? 'border-b border-gray-50' : ''}`}>

                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 flex flex-col items-center justify-center rounded-full font-black text-sm ${getRoleAvatarStyle(user.role)}`}>
                                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-gray-400 mt-0.5">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Now' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <span className={`text-xs font-bold ${user.status === 'Now' ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <button className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                        Manage
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Search className="w-5 h-5 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No users found matching your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); setStatusFilter('ALL'); }}
                                className="mt-2 text-sm text-[#00AEEF] font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
