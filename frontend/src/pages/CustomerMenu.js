import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock, ChefHat, Plus, Minus, CheckCircle, Utensils, Loader, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosPublic from '../hooks/UseAxiosPublic';

const CustomerMenu = () => {
    const { tableNo } = useParams();
    const axiosPublic = UseAxiosPublic();
    
    // --- STATES ---
    const [isVerified, setIsVerified] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [tableId, setTableId] = useState(null);
    const [cart, setCart] = useState([]);
    
    // Order Tracking States
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null); 
    const [orderStatus, setOrderStatus] = useState(null); // 'Pending', 'Confirmed'

    // 1. FETCH MENU (Only after verification)
    const { data: menuItems, isLoading } = useQuery({
        queryKey: ['public-menu'],
        queryFn: async () => {
            const res = await axiosPublic.get('/table/menu/list');
            return res.data?.data || [];
        },
        enabled: isVerified
    });

    // 2. POLL ORDER STATUS (Runs every 3 seconds if order is pending)
    useQuery({
        queryKey: ['order-status', activeOrderId],
        queryFn: async () => {
            if (!activeOrderId) return null;
            const res = await axiosPublic.get(`/table/order/status/${activeOrderId}`);
            setOrderStatus(res.data.status); 
            return res.data.status;
        },
        // Only run if we have an Order ID and it's NOT confirmed yet
        enabled: !!activeOrderId && orderStatus !== 'Confirmed', 
        refetchInterval: 3000 
    });

    // 3. VERIFY PASSCODE
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosPublic.post('/table/verify', {
                tableNo: Number(tableNo),
                passcode
            });

            if (res.data.success) {
                setIsVerified(true);
                setTableId(res.data.tableId);
                const Toast = Swal.mixin({ toast: true, position: 'top', timer: 2000, showConfirmButton: false });
                Toast.fire({ icon: 'success', title: `Unlocked Table ${tableNo}` });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({ icon: 'error', title: 'Wrong Passcode', text: 'Check the sticker on the table.' });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Could not connect to server.' });
            }
        }
    };

    // 4. CART LOGIC
    const addToCart = (item) => {
        const existing = cart.find(c => c.productId === item._id);
        if (existing) {
            setCart(cart.map(c => c.productId === item._id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { productId: item._id, productName: item.productName, price: item.sellingPrice, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        const existing = cart.find(c => c.productId === id);
        if (existing.quantity === 1) {
            setCart(cart.filter(c => c.productId !== id));
        } else {
            setCart(cart.map(c => c.productId === id ? { ...c, quantity: c.quantity - 1 } : c));
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // 5. PLACE ORDER
    const handlePlaceOrder = async () => {
        if(cart.length === 0) return;
        try {
            const orderData = {
                tableId, 
                tableNo: Number(tableNo),
                items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
            };
            const res = await axiosPublic.post('/table/order/place', orderData);
            
            if(res.data.success) {
                setActiveOrderId(res.data.data._id); // Save ID for tracking
                setOrderStatus('Pending');           // Start waiting
                setCart([]);
                setIsOrderPlaced(true);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not send order. Try again.' });
        }
    };

    // --- RENDER 1: LOCKED SCREEN ---
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-[#1a103c] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white/10 p-4 rounded-full mb-6 ring-4 ring-pink-500/30 animate-pulse">
                    <Utensils size={48} className="text-pink-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Table {tableNo}</h1>
                <p className="text-slate-400 mb-8">Enter the 4-digit code from the sticker.</p>
                
                <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Passcode" 
                            className="w-full bg-[#0f0a1f] border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white text-center text-xl font-bold tracking-widest focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform">
                        Unlock Menu
                    </button>
                </form>
            </div>
        );
    }

    // --- RENDER 2: ORDER STATUS SCREEN (Pending vs Confirmed) ---
    if (isOrderPlaced) {
        return (
            <div className="min-h-screen bg-[#1a103c] flex flex-col items-center justify-center p-8 text-center transition-all duration-500">
                
                {orderStatus === 'Pending' ? (
                    /* STATE A: WAITING FOR KITCHEN */
                    <>
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 animate-pulse"></div>
                            <Clock size={80} className="text-orange-400 relative z-10 animate-bounce-slow" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Order Sent!</h2>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                            Please wait while the kitchen confirms your order...
                        </p>
                        <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                            <Loader size={16} className="animate-spin" />
                            <span className="text-sm font-bold uppercase tracking-wider">Waiting for Staff</span>
                        </div>
                    </>
                ) : (
                    /* STATE B: CONFIRMED */
                    <>
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-30"></div>
                            <CheckCircle size={100} className="text-emerald-500 relative z-10 animate-in zoom-in duration-300" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4">Confirmed!</h2>
                        <div className="bg-[#0f0a1f] p-6 rounded-2xl border border-white/10 shadow-xl mb-8 w-full max-w-sm">
                            <p className="text-slate-300 text-sm mb-2">Order ID #{activeOrderId?.slice(-6)}</p>
                            <p className="text-emerald-400 font-bold text-lg">Your food is being prepared.</p>
                            <div className="h-px bg-white/10 my-4"></div>
                            <p className="text-white text-sm">
                                Please head to the counter to <span className="text-pink-400 font-bold">Pay & Collect</span>.
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setIsOrderPlaced(false);
                                setActiveOrderId(null);
                                setOrderStatus(null);
                            }} 
                            className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                        >
                            Order More Items
                        </button>
                    </>
                )}
            </div>
        );
    }

    // --- RENDER 3: MAIN MENU ---
    return (
        <div className="min-h-screen bg-[#0f0a1f] pb-32">
            
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#1a103c]/90 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <ChefHat className="text-pink-500" size={24} />
                    <h2 className="text-lg font-bold text-white">Menu</h2>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">Table {tableNo}</div>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <p className="text-white text-center mt-10">Loading flavors...</p>
                ) : (
                    menuItems.map(item => {
                        const inCart = cart.find(c => c.productId === item._id);
                        return (
                            <div key={item._id} className="bg-[#1a103c] rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-md">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{item.productName}</h3>
                                    <p className="text-emerald-400 font-bold">${item.sellingPrice}</p>
                                </div>
                                
                                {inCart ? (
                                    <div className="flex items-center gap-3 bg-[#0f0a1f] rounded-lg p-1 border border-white/10">
                                        <button onClick={() => removeFromCart(item._id)} className="p-2 text-white"><Minus size={16}/></button>
                                        <span className="font-bold text-white w-4 text-center">{inCart.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="p-2 text-white"><Plus size={16}/></button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => addToCart(item)}
                                        className="bg-pink-600 hover:bg-pink-500 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f0a1f] via-[#0f0a1f] to-transparent z-30">
                    <button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-black/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">{cartCount}</div>
                            <span className="font-bold text-lg">Send to Kitchen</span>
                        </div>
                        <span className="font-black text-xl">${cartTotal.toFixed(2)}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerMenu;