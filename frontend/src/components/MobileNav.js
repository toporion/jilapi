
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, IceCream, ShoppingBag, Users, Settings } from 'lucide-react';

const MobileNav = () => {
    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={22} /> },
        { path: '/admin/menu', icon: <IceCream size={22} /> },
        { path: '/admin/orders', icon: <ShoppingBag size={22} /> }, // Center Button
        { path: '/admin/user_manage', icon: <Users size={22} /> },
        { path: '/admin/settings', icon: <Settings size={22} /> },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#1a103c]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-6">
            {navItems.map((item, index) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => `
                        relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                        ${isActive 
                            ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/40 -translate-y-4 scale-125 border-2 border-[#1a103c]' 
                            : 'text-slate-400 hover:text-white'
                        }
                    `}
                >
                    {item.icon}
                    {/* Tiny dot indicator below active icon */}
                </NavLink>
            ))}
        </div>
    );
};

export default MobileNav;