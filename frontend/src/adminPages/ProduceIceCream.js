import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Factory, FlaskConical, AlertTriangle, CheckCircle,  Package, Loader, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const ProduceIceCream = () => {
    const { register, handleSubmit, watch, reset, } = useForm();
    const [loading, setLoading] = useState(false);
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // 1. FETCH RECIPES
    const { data: recipes } = useQuery({
        queryKey: ['recipes-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/recipes');
            return res.data?.data?.recipes || res.data?.data || [];
        }
    });

    // 2. FETCH INGREDIENTS STOCK (To compare availability)
    const { data: ingredientsStock } = useQuery({
        queryKey: ['ingredients-stock-check'],
        queryFn: async () => {
            const res = await axiosSecure.get('/ingredients', { params: { limit: 1000 } }); // Fetch all
            return res.data?.data?.ingredients || [];
        }
    });

    // --- REAL-TIME CALCULATIONS ---
    const selectedRecipeId = watch("recipeId");
    const quantityToMake = watch("quantityToMake");

    const selectedRecipe = recipes?.find(r => r._id === selectedRecipeId);

    // Calculate requirements based on ratio
    // Ratio = Target Quantity / Recipe Standard Yield
    const batchRatio = (quantityToMake && selectedRecipe) 
        ? (parseFloat(quantityToMake) / selectedRecipe.outputYield) 
        : 0;

    // Check if we have enough stock for every ingredient
    let isStockSufficient = true;

    const requirementList = selectedRecipe?.ingredients.map(ing => {
        // Find current stock from the ingredients list
        const stockItem = ingredientsStock?.find(i => i._id === ing.ingredientId);
        const currentStock = stockItem?.currentStock || 0;
        
        const requiredQty = ing.quantity * batchRatio;
        const missing = currentStock < requiredQty;
        
        if (missing) isStockSufficient = false;

        return {
            name: ing.ingredientName,
            required: requiredQty,
            available: currentStock,
            unit: ing.unit,
            missing: missing
        };
    }) || [];


    const onSubmit = async (data) => {
        if (!isStockSufficient) {
            return Swal.fire({
                icon: 'error',
                title: 'Insufficient Stock',
                text: 'Please purchase missing ingredients first.',
                background: '#1a103c',
                color: '#fff'
            });
        }

        setLoading(true);
        try {
            const res = await axiosSecure.post('/production/produce', {
                recipeId: data.recipeId,
                quantityToMake: Number(data.quantityToMake)
            });

            if (res.data.success) {
                // Refresh both stock lists (Ingredients went down, Products went up)
                await queryClient.invalidateQueries(['ingredients-stock-check']);
                await queryClient.invalidateQueries(['products-list']); // We will build this list next
                
                Swal.fire({
                    title: "Production Complete!",
                    html: `Produced <b>${data.quantityToMake} ${selectedRecipe.yieldUnit}</b> of ${selectedRecipe.recipeName}.<br/>Ingredients have been deducted.`,
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
                text: error.response?.data?.message || "Production failed",
                icon: "error",
                background: '#1a103c',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Factory className="text-pink-500" /> Ice Cream Production
                </h2>
                <p className="text-slate-400 text-sm mt-1">Convert raw ingredients into finished stock.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT: PRODUCTION FORM --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* 1. Select Recipe */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Select Recipe</label>
                                <div className="relative group">
                                    <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                                    <select 
                                        {...register("recipeId", { required: "Select a recipe" })}
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:border-pink-500/50 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Choose Flavor...</option>
                                        {recipes?.map(recipe => (
                                            <option key={recipe._id} value={recipe._id}>
                                                {recipe.recipeName} (Std: {recipe.outputYield} {recipe.yieldUnit})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 2. Quantity to Make */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Production Quantity</label>
                                <div className="relative group">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                    <input 
                                        {...register("quantityToMake", { required: true, min: 1 })}
                                        type="number" 
                                        placeholder="e.g. 20" 
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                    />
                                    {selectedRecipe && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">
                                            {selectedRecipe.yieldUnit}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 3. Action Button */}
                            <button 
                                disabled={loading || !selectedRecipeId || !quantityToMake || !isStockSufficient}
                                type="submit" 
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader className="animate-spin" /> : <><Factory size={20} /> Start Production</>}
                            </button>

                        </form>
                    </div>

                    {/* Quick Stats */}
                    {selectedRecipe && quantityToMake > 0 && (
                        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-white/5 rounded-3xl p-6 text-center">
                            <h4 className="text-slate-400 text-xs uppercase font-bold tracking-widest">Estimated Yield</h4>
                            <div className="text-3xl font-black text-white mt-2">
                                {quantityToMake} <span className="text-lg font-medium text-purple-400">{selectedRecipe.yieldUnit}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Batch Ratio: {batchRatio.toFixed(2)}x</p>
                        </div>
                    )}
                </div>

                {/* --- RIGHT: INGREDIENT CHECKLIST --- */}
                <div className="lg:col-span-2 bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col h-full">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <CheckCircle className="text-emerald-500" size={20} /> Ingredient Availability
                    </h3>

                    {!selectedRecipeId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                            <Factory size={64} className="mb-4" />
                            <p>Select a recipe to verify stock</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4">
                                <div className="col-span-5">Ingredient</div>
                                <div className="col-span-3 text-center">Required</div>
                                <div className="col-span-3 text-center">Available</div>
                                <div className="col-span-1 text-right">Status</div>
                            </div>

                            <div className="space-y-2">
                                {requirementList.map((item, idx) => (
                                    <div key={idx} className={`grid grid-cols-12 items-center p-4 rounded-xl border ${item.missing ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0f0a1f] border-white/5'}`}>
                                        
                                        {/* Name */}
                                        <div className="col-span-5 font-bold text-white flex items-center gap-2">
                                            {item.name}
                                        </div>

                                        {/* Required */}
                                        <div className="col-span-3 text-center text-slate-300">
                                            {item.required.toFixed(2)} <span className="text-xs text-slate-500">{item.unit}</span>
                                        </div>

                                        {/* Available */}
                                        <div className="col-span-3 text-center">
                                            <span className={`${item.missing ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                                                {item.available}
                                            </span>
                                            <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                                        </div>

                                        {/* Status Icon */}
                                        <div className="col-span-1 flex justify-end">
                                            {item.missing ? (
                                                <XCircle className="text-red-500" size={20} />
                                            ) : (
                                                <CheckCircle className="text-emerald-500" size={20} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${isStockSufficient ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                                {isStockSufficient ? (
                                    <>
                                        <CheckCircle size={24} />
                                        <div>
                                            <p className="font-bold">Ready for Production</p>
                                            <p className="text-xs opacity-80">All ingredients are available in stock.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle size={24} />
                                        <div>
                                            <p className="font-bold">Production Blocked</p>
                                            <p className="text-xs opacity-80">Some ingredients are out of stock. Please restock.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProduceIceCream;