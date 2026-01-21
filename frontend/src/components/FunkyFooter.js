import React, { useState } from 'react';
import {  
  Send, 
  ArrowUpRight, 
  MapPin, 
  Phone, 
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

const FunkyAppFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscribe logic
    setEmail('');
  };

  return (
    <div className="bg-[#1a1a2e] min-h-[500px] w-full flex items-end justify-center p-4 md:p-8 font-sans">
      
      {/* Main Container - The "Sheet" look */}
      <div className="w-full max-w-7xl relative">
        
        {/* Decorative background blurs for that 'modern' glow */}
        <div className="absolute -top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <footer className="relative z-10">
          
          {/* TOP SECTION: The Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">

            {/* CARD 1: Brand Identity (Big on mobile, spans 5 cols on desktop) */}
            <div className="col-span-1 md:col-span-5 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-full min-h-[280px] group hover:border-white/20 transition-all duration-500">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-tr from-pink-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-pink-500/20 group-hover:rotate-12 transition-transform duration-300">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">SweetScoop.</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                  Crafting frozen moments of pure joy. Don't just eat dessert, experience the revolution.
                </p>
              </div>
              
            
            </div>

            {/* CARD 2: Navigation Pills (Spans 4 cols) */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
              {/* Nav Card */}
              <div className="bg-[#24243e] p-6 rounded-3xl border border-white/5 flex-1">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Menu</h3>
                <nav className="flex flex-wrap gap-2">
                  {['Our Story', 'Flavors', 'Locations', 'Merch', 'Franchise', 'Careers'].map((item) => (
                    <a key={item} href="www.toporion.net" className="px-4 py-2 rounded-full bg-white/5 text-gray-300 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 text-sm font-medium flex items-center gap-1 group">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all duration-300" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Mini-Card */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                 <div className="flex items-center gap-3 text-gray-300 mb-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">Dessert District, NY 10012</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">+1 (555) SC0-00PS</span>
                 </div>
              </div>
            </div>

            {/* CARD 3: Newsletter Action (Spans 3 cols - The "Pop" card) */}
            <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-pink-600 to-purple-700 p-6 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-purple-900/50">
              {/* Decor */}
              <Zap className="absolute -right-4 -top-4 w-32 h-32 text-white/10 rotate-12" />
              
              <div>
                <h3 className="text-2xl font-bold mb-2 relative z-10">Get 20% Off!</h3>
                <p className="text-white/80 text-sm mb-6 relative z-10">Join the club. We promise not to spam (much).</p>
              </div>

              <form onSubmit={handleSubscribe} className="relative z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-1 flex items-center border border-white/30 focus-within:bg-white/30 transition-all">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email..." 
                    className="bg-transparent border-none text-white placeholder-white/70 text-sm w-full px-3 py-2 focus:outline-none"
                  />
                  <button type="submit" className="bg-white text-purple-600 p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg">
                    <Send size={16} fill="currentColor" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* BOTTOM BAR: Minimal & Clean */}
          <div className="bg-[#0f0f1c] rounded-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
            <p className="text-gray-500 text-xs flex items-center gap-1">
              © 2025 SweetScoop. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by You.
            </p>
            <div className="flex gap-6">
              <a href="www.toporion.net" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="www.toporion.net" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="www.toporion.net" className="text-xs text-gray-500 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>

        </footer>
      </div>
    </div>
  );
};

export default FunkyAppFooter;