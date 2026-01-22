import { useState, useEffect, useContext } from 'react';
import { ShoppingCart, User, Menu, X, IceCream } from 'lucide-react';
// import UseAuth from '../hooks/UseAuth';
import { Link } from 'react-router-dom';
import { AuthContext } from '../authProvider/AuthProvider';

const MenuBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logOutUser, isAuthenticated,user } = useContext(AuthContext);
    console.log('check isAuthenticated',isAuthenticated,user);


    const handleLogOut = () => {
        logOutUser();
    };
    // Handle scroll effect to make navbar shrink or change style
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Flavors', href: '#flavors' },
        { name: 'Toppings', href: '#toppings' },
        { name: 'Our Story', href: '#story' },
    ];

    return (
        <>
            {/* Use a fixed position to keep it sticky. 
                'top-4' creates the floating effect. 
            */}
            <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'top-0' : 'top-4'
                }`}>
                <div className={`mx-auto max-w-7xl transition-all duration-300 ${isScrolled ? 'px-4' : 'px-4 md:px-8'
                    }`}>

                    {/* Main Container - The "Pill" Shape */}
                    <div className={`relative flex items-center justify-between px-6 py-3 transition-all duration-300 border shadow-xl backdrop-blur-md ${isScrolled
                        ? 'bg-white/90 border-b-pink-200 rounded-b-2xl rounded-t-none'
                        : 'bg-white/80 border-white/40 rounded-full'
                        }`}>

                        {/* --- LOGO SECTION --- */}
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="p-2 bg-pink-100 rounded-full group-hover:rotate-12 transition-transform duration-300">
                                <IceCream className="w-6 h-6 text-pink-500" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                SweetScoop
                            </span>
                        </div>

                        {/* --- DESKTOP LINKS --- */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="font-medium text-gray-600 hover:text-pink-500 transition-colors relative group"
                                >
                                    {link.name}
                                    {/* Funky underline animation */}
                                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-pink-400 rounded-full transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>

                        {/* --- ACTIONS (Cart & Login) --- */}
                        <div className="hidden md:flex items-center gap-4">

                            {/* Cart Icon */}
                            <button className="relative p-2 hover:bg-pink-50 rounded-full transition-colors group">
                                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-pink-600" />
                                {/* Notification Dot */}
                                <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                    3
                                </span>
                            </button>

                            {/* Login Button */}
                            {
                                isAuthenticated ? <>
                                    <button onClick={handleLogOut} className="flex items-center gap-2 px-5 py-2.5 font-bold text-white transition-all shadow-lg rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-pink-500/30 hover:scale-105 active:scale-95">
                                        <User className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </> : <>
                                    <Link to={'/login'}>
                                        <button className="flex items-center gap-2 px-5 py-2.5 font-bold text-white transition-all shadow-lg rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-pink-500/30 hover:scale-105 active:scale-95">
                                            <User className="w-4 h-4" />
                                            <span>Login</span>
                                        </button>
                                    </Link>
                                </>
                            }
                        </div>

                        {/* --- MOBILE HAMBURGER --- */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-600 hover:bg-pink-50 rounded-full"
                            >
                                {isMobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MOBILE MENU DROPDOWN --- */}
            {/* We put this outside the main nav so it can slide nicely */}
            <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden flex flex-col items-center justify-center space-y-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-bold text-gray-800 hover:text-pink-500"
                    >
                        {link.name}
                    </a>
                ))}
                <div className="flex flex-col items-center gap-6 mt-4">
                    <button className="relative p-4 bg-pink-50 rounded-full">
                        <ShoppingCart className="w-8 h-8 text-pink-600" />
                        <span className="absolute top-0 right-0 w-6 h-6 bg-purple-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                            3
                        </span>
                    </button>
                    <button className="px-8 py-3 font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                        Login / Sign Up
                    </button>
                </div>
            </div>
        </>
    );
};

export default MenuBar;