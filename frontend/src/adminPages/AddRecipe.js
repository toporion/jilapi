import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, ChefHat, Scale, FlaskConical, FileText, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const AddRecipe = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const axiosSecure = UseAxiosSecure();

    // --- 1. STATE FOR DYNAMIC INGREDIENTS ---
    // We start with one empty row
    const [ingredientRows, setIngredientRows] = useState([
        { ingredientId: '', ingredientName: '', quantity: '', unit: '' }
    ]);

    // --- 2. FETCH INGREDIENTS (For Dropdown) ---
    const { data: ingredientsList } = useQuery({
        queryKey: ['ingredients-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/ingredients', { params: { limit: 100 } });
            return res.data?.data?.ingredients || [];
        }
    });

    // --- 3. ROW HANDLERS ---
    const addRow = () => {
        setIngredientRows([...ingredientRows, { ingredientId: '', ingredientName: '', quantity: '', unit: '' }]);
    };

    const removeRow = (index) => {
        const newRows = [...ingredientRows];
        newRows.splice(index, 1);
        setIngredientRows(newRows);
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...ingredientRows];
        
        if (field === 'ingredientId') {
            // Special logic: If ID changes, also find and set the Name
            const selectedItem = ingredientsList.find(item => item._id === value);
            newRows[index].ingredientId = value;
            newRows[index].ingredientName = selectedItem ? selectedItem.name : '';
            // Auto-fill unit if available (optional UX improvement)
            if(selectedItem) newRows[index].unit = selectedItem.unit;
        } else {
            newRows[index][field] = value;
        }
        
        setIngredientRows(newRows);
    };

    // --- 4. SUBMIT HANDLER ---
    const onSubmit = async (data) => {
        // Validation: Ensure at least one ingredient is added
        const validIngredients = ingredientRows.filter(row => row.ingredientId && row.quantity);
        
        if (validIngredients.length === 0) {
            return Swal.fire({
                title: "Error",
                text: "Please add at least one ingredient.",
                icon: "warning",
                background: '#1a103c',
                color: '#fff'
            });
        }

        setLoading(true);
        try {
            const recipeData = {
                recipeName: data.recipeName,
                outputYield: Number(data.outputYield),
                yieldUnit: data.yieldUnit,
                instructions: data.instructions,
                ingredients: validIngredients.map(row => ({
                    ingredientId: row.ingredientId,
                    ingredientName: row.ingredientName,
                    quantity: Number(row.quantity),
                    unit: row.unit
                }))
            };

            const res = await axiosSecure.post('recipe/add', recipeData);

            if (res.data.success) {
                Swal.fire({
                    title: "Recipe Created!",
                    text: `${data.recipeName} is ready for production.`,
                    icon: "success",
                    background: '#1a103c',
                    color: '#fff',
                    confirmButtonColor: "#db2777"
                });
                reset();
                setIngredientRows([{ ingredientId: '', ingredientName: '', quantity: '', unit: '' }]);
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to create recipe",
                icon: "error",
                background: '#1a103c',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ChefHat className="text-pink-500" /> New Recipe
                </h2>
                <p className="text-slate-400 text-sm mt-1">Define how to make your ice cream flavors.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* --- CARD 1: BASIC INFO --- */}
                <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Recipe Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Recipe Name</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                                <input 
                                    {...register("recipeName", { required: "Name is required" })}
                                    type="text" 
                                    placeholder="e.g. Chocolate Master Batch" 
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500/50 focus:outline-none transition-all"
                                />
                            </div>
                            {errors.recipeName && <span className="text-red-400 text-xs ml-2">{errors.recipeName.message}</span>}
                        </div>

                        {/* Yield (Output) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Output Yield</label>
                                <div className="relative group">
                                    <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                    <input 
                                        {...register("outputYield", { required: true })}
                                        type="number" 
                                        placeholder="10" 
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Unit</label>
                                <select 
                                    {...register("yieldUnit", { required: true })}
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer"
                                >
                                    <option value="LTR">Liters (LTR)</option>
                                    <option value="KG">Kilograms (KG)</option>
                                    <option value="TUB">Tubs</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CARD 2: INGREDIENTS TABLE --- */}
                <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Scale size={20} className="text-purple-500"/> Ingredients Required
                        </h3>
                        <button 
                            type="button"
                            onClick={addRow}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors border border-white/10"
                        >
                            <Plus size={16} /> Add Row
                        </button>
                    </div>

                    <div className="space-y-3">
                        {ingredientRows.map((row, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-[#0f0a1f]/50 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                                
                                <span className="text-slate-500 font-mono text-xs w-6">{index + 1}.</span>
                                
                                {/* Select Ingredient */}
                                <div className="flex-1 w-full">
                                    <select 
                                        value={row.ingredientId}
                                        onChange={(e) => handleRowChange(index, 'ingredientId', e.target.value)}
                                        className="w-full bg-[#1a103c] border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-purple-500/50 focus:outline-none"
                                    >
                                        <option value="">Select Raw Material...</option>
                                        {ingredientsList?.map(item => (
                                            <option key={item._id} value={item._id}>{item.name} ({item.unit})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div className="w-full md:w-32">
                                    <input 
                                        type="number" 
                                        placeholder="Qty" 
                                        value={row.quantity}
                                        onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                                        className="w-full bg-[#1a103c] border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-purple-500/50 focus:outline-none"
                                    />
                                </div>

                                {/* Unit (Read Only or Editable) */}
                                <div className="w-full md:w-24">
                                    <input 
                                        type="text" 
                                        placeholder="Unit" 
                                        value={row.unit}
                                        readOnly // Usually auto-filled from ingredient master
                                        className="w-full bg-[#1a103c]/50 border border-white/5 rounded-lg py-2 px-3 text-slate-400 text-sm cursor-not-allowed"
                                    />
                                </div>

                                {/* Delete Button */}
                                <button 
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    disabled={ingredientRows.length === 1}
                                    className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CARD 3: INSTRUCTIONS & SUBMIT --- */}
                <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-300 ml-1">Preparation Instructions (Optional)</label>
                        <textarea 
                            {...register("instructions")}
                            rows="4"
                            placeholder="e.g. Mix milk and sugar at 80°C, then add cocoa powder..."
                            className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl p-4 text-white focus:border-pink-500/50 focus:outline-none transition-all"
                        ></textarea>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader className="animate-spin" /> : <><Save size={20} /> Save Recipe</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddRecipe;