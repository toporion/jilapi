import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShoppingCart, DollarSign, Package, User, Calculator, Save, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // 1. Import useQueryClient
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const PurchaseIngredient = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient(); // 2. Initialize Client

    // FETCH INGREDIENTS
    const { data: ingredientsData } = useQuery({
        queryKey: ['ingredients-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/ingredients', { params: { limit: 100 } });
            return res.data?.data?.ingredients || [];
        }
    });

    const quantity = watch("quantity");
    const unitPrice = watch("unitPrice");
    const selectedId = watch("ingredientId");

    const selectedItem = ingredientsData?.find(item => item._id === selectedId);
    const totalCost = (parseFloat(quantity || 0) * parseFloat(unitPrice || 0)).toFixed(2);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const purchaseData = {
                ingredientId: data.ingredientId,
                supplier: data.supplier,
                quantity: Number(data.quantity),
                unitPrice: Number(data.unitPrice)
            };

            const res = await axiosSecure.post('/ingredient/purchase', purchaseData);

            if (res.data.success) {
                // 3. THIS IS THE FIX: Force re-fetch of the ingredients list
                await queryClient.invalidateQueries(['ingredients-list']);

                Swal.fire({
                    title: "Purchase Successful!",
                    html: `
                        <div class="text-left text-sm">
                            <p>Added <b>${data.quantity}</b> to stock.</p>
                            <p>New Average Cost: <b>$${res.data.avgCostPerUnit.toFixed(2)}</b></p>
                        </div>
                    `,
                    icon: "success",
                    background: '#1a103c',
                    color: '#fff',
                    confirmButtonColor: "#db2777"
                });
                reset();
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Purchase failed",
                icon: "error",
                background: '#1a103c',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="text-pink-500" /> Purchase Stock
                </h2>
                <p className="text-slate-400 text-sm mt-1">Record new inventory purchases from suppliers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* --- LEFT: PURCHASE FORM --- */}
                <div className="md:col-span-2 bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* 1. Select Ingredient */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Select Ingredient</label>
                            <div className="relative group">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                                <select 
                                    {...register("ingredientId", { required: "Please select an item" })}
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:border-pink-500/50 focus:outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Choose item to buy...</option>
                                    {ingredientsData?.map(item => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} ({item.itemCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.ingredientId && <span className="text-red-400 text-xs ml-2">{errors.ingredientId.message}</span>}
                        </div>

                        {/* 2. Supplier Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Supplier Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                <input 
                                    {...register("supplier", { required: "Supplier is required" })}
                                    type="text" 
                                    placeholder="e.g. Fresh Dairy Co." 
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 3. Quantity & Unit Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Quantity</label>
                                <div className="relative group">
                                    <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                    <input 
                                        {...register("quantity", { required: true, min: 1 })}
                                        type="number" 
                                        step="0.01"
                                        placeholder="0.00" 
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-purple-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Unit Price ($)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input 
                                        {...register("unitPrice", { required: true, min: 0.1 })}
                                        type="number" 
                                        step="0.01"
                                        placeholder="0.00" 
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader className="animate-spin" /> : <><Save size={20} /> Confirm Purchase</>}
                        </button>

                    </form>
                </div>

                {/* --- RIGHT: LIVE INFO CARD --- */}
                <div className="space-y-4">
                    
                    <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                        {selectedItem ? (
                            <>
                                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-500 mb-3">
                                    <img 
                                        src={selectedItem.image || "https://via.placeholder.com/100"} 
                                        alt={selectedItem.name} 
                                        className="w-full h-full object-cover rounded-full border-4 border-[#1a103c]"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                                <p className="text-slate-400 text-sm mb-4">{selectedItem.itemCode}</p>
                                
                                <div className="w-full bg-white/5 rounded-xl p-3 mb-2">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Current Stock</p>
                                    <p className="text-lg font-bold text-white">{selectedItem.currentStock} {selectedItem.unit}</p>
                                </div>
                                <div className="w-full bg-white/5 rounded-xl p-3">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Old Avg Cost</p>
                                    <p className="text-lg font-bold text-slate-300">${selectedItem.avgCostPerUnit?.toFixed(2)}</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center">
                                <Package size={48} className="opacity-20 mb-2" />
                                <p>Select an item to see details</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6">
                        <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Total Payable</p>
                        <h3 className="text-4xl font-black text-white tracking-tight">${totalCost}</h3>
                        <p className="text-xs text-slate-400 mt-2">Calculated automatically</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PurchaseIngredient;