import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Topbar = ({ onSidebarToggle }) => {
    return (
        <header className="h-20 bg-[#0f172a]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            
            {/* Mobile Sidebar Toggle */}
            <button 
                onClick={onSidebarToggle}
                className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar (Hidden on small mobile) */}
            <div className="hidden md:flex items-center bg-[#1e293b] rounded-full px-4 py-2 border border-white/5 focus-within:border-pink-500/50 focus-within:shadow-[0_0_15px_rgba(236,72,153,0.1)] transition-all w-96">
                <Search size={18} className="text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search flavors, orders, users..." 
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 ml-3 w-full"
                />
            </div>

            {/* Right Actions: Notification & Profile */}
            <div className="flex items-center gap-4 ml-auto">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                </button>
                
                {/* Profile Avatar Placeholder */}
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-[#0f172a] shadow-lg cursor-pointer hover:scale-105 transition-transform"></div>
            </div>
        </header>
    );
};

export default Topbar;