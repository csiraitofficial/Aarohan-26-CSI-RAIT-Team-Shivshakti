import React, { useState, useEffect, useMemo } from 'react';
import { Users, Shield, Search, Filter, ShieldCheck, MoreHorizontal, RefreshCw, AlertCircle } from 'lucide-react';
import { getAllUsers } from '../../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllUsers();
            if (res.success) {
                setUsers(res.users || []);
            } else {
                setError('Failed to load users.');
            }
        } catch {
            setError('Network error. Could not reach the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Metric Calculations
    const publicUsers = users.filter(u => u.role === 'public').length;
    const authorityUsers = users.filter(u => u.role === 'authority').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole =
                roleFilter === 'ALL' || user.role?.toLowerCase() === roleFilter.toLowerCase();
            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case 'public': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'authority': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleAvatarStyle = (role) => {
        switch (role?.toLowerCase()) {
            case 'public': return 'bg-emerald-100 text-emerald-600';
            case 'authority': return 'bg-orange-100 text-orange-600';
            case 'admin': return 'bg-blue-100 text-[#002868]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-secondary animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-bold text-slate-700">{error}</p>
                    <button onClick={fetchUsers} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary/90 transition-all">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">User Management</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{users.length} registered users in the system</p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-secondary/40 transition-all">
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Refresh</span>
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setRoleFilter(roleFilter === 'public' ? 'ALL' : 'public')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'public' ? 'border-primary ring-2 ring-primary/10' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{publicUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Users</p>
                    </div>
                </button>

                <button onClick={() => setRoleFilter(roleFilter === 'authority' ? 'ALL' : 'authority')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'authority' ? 'border-primary ring-2 ring-primary/10' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{authorityUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorities</p>
                    </div>
                </button>

                <button onClick={() => setRoleFilter(roleFilter === 'admin' ? 'ALL' : 'admin')}
                    className={`flex items-center gap-4 card-base !p-5 transition-all duration-300 text-left cursor-pointer group hover:border-secondary ${roleFilter === 'admin' ? 'border-primary ring-2 ring-primary/10' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{adminUsers}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrators</p>
                    </div>
                </button>
            </div>

            {/* User List */}
            <div className="card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200">
                <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                            {roleFilter === 'ALL' ? 'Directory Listing' : `${roleFilter.toUpperCase()} Listing`}
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
                                className={`p-2 border rounded-lg transition-all shadow-sm flex items-center gap-2 ${isFilterMenuOpen || roleFilter !== 'ALL' ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} />
                                {roleFilter !== 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter by Role</span>
                                        <button onClick={() => { setRoleFilter('ALL'); setIsFilterMenuOpen(false); }} className="text-[9px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider">Reset</button>
                                    </div>
                                    <div className="p-2 space-y-0.5">
                                        {['ALL', 'public', 'authority', 'admin'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => { setRoleFilter(role); setIsFilterMenuOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-[10px] font-bold rounded-lg transition-all ${roleFilter === role ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                {role === 'ALL' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-white">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div key={user._id} className={`flex items-center justify-between p-4 px-5 hover:bg-slate-50/50 transition-colors group ${index !== filteredUsers.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xs shadow-sm transition-transform group-hover:scale-105 ${getRoleAvatarStyle(user.role)}`}>
                                        {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
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
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Joined</p>
                                        <span className="text-xs font-bold text-slate-500">{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center flex flex-col items-center justify-center bg-white">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">No users found</h4>
                            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mt-2">No users match your current search or filter.</p>
                            <button onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); }}
                                className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all">
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 px-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} records</p>
                </div>
            </div>
        </div>
    );
}
