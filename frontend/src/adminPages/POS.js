import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Trash2, CreditCard, Search, Package, Plus, Minus, X, ChefHat, Bell } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const POS = () => {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    
    // NEW STATE: Track if this cart belongs to a specific table order (to close it later)
    const [activeTableOrderId, setActiveTableOrderId] = useState(null); 
    const [showTableOrders, setShowTableOrders] = useState(false); // Toggle the orders list

    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // 1. FETCH PRODUCTS
    const { data: products } = useQuery({
        queryKey: ['pos-products'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data?.data?.filter(p => p.currentStock > 0 && p.sellingPrice > 0) || [];
        }
    });

    // 2. FETCH CONFIRMED TABLE ORDERS (Ready to Pay)
    const { data: tableOrders } = useQuery({
        queryKey: ['pos-table-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/table/orders/live');
            // Filter only 'Confirmed' orders (Kitchen accepted them)
            return res.data?.data?.filter(o => o.status === 'Confirmed') || [];
        },
        refetchInterval: 5000 // Auto check for new ready tables
    });

    // --- CART ACTIONS ---
    const addToCart = (product) => {
        const existing = cart.find(item => item.productId === product._id);
        if (existing) {
            if (existing.quantity + 1 > product.currentStock) {
                return Swal.fire({ icon: 'error', title: 'Stock Limit', toast: true, position: 'top', timer: 1500, showConfirmButton: false });
            }
            setCart(cart.map(item => item.productId === product._id 
                ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice } 
                : item
            ));
        } else {
            setCart([...cart, {
                productId: product._id,
                productName: product.productName,
                quantity: 1,
                unitPrice: product.sellingPrice,
                totalPrice: product.sellingPrice,
                maxStock: product.currentStock 
            }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.productId !== id));

    const updateQty = (id, change) => {
        setCart(cart.map(item => {
            if (item.productId === id) {
                const newQty = item.quantity + change;
                if (newQty < 1) return item; 
                if (newQty > item.maxStock) return item;
                return { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice };
            }
            return item;
        }));
    };

    // --- NEW: LOAD TABLE INTO CART ---
    const loadTableOrder = (order) => {
        // 1. Convert Table Items to Cart Format
        const formattedItems = order.items.map(item => ({
            productId: item.productId, // Ensure backend provides this ID populated or stored
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            maxStock: 999 // We assume stock checked by kitchen, but safer to fetch real stock if needed
        }));

        setCart(formattedItems);
        setActiveTableOrderId(order._id); // Remember this ID so we can close it
        setShowTableOrders(false); // Close modal
        Swal.fire({ 
            icon: 'success', 
            title: `Table ${order.tableNo} Loaded`, 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 1500 
        });
    };

    // --- CHECKOUT ---
    const grandTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            // 1. Process the Sale (Deduct Stock, Record Revenue)
            const saleData = { items: cart, paymentMethod: 'Cash', totalAmount: grandTotal };
            const res = await axiosSecure.post('/sales/checkout', saleData);
            
            if (res.data.success) {
                
                // 2. IF this was a Table Order, mark it as 'Completed' so it disappears
                if (activeTableOrderId) {
                    await axiosSecure.put('/table/order/status', { 
                        orderId: activeTableOrderId, 
                        status: 'Completed' 
                    });
                }

                // 3. Cleanup
                await queryClient.invalidateQueries(['pos-products']);
                await queryClient.invalidateQueries(['pos-table-orders']);
                
                Swal.fire({
                    title: "Paid!",
                    text: `Invoice #${res.data.invoiceNo}`,
                    icon: "success",
                    background: '#1a103c',
                    color: '#fff',
                    confirmButtonColor: "#db2777"
                });
                setCart([]);
                setActiveTableOrderId(null);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message });
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products?.filter(p => p.productName.toLowerCase().includes(search.toLowerCase())) || [];

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] relative">
            
            {/* --- LEFT: PRODUCTS --- */}
            <div className="flex-1 flex flex-col gap-4 h-full">
                <div className="bg-[#1a103c]/90 backdrop-blur-md p-4 sticky top-0 z-10 rounded-xl flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 px-2 pb-24 lg:pb-0 lg:overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div 
                                key={product._id} 
                                onClick={() => addToCart(product)}
                                className="bg-[#1a103c]/60 border border-white/5 active:border-pink-500 rounded-2xl p-4 cursor-pointer active:scale-95 transition-all flex flex-col justify-between min-h-[140px]"
                            >
                                <div>
                                    <h3 className="font-bold text-white text-sm lg:text-base line-clamp-2">{product.productName}</h3>
                                    <p className="text-slate-500 text-xs mt-1">{product.currentStock} left</p>
                                </div>
                                <div className="mt-3 flex justify-between items-end">
                                    <span className="text-lg font-bold text-emerald-400">${product.sellingPrice}</span>
                                    <Plus size={20} className="text-pink-500"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CART SIDEBAR --- */}
            <div className="hidden lg:flex w-96 bg-[#1a103c] border-l border-white/10 flex-col h-full rounded-l-3xl shadow-2xl relative">
                
                {/* Header with Table Toggle */}
                <div className="p-4 border-b border-white/10 bg-[#0f0a1f]/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart className="text-pink-500"/> Current Bill</h2>
                    
                    {/* BUTTON TO SHOW TABLES */}
                    <button 
                        onClick={() => setShowTableOrders(!showTableOrders)}
                        className="relative bg-white/10 p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
                    >
                        {showTableOrders ? <X size={20}/> : <Bell size={20} className={tableOrders?.length > 0 ? 'text-orange-400 animate-pulse' : 'text-slate-400'} />}
                        {tableOrders?.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {tableOrders.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* --- TABLE ORDER LIST (Overlay) --- */}
                {showTableOrders && (
                    <div className="absolute top-16 left-0 right-0 bottom-0 bg-[#1a103c] z-20 p-4 overflow-y-auto animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <ChefHat className="text-orange-400"/> Ready for Payment
                        </h3>
                        <div className="space-y-3">
                            {tableOrders?.length === 0 ? (
                                <p className="text-slate-500 text-center mt-10">No tables waiting.</p>
                            ) : (
                                tableOrders.map(order => (
                                    <div key={order._id} onClick={() => loadTableOrder(order)} className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-white text-lg">Table {order.tableNo}</span>
                                            <span className="text-emerald-400 font-bold">${order.totalAmount}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{order.items.length} items • {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.map(item => (
                        <div key={item.productId} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-bold text-white text-sm line-clamp-1">{item.productName}</h4>
                                <div className="text-emerald-400 text-xs font-mono">${item.totalPrice.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#0f0a1f] rounded-lg p-1">
                                <button onClick={() => updateQty(item.productId, -1)} className="p-1 text-white"><Minus size={14}/></button>
                                <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQty(item.productId, 1)} className="p-1 text-white"><Plus size={14}/></button>
                            </div>
                            <button onClick={() => removeFromCart(item.productId)} className="ml-2 text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    {cart.length === 0 && !showTableOrders && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                            <Package size={48} className="mb-4" />
                            <p>Cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Checkout Footer */}
                <div className="p-6 bg-[#0f0a1f] border-t border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total</span>
                        <span className="text-3xl font-black text-white">${grandTotal.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : <><CreditCard/> Charge ${grandTotal.toFixed(2)}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;