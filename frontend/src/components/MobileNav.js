import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import UseAuth from '../hooks/UseAuth';
import { 
    Menu, X, LayoutDashboard, IceCream, Users, LogOut, 
    CreditCard, ChefHat, QrCode, Package, ShoppingCart, 
    UtensilsCrossed, BookOpen, PlusCircle 
} from 'lucide-react';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = UseAuth();
    const userRole = user?.role || 'user';

    const navItems = [
        // 1. MAIN
        { path: '/admin', name: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['admin', 'owner'] },
        
        // 2. SALES & OPERATIONS
        { path: '/admin/pos', name: 'POS Terminal', icon: <CreditCard size={20} />, roles: ['admin', 'owner', 'staff'] },
        { path: '/admin/kitchen', name: 'Kitchen Monitor', icon: <ChefHat size={20} />, roles: ['admin', 'owner', 'staff'] },
        { path: '/admin/tables', name: 'Tables & QR', icon: <QrCode size={20} />, roles: ['admin', 'owner'] },

        // 3. INVENTORY & PRODUCTION
        { path: '/admin/product_stock', name: 'Finished Stock', icon: <IceCream size={20} />, roles: ['admin', 'owner'] },
        { path: '/admin/produce', name: 'Production', icon: <UtensilsCrossed size={20} />, roles: ['admin', 'owner'] },
        { path: '/admin/add_recipe', name: 'Add Recipe', icon: <BookOpen size={20} />, roles: ['admin', 'owner'] },
        { path: '/admin/recipe_list', name: 'Recipes', icon: <BookOpen size={20} />, roles: ['admin', 'owner'] },
        
        // 4. SUPPLY CHAIN
        { path: '/admin/list_ingredient', name: 'Ingredients', icon: <Package size={20} />, roles: ['admin', 'owner'] },
        { path: '/admin/purchase_ingredient', name: 'Purchase', icon: <ShoppingCart size={20} />, roles: ['admin', 'owner'] },
        { path: '/admin/add_ingredient', name: 'Add Item', icon: <PlusCircle size={20} />, roles: ['admin', 'owner'] },

        // 5. ADMIN
        { path: '/admin/user_manage', name: 'Users', icon: <Users size={20} />, roles: ['admin', 'owner'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="md:hidden">
            {/* FLOATING HAMBURGER BUTTON (Visible when menu is closed) */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 right-4 z-50 p-3 bg-pink-600 text-white rounded-full shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* OVERLAY (Background dimmer) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* SLIDE-OUT DRAWER */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-[#1a103c] border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header with Close Button */}
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                    <h2 className="text-xl font-black text-white tracking-widest">MENU</h2>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-160px)] space-y-2">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            onClick={() => setIsOpen(false)} // Close menu on click
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive 
                                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            {item.icon}
                            <span className="font-bold text-sm uppercase tracking-wide">{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Logout Button (Fixed at bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#1a103c]">
                    <button 
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    >
                        <LogOut size={18} />
                        <span className="font-bold text-xs uppercase">Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;