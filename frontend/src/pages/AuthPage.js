import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, IceCream, Chrome } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex bg-[#fff5f7] relative overflow-hidden">
      
      {/* --- Background Blobs for that Funky Vibe --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* --- LEFT SIDE: Visuals (Hidden on Mobile) --- */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative z-10 p-12">
        <div className="relative w-full max-w-md">
            {/* Floating Ice Cream Card */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <IceCream size={120} />
                </div>
                <h2 className="text-4xl font-black text-gray-800 mb-4">
                    {isLogin ? "Welcome Back!" : "Join the Squad"}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {isLogin 
                        ? "Your taste buds have been missing us. Log in to track your orders and earn points." 
                        : "Sign up today and get your first scoop 50% off! Life is too short for bad ice cream."
                    }
                </p>
                <div className="w-full h-48 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-500 shadow-inner flex items-center justify-center">
                    <span className="text-white font-bold text-2xl animate-pulse">
                        {isLogin ? "🍦 Ready to Scoop?" : "🎉 Let's Party!"}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: The Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white p-8 md:p-12 rounded-3xl shadow-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-pink-100 rounded-full mb-4">
                <User className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
                {isLogin ? "Member Login" : "Create Account"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
                Enter your details to get your sugar fix.
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-6">
            
            {/* Name Field (Only for Signup) */}
            {!isLogin && (
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        placeholder="hello@example.com" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
                <div className="flex justify-end">
                    <a href="www.toporion.net" className="text-sm font-semibold text-pink-500 hover:text-pink-600">Forgot Password?</a>
                </div>
            )}

            {/* Submit Button */}
            <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2">
                {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Login */}
            <button type="button" className="w-full py-3 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Chrome className="w-5 h-5 text-blue-500" /> Google
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"} 
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 font-bold text-pink-500 hover:underline"
                >
                    {isLogin ? "Sign Up" : "Log In"}
                </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;