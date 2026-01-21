import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, IceCream, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    
    const navItems = [
        { path: '/admin', name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/menu', name: 'Menu', icon: <IceCream size={20} /> },
        { path: '/admin/orders', name: 'Orders', icon: <ShoppingBag size={20} /> },
        { path: '/admin/user_manage', name: 'Users', icon: <Users size={20} /> },
        { path: '/admin/settings', name: 'Config', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-[95vh] fixed left-4 top-1/2 -translate-y-1/2 rounded-3xl bg-[#1a103c]/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
            
            {/* Logo Area */}
            <div className="h-24 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                 <div className="p-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl shadow-lg shadow-pink-500/30 mb-1">
                    <IceCream size={24} className="text-white" />
                </div>
                <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                    SWEET<span className="text-white">SCOOP</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `
                            relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden
                            ${isActive 
                                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }
                        `}
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 transform skew-x-12"></div>
                        
                        <span className={`relative z-10 transition-transform duration-300 ${item.path === window.location.pathname ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                        </span>
                        <span className="relative z-10 font-bold text-sm tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 bg-gradient-to-t from-black/40 to-transparent">
                <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 text-slate-400 transition-all duration-300 group">
                    <LogOut size={18} className="group-hover:-rotate-12 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-wider">Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;