import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Camera, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

import UseAxiosPublic from '../hooks/UseAxiosPublic';

const Signup = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const axiosPublic=UseAxiosPublic()
    
    // React Hook Form setup
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
    
        reset
    } = useForm();

 

    // Handle Image Preview Logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Submit Handler (Connects to your Mongoose Backend)
    const onSubmit = async (data) => {
        // Create FormData because we are uploading an image
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        // formData.append('role', 'user'); // Default handled by Mongoose, or add here
        if (data.profileImage[0]) {
            formData.append('profileImage', data.profileImage[0]);
        }

        console.log("Form Data Ready for Backend:", Object.fromEntries(formData));
        
        // Simulate API Call
        try{
            const res=await axiosPublic.post('register',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }

            })
            reset();
            setPreviewImage(null);
            console.log("Signup Success:", res.data);
        }catch(error){
            console.error("Signup Error:", error);
        }
    };

    return (
        <div className="relative w-full h-[100dvh] bg-[#0f0c29] overflow-hidden flex flex-col items-center justify-center font-sans">
            
            {/* --- 1. ANIMATED BACKGROUND BLOBS --- */}
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse delay-1000"></div>
            <div className="absolute top-[40%] left-[30%] w-60 h-60 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-bounce-slow"></div>

            {/* --- 2. THE APP CONTAINER (Glass Card) --- */}
            <div className="relative z-10 w-full max-w-md h-full md:h-auto md:rounded-[3rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col p-8 overflow-y-auto no-scrollbar">
                
                {/* Header */}
                <div className="text-center mb-6 mt-4 md:mt-0">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-xs font-bold text-white tracking-widest uppercase">New Member</span>
                    </div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-200">
                        Join the Club
                    </h2>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">
                    
                    {/* --- A. PROFILE IMAGE UPLOAD (Funky Style) --- */}
                    <div className="flex justify-center mb-2">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500">
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-500" />
                                    )}
                                    
                                    {/* Overlay for Hover/Empty */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${previewImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                        <Camera className="w-8 h-8 text-white/80" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                {...register("profileImage", { 
                                    onChange: handleImageChange 
                                })}
                            />
                            
                            {/* Floating Plus Icon */}
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-cyan-500 rounded-full border-4 border-[#0f0c29] flex items-center justify-center pointer-events-none">
                                <span className="text-white font-bold text-lg leading-none mb-1">+</span>
                            </div>
                        </div>
                    </div>

                    {/* --- B. INPUT FIELDS (Glassmorphism) --- */}
                    
                    {/* Name Field */}
                    <div className="space-y-1">
                        <div className={`group relative transition-all duration-300 ${errors.name ? 'animate-shake' : ''}`}>
                            <div className="absolute left-4 top-4 text-pink-300 group-focus-within:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="What should we call you?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:border-pink-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all"
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs pl-4 font-medium">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                        <div className="group relative">
                            <div className="absolute left-4 top-4 text-pink-300 group-focus-within:text-white transition-colors">
                                <Mail size={20} />
                            </div>
                            <input 
                                type="email" 
                                placeholder="coolkid@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs pl-4 font-medium">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <div className="group relative">
                            <div className="absolute left-4 top-4 text-pink-300 group-focus-within:text-white transition-colors">
                                <Lock size={20} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Secret Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/30 outline-none focus:border-cyan-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Must be at least 6 chars" }
                                })}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs pl-4 font-medium">{errors.password.message}</p>}
                    </div>

                    {/* --- C. SUBMIT BUTTON (Neon Gradient) --- */}
                    <button 
                        disabled={isSubmitting}
                        className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-purple-500/30 transform transition-all active:scale-95 hover:brightness-110 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                           <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
                        ) : (
                            <>
                                Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-white/50 text-sm mt-8">
                    Already have a squad? <br/>
                    <a href="/login" className="text-white font-bold underline decoration-pink-500 decoration-2 underline-offset-4 hover:text-pink-300 transition-colors">
                        Log in here
                    </a>
                </p>

            </div>
            
            {/* Mobile Safe Area Padding */}
            <div className="h-safe-bottom md:hidden"></div>
        </div>
    );
};

export default Signup;