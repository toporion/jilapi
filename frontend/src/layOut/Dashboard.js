
import { Outlet } from 'react-router-dom';

import { Bell, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-[#090514] text-white font-sans selection:bg-pink-500 selection:text-white pb-24 md:pb-0">
            
            {/* 1. Desktop Floating Sidebar */}
            <Sidebar />

            {/* 2. Content Area */}
            <div className="flex-1 flex flex-col md:pl-[290px] md:pr-4 min-h-screen transition-all duration-300">
                
                {/* Mobile Top Bar (Just Logo & Profile) */}
                <header className="md:hidden flex items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                             <span className="font-black text-lg">S</span>
                         </div>
                         <span className="font-bold text-lg tracking-tight">SweetScoop</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white/10"></div>
                </header>

                {/* Desktop Top Area (Search & Welcome) */}
                <header className="hidden md:flex items-center justify-between py-8 px-4">
                    <div>
                        <h2 className="text-2xl font-bold">Good Morning, Salman! 🍦</h2>
                        <p className="text-slate-400 text-sm">Here's what's happening at your shop today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="relative bg-[#1a103c] rounded-full px-4 py-2.5 border border-white/5 flex items-center w-64">
                            <Search size={16} className="text-slate-400" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder-slate-500"/>
                         </div>
                         <button className="p-3 bg-[#1a103c] rounded-full border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <Bell size={20} />
                         </button>
                    </div>
                </header>

                {/* 3. Main Outlet */}
                <main className="relative z-10 px-4 md:px-0">
                    <Outlet />
                </main>

            </div>

            {/* 4. Mobile Bottom Nav */}
            <MobileNav />

            {/* Background Atmosphere */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        </div>
    );
};

export default Dashboard;