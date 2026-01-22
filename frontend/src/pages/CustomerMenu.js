import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChefHat, Plus, Minus, CheckCircle, Utensils, Loader, Clock, ShoppingCart } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosPublic from '../hooks/UseAxiosPublic';

const CustomerMenu = () => {
    const { tableNo } = useParams();
    const axiosPublic = UseAxiosPublic();
    
    // STATES
    const [isVerified, setIsVerified] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [tableId, setTableId] = useState(null);
    const [cart, setCart] = useState([]);
    
    // Order Tracking
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null); 
    const [orderStatus, setOrderStatus] = useState(null);

    // FETCH MENU
    const { data: menuItems, isLoading } = useQuery({
        queryKey: ['public-menu'],
        queryFn: async () => {
            const res = await axiosPublic.get('products');
            console.log('for image',res.data)
            return res.data?.data || [];
        },
        enabled: isVerified
    });

    // POLL ORDER STATUS
    useQuery({
        queryKey: ['order-status', activeOrderId],
        queryFn: async () => {
            if (!activeOrderId) return null;
            const res = await axiosPublic.get(`/table/order/status/${activeOrderId}`);
            console.log('order status',res)
            setOrderStatus(res.data.status); 
            return res.data.status;
        },
        enabled: !!activeOrderId && orderStatus !== 'Confirmed', 
        refetchInterval: 3000 
    });

    // VERIFY PASSCODE
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosPublic.post('/table/verify', { tableNo: Number(tableNo), passcode });
            if (res.data.success) {
                setIsVerified(true);
                setTableId(res.data.tableId);
                const Toast = Swal.mixin({ toast: true, position: 'top', timer: 2000, showConfirmButton: false });
                Toast.fire({ icon: 'success', title: `Unlocked Table ${tableNo}` });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Access Denied', text: 'Wrong passcode.' });
        }
    };

    // CART LOGIC
    const addToCart = (item) => {
        const existing = cart.find(c => c.productId === item._id);
        if (existing) {
            setCart(cart.map(c => c.productId === item._id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { productId: item._id, productName: item.productName, price: item.sellingPrice, image: item.image, quantity: 1 }]);
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

    const handlePlaceOrder = async () => {
        if(cart.length === 0) return;
        try {
            const orderData = { tableId, tableNo: Number(tableNo), items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })) };
            const res = await axiosPublic.post('/table/order/place', orderData);
            if(res.data.success) {
                setActiveOrderId(res.data.data._id);
                setOrderStatus('Pending');
                setCart([]);
                setIsOrderPlaced(true);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not send order.' });
        }
    };

    // --- SCREEN 1: LOCKED ---
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-[#1a103c] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white/10 p-4 rounded-full mb-6 ring-4 ring-pink-500/30 animate-pulse">
                    <Utensils size={48} className="text-pink-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Table {tableNo}</h1>
                <p className="text-slate-400 mb-8">Enter the 4-digit code from the sticker.</p>
                <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                    <input type="text" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="w-full bg-[#0f0a1f] border border-white/20 rounded-xl py-4 text-white text-center text-xl font-bold tracking-widest focus:outline-none focus:border-pink-500" />
                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg">Unlock Menu</button>
                </form>
            </div>
        );
    }

    // --- SCREEN 2: ORDER STATUS ---
    if (isOrderPlaced) {
        return (
            <div className="min-h-screen bg-[#1a103c] flex flex-col items-center justify-center p-8 text-center ">
                {orderStatus === 'Pending' ? (
                    <>
                        <Clock size={80} className="text-orange-400 mb-6 animate-pulse" />
                        <h2 className="text-3xl font-bold text-white mb-2">Order Sent!</h2>
                        <p className="text-slate-400 mb-8">Waiting for kitchen confirmation...</p>
                        <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full"><Loader size={16} className="animate-spin" /><span>Waiting...</span></div>
                    </>
                ) : (
                    <>
                        <CheckCircle size={100} className="text-emerald-500 mb-6" />
                        <h2 className="text-4xl font-black text-white mb-4">Confirmed!</h2>
                        <p className="text-emerald-400 font-bold text-lg mb-8">Your food is being prepared.</p>
                        <button onClick={() => { setIsOrderPlaced(false); setActiveOrderId(null); setOrderStatus(null); }} className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold">Order More</button>
                    </>
                )}
            </div>
        );
    }

    // --- SCREEN 3: MENU GRID (THE NEW DESIGN) ---
    return (
        <div className="min-h-screen bg-[#0f0a1f] pb-32 py-24">
            
            {/* Navbar */}
            <div className="sticky top-0 z-20 bg-[#1a103c]/90 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <ChefHat className="text-pink-500" size={24} />
                    <h2 className="text-lg font-bold text-white">Ice Cream Bar</h2>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">Table {tableNo}</div>
            </div>

            {/* PRODUCT GRID */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isLoading ? <p className="text-white col-span-full text-center mt-10">Loading menu...</p> : 
                    menuItems.map(item => {
                        const inCart = cart.find(c => c.productId === item._id);
                        return (
                            <div key={item._id} className="bg-[#1a103c] rounded-2xl overflow-hidden border border-white/5 shadow-lg flex flex-col relative group">
                                
                                {/* Image Area */}
                                <div className="h-32 md:h-48 w-full bg-white/5 relative overflow-hidden">
                                    <img 
                                        src={item.image || "https://via.placeholder.com/300?text=Ice+Cream"} 
                                        alt={item.productName} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Price Badge */}
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold px-2 py-1 rounded-lg border border-white/10">
                                        ${item.sellingPrice}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 className="font-bold text-white text-sm md:text-base line-clamp-1 mb-1">{item.productName}</h3>
                                    <p className="text-slate-500 text-xs mb-3">{item.unit}</p>
                                    
                                    <div className="mt-auto">
                                        {inCart ? (
                                            <div className="flex items-center justify-between bg-[#0f0a1f] rounded-xl p-1 border border-white/10">
                                                <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg"><Minus size={14}/></button>
                                                <span className="font-bold text-white text-sm">{inCart.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg"><Plus size={14}/></button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-1"
                                            >
                                                <Plus size={14} /> Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* FLOATING CART (Bottom) */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-[#0f0a1f] to-transparent">
                    <button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex justify-between items-center hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-black/20 w-10 h-10 rounded-full flex items-center justify-center font-bold relative">
                                {cartCount}
                                <ShoppingCart size={16} className="absolute opacity-20" />
                            </div>
                            <div className="text-left leading-tight">
                                <span className="block font-bold text-sm">Send Order</span>
                                <span className="block text-xs opacity-80">Kitchen is waiting</span>
                            </div>
                        </div>
                        <span className="font-black text-xl">${cartTotal.toFixed(2)}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerMenu;