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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">User Management</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{totalUsers} registered users in the system</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{onlineCount} Online</span>
                </div>
            </div>

            {/* Filter Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setRoleFilter(roleFilter === 'PUBLIC' ? 'ALL' : 'PUBLIC')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'PUBLIC' ? 'border-primary ring-2 ring-primary/10' : ''}`}
                >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{publicUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Users</p>
                    </div>
                </button>

                <button
                    onClick={() => setRoleFilter(roleFilter === 'AUTHORITY' ? 'ALL' : 'AUTHORITY')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'AUTHORITY' ? 'border-primary ring-2 ring-primary/10' : ''}`}
                >
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{authorityUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorities</p>
                    </div>
                </button>

                <button
                    onClick={() => setRoleFilter(roleFilter === 'ADMIN' ? 'ALL' : 'ADMIN')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'ADMIN' ? 'border-primary ring-2 ring-primary/10' : ''}`}
                >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{adminUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrators</p>
                    </div>
                </button>
            </div>

            {/* List Header & Search */}
            <div className="card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200">
                <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                            {roleFilter === 'ALL' ? 'Directory Listing' : `${roleFilter} Listing`}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Manage user access</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all shadow-sm"
                            />
                        </div>


                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={`p-2 border rounded-lg transition-all shadow-sm flex items-center gap-2 ${isFilterMenuOpen || statusFilter !== 'ALL' ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} />
                                {statusFilter !== 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filters</span>
                                        <button onClick={() => { setRoleFilter('ALL'); setStatusFilter('ALL'); }} className="text-[9px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider">Reset</button>
                                    </div>
                                    <div className="p-2 space-y-3">
                                        <div>
                                            <p className="px-2 pb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">By Role</p>
                                            <div className="flex flex-wrap gap-1 px-1">
                                                {['ALL', 'PUBLIC', 'AUTHORITY', 'ADMIN'].map(role => (
                                                    <button
                                                        key={role}
                                                        onClick={() => setRoleFilter(role)}
                                                        className={`px-2 py-1 text-[9px] font-bold rounded-md border transition-all ${roleFilter === role ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="px-2 pb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">By Status</p>
                                            <div className="flex flex-col gap-0.5 px-1 pb-1">
                                                {['ALL', 'ONLINE', 'OFFLINE'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setStatusFilter(status)}
                                                        className={`px-2 py-1.5 text-[10px] font-bold rounded-md text-left transition-all ${statusFilter === status ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                                                    >
                                                        {status === 'ALL' ? 'All Users' : status === 'ONLINE' ? 'Active Only' : 'Inactive Only'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="flex flex-col bg-white">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div key={user.id} className={`flex items-center justify-between p-4 px-5 hover:bg-slate-50/50 transition-colors group ${index !== filteredUsers.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg font-bold text-xs shadow-sm transition-transform group-hover:scale-105 ${getRoleAvatarStyle(user.role)}`}>
                                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest shadow-sm ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="hidden md:flex flex-col items-end">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Last Activity</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Now' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            <span className={`text-xs font-bold ${user.status === 'Now' ? 'text-slate-700' : 'text-slate-500'}`}>
                                                {user.status === 'Now' ? 'Active Now' : user.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 bg-white border border-slate-200 text-slate-500 hover:text-secondary hover:border-secondary hover:bg-secondary/5 rounded-lg text-xs font-bold transition-all shadow-sm">
                                        View <MoreHorizontal size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center flex flex-col items-center justify-center bg-white">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">No users found</h4>
                            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mt-2">We couldn't find any users matching your current filters or search query.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); setStatusFilter('ALL'); }}
                                className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="p-4 px-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Showing {filteredUsers.length} records</p>
                    <div className="flex items-center gap-1.5">
                        {[1].map(p => (
                            <button key={p} className={`w-7 h-7 rounded-md text-xs font-bold border transition-all ${p === 1 ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
