import React, { useState, useContext } from 'react'; // Added useContext
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, Eye, EyeOff, Heart, Chrome, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../authProvider/AuthProvider'; // Import AuthContext

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    
    // 1. GET THE LOGIN FUNCTION FROM CONTEXT
    const { loginUser } = useContext(AuthContext);

    const onSubmit = async (data) => {
        // 2. Call the Context function, NOT axios directly
        const result = await loginUser(data.email, data.password);

        // 3. Check the result returned by AuthProvider
        if (result.success) {
            Swal.fire({
                title: "Welcome Back!",
                text: "Login Successful!",
                icon: "success",
                timer: 1500,
                showConfirmButton: true
            }).then(() => {
                navigate('/');
            });
        } else {
            // Handle Login Fail
            Swal.fire({
                title: "Login Failed",
                text: result.message || "Please check your email or password",
                icon: "error"
            });
        }
    };

    // ... UI REMAINS EXACTLY THE SAME BELOW ...
    return (
        <div className="relative w-full h-[100dvh] bg-[#1a0b2e] mt-6 overflow-hidden flex flex-col items-center justify-center font-sans text-white selection:bg-pink-500 selection:text-white">

            {/* --- 1. YUMMY BACKGROUND EFFECTS --- */}
            <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-yellow-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-blob"></div>
            <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-pink-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[30%] left-[20%] w-60 h-60 bg-cyan-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-30 animate-blob animation-delay-4000"></div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
                <svg className="relative block w-[calc(100%+1.3px)] h-[150px] md:h-[250px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-pink-900/40"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V120H0Z" className="fill-pink-600/30"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V120H0Z" className="fill-[#2a1b3d]"></path>
                </svg>
            </div>

            {/* --- 2. GLASS CARD --- */}
            <div className="relative z-10 w-full max-w-sm md:max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 md:rounded-[2.5rem] flex flex-col gap-6 overflow-hidden mb-10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/30 rounded-full blur-2xl pointer-events-none"></div>

                <div className="text-center space-y-2 mt-4 md:mt-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-2xl shadow-lg mb-4 transform rotate-6 hover:rotate-12 transition-transform duration-300">
                        <Heart className="w-8 h-8 text-white fill-white animate-beat" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">Welcome Back</h2>
                    <p className="text-white/60 text-sm font-medium">Craving something sweet? Log in now!</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
                    <div className="space-y-1">
                        <div className="group relative">
                            <div className="absolute left-4 top-4 text-pink-400 group-focus-within:text-yellow-300 transition-colors duration-300">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Your tasty email..."
                                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:bg-black/40 focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300"
                                {...register("email", { required: "Email is needed!" })}
                            />
                        </div>
                        {errors.email && <p className="text-pink-400 text-xs pl-4 font-bold animate-shake">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="group relative">
                            <div className="absolute left-4 top-4 text-cyan-400 group-focus-within:text-yellow-300 transition-colors duration-300">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Shhh... secret code"
                                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/30 outline-none focus:bg-black/40 focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
                                {...register("password", { required: "Password is needed!" })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="flex justify-between items-center px-2">
                            {errors.password ? (
                                <p className="text-pink-400 text-xs font-bold animate-shake">{errors.password.message}</p>
                            ) : <span></span>}
                            <a href="#" className="text-xs text-cyan-300 hover:text-cyan-100 hover:underline decoration-wavy decoration-pink-500 transition-colors">Forgot Password?</a>
                        </div>
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_10px_40px_rgba(6,182,212,0.5)] transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                    >
                        {isSubmitting ? (
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
                            </div>
                        ) : (
                            <>
                                Let's Go <LogIn className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">Or Taste With</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button type="button" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 transition-all flex items-center justify-center group">
                            <Chrome className="w-5 h-5 text-white/70 group-hover:text-white" />
                        </button>
                        <button type="button" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 transition-all flex items-center justify-center group">
                            <Facebook className="w-5 h-5 text-white/70 group-hover:text-blue-400" />
                        </button>
                    </div>
                </form>

                <p className="text-center text-white/40 text-sm mt-4">
                    New to the sweet life? <br />
                    <a href="/signup" className="text-yellow-400 font-bold hover:text-yellow-200 transition-colors ml-1">
                        Create an account
                    </a>
                </p>
            </div>
            <div className="h-safe-bottom md:hidden"></div>
        </div>
    );
};

export default Login;