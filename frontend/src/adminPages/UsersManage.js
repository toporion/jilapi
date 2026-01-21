import React, { useState } from 'react';
import { Trash2, Shield, Search, CheckCircle, Mail, ChevronLeft, ChevronRight, UserCog, X, Calendar, Hash, Phone } from 'lucide-react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const UsersManage = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    
    // --- STATE FOR MODAL ---
    const [selectedUserId, setSelectedUserId] = useState(null); // Stores ID of clicked user
    
    const axiosSecure = UseAxiosSecure();

    // 1. FETCH ALL USERS (For Table)
    const { data: queryData, isLoading, refetch } = useQuery({
        queryKey: ['users', search, page],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/users', {
                params: { search, page, limit: 10 }
            });
            return data;


            
        },
        keepPreviousData: true
    });

    // 2. FETCH SINGLE USER DETAILS (Triggered when selectedUserId is set)
    const { data: userDetailResponse, isLoading: isUserLoading } = useQuery({
        queryKey: ['user', selectedUserId],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/users/${selectedUserId}`);
            return data;
        },
        enabled: !!selectedUserId, // Only run this query if an ID is clicked
    });

    const userDetail = userDetailResponse?.data || userDetailResponse?.user || {}; // Adjust based on your backend response structure
    const users = queryData?.data?.users || [];
    const totalPages = queryData?.data?.totalPages || 1;

    // --- HANDLERS ---
// --- 2. UPDATE ROLE FUNCTION (Dropdown Logic) ---
    const handleRoleChange = async (userId, newRole) => {
        // Confirmation Alert
        const result = await Swal.fire({
            title: "Update Role?",
            text: `Are you sure you want to change this user's role to ${newRole}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#db2777",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Yes, Update it!",
            background: '#1a103c',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                // Sending the new role in the body or params. 
                // Adjust backend route to accept body: { role: newRole }
                const res = await axiosSecure.put(`/users_role/${userId}`, { role: newRole });
                
                if (res.data.success || res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: "Updated!",
                        text: `User is now a ${newRole}.`,
                        icon: "success",
                        background: '#1a103c',
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error('Error updating role:', error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to update role.",
                    icon: "error",
                    background: '#1a103c',
                    color: '#fff'
                });
            }
        } else {
            // If cancelled, we might want to reset the dropdown visually (optional, requires state)
            // For now, refetching resets the UI to the database state
            refetch();
        }
    };

    const handleDelete = (id) => { /* ... Keep your delete logic ... */ };

    // Close Modal Handler
    const closeModal = () => setSelectedUserId(null);

    return (
        <div className="space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white">All Users</h2>
                    <p className="text-slate-400 text-sm">Total: {queryData?.data?.totalUsers || 0}</p>
                </div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <input 
                        type="text" placeholder="Search users..." 
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500/50 transition-all"
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-[#1a103c]/80 z-20 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400 bg-white/5">
                                <th className="p-6 font-semibold">User Profile</th>
                                <th className="p-6 font-semibold">Current Role</th>
                                <th className="p-6 font-semibold">Change Access</th>
                                <th className="p-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {users.map((user) => (
                                <tr key={user._id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            {/* --- CLICKABLE IMAGE --- */}
                                            <div 
                                                onClick={() => setSelectedUserId(user._id)}
                                                className="relative cursor-pointer group/img"
                                            >
                                                <img 
                                                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                                    alt={user.name} 
                                                    className="w-10 h-10 rounded-xl object-cover border-2 border-white/10 group-hover/img:border-pink-500 transition-colors shadow-lg"
                                                />
                                                {/* Hover Hint */}
                                                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <Search size={12} className="text-white"/>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white">{user.name}</h3>
                                                <div className="flex items-center gap-1 text-slate-400 text-xs"><Mail size={12}/> {user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="p-6">
                                         <span className={`px-3 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1 ${
                                            user.role === 'admin' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                            user.role === 'staff' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    
                                    <td className="p-6">
                                        <div className="relative w-fit">
                                            <select 
                                                defaultValue={user.role} 
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="bg-[#0f0a1f] text-white text-xs border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-pink-500 cursor-pointer hover:bg-white/5 transition-colors appearance-none pr-8"
                                            >
                                                <option value="user">User</option>
                                                <option value="staff">Staff</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-6 text-right">
                                        <button onClick={() => handleDelete(user._id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {/* Pagination Controls */}
                     <div className="p-4 flex justify-end gap-2 border-t border-white/10">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronLeft/></button>
                        <span className="p-2 text-white font-medium">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronRight/></button>
                    </div>
                </div>
            </div>

            {/* --- 3. THE BEAUTIFUL USER DETAIL MODAL --- */}
            {selectedUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* Backdrop (Darken the background) */}
                    <div 
                        className="absolute inset-0 bg-[#0f0a1f]/80 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-[#1a103c] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        
                        {/* Decorative Top Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-pink-600 to-purple-700"></div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md z-10 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {isUserLoading ? (
                            <div className="h-96 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="relative px-6 pb-8 pt-16 flex flex-col items-center">
                                
                                {/* Avatar (Floating) */}
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 p-1 rounded-full bg-gradient-to-tr from-white to-pink-200 shadow-xl">
                                        <img 
                                            src={userDetail.profileImage || `https://ui-avatars.com/api/?name=${userDetail.name}&background=random`} 
                                            alt="Profile" 
                                            className="w-full h-full rounded-full object-cover border-4 border-[#1a103c]"
                                        />
                                    </div>
                                    <span className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-bold border-2 border-[#1a103c] ${
                                        userDetail.role === 'admin' ? 'bg-pink-500 text-white' : 
                                        userDetail.role === 'staff' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                        {userDetail.role?.toUpperCase()}
                                    </span>
                                </div>

                                {/* Main Info */}
                                <h3 className="text-2xl font-bold text-white mb-1">{userDetail.name}</h3>
                                <p className="text-white/50 text-sm mb-6 flex items-center gap-1">
                                    <Mail size={14}/> {userDetail.email}
                                </p>

                                {/* Stats / Details Grid */}
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors">
                                        <Hash className="text-pink-400" size={20} />
                                        <span className="text-xs text-white/40">User ID</span>
                                        <span className="text-white font-mono text-xs truncate max-w-full px-2">
                                            {userDetail._id?.slice(-6)}...
                                        </span>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors">
                                        <Calendar className="text-cyan-400" size={20} />
                                        <span className="text-xs text-white/40">Joined</span>
                                        <span className="text-white text-sm font-bold">
                                            {userDetail.createdAt ? new Date(userDetail.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    {/* Optional: Add phone or location if you have it in backend */}
                                    <div className="col-span-2 bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                        <div className="p-2 bg-purple-500/20 rounded-full text-purple-400">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40">Account Status</p>
                                            <p className="text-white font-bold">Active & Verified</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default UsersManage;