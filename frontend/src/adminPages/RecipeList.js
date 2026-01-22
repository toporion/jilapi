import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
    Search, Plus, BookOpen, ChevronLeft, ChevronRight, 
    Printer, X, Beaker, FileText, ChefHat, Trash2, Edit2, Save, MinusCircle, PlusCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const RecipeList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    
    // EDIT STATE
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // 1. FETCH RECIPES
    const { data: queryData, isLoading } = useQuery({
        queryKey: ['recipes', search, page],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/recipes', {
                params: { search, page, limit: 9 }
            });
            return data;
        },
        keepPreviousData: true
    });

    // 2. FETCH ALL INGREDIENTS (For the Edit Dropdown)
    const { data: allIngredients } = useQuery({
        queryKey: ['all-ingredients-simple'],
        queryFn: async () => {
            // Fetching a larger limit to ensure we get most items for the dropdown
            const { data } = await axiosSecure.get('/ingredients', { params: { limit: 100 } });
            return data?.data?.ingredients || [];
        },
        enabled: isEditing // Only fetch when user clicks "Edit"
    });

    // 3. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: async (id) => await axiosSecure.delete(`/delete_recipe/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['recipes']);
            if(selectedRecipe) setSelectedRecipe(null); // Close modal if open
            Swal.fire({ icon: 'success', title: 'Deleted!', showConfirmButton: false, timer: 1500 });
        }
    });

    const handleDelete = (e, id) => {
        e.stopPropagation(); // Stop modal from opening
        Swal.fire({
            title: 'Delete Recipe?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    // 4. UPDATE MUTATION
    const updateMutation = useMutation({
        mutationFn: async (data) => await axiosSecure.put(`/update_recipe/${selectedRecipe._id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['recipes']);
            setIsEditing(false);
            setSelectedRecipe(null);
            Swal.fire({ icon: 'success', title: 'Recipe Updated!', showConfirmButton: false, timer: 1500 });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message });
        }
    });

    // --- FORM HANDLERS ---
    const startEditing = () => {
        // Pre-fill form
        setEditForm({
            recipeName: selectedRecipe.recipeName,
            outputYield: selectedRecipe.outputYield,
            yieldUnit: selectedRecipe.yieldUnit,
            instructions: selectedRecipe.instructions,
            // Map ingredients to cleaner format
            ingredients: selectedRecipe.ingredients.map(ing => ({
                ingredientId: ing.ingredientId?._id, // Get raw ID
                quantity: ing.quantity
            }))
        });
        setIsEditing(true);
    };

    const handleFormChange = (e, index = null, field = null) => {
        if (index !== null) {
            // Update specific ingredient row
            const newIngredients = [...editForm.ingredients];
            newIngredients[index][field] = e.target.value;
            setEditForm({ ...editForm, ingredients: newIngredients });
        } else {
            // Update standard field
            setEditForm({ ...editForm, [e.target.name]: e.target.value });
        }
    };

    const addIngredientRow = () => {
        setEditForm({
            ...editForm,
            ingredients: [...editForm.ingredients, { ingredientId: "", quantity: "" }]
        });
    };

    const removeIngredientRow = (index) => {
        const newIngredients = editForm.ingredients.filter((_, i) => i !== index);
        setEditForm({ ...editForm, ingredients: newIngredients });
    };

    const handleSave = () => {
        // Basic validation
        if(!editForm.recipeName || !editForm.outputYield) return Swal.fire('Error', 'Name and Yield are required', 'error');
        updateMutation.mutate(editForm);
    };

    // --- RENDER ---
    const recipes = queryData?.data?.recipes || [];
    const totalPages = queryData?.data?.totalPages || 1;

    return (
        <div className="space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-pink-500" /> Recipe Book
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage production formulas and yields.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search recipes..." 
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>

                    <Link to="/admin/add_recipe">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm">
                            <Plus size={18} /> New Recipe
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- GRID --- */}
            <div className="print:hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <div 
                                key={recipe._id} 
                                onClick={() => { setIsEditing(false); setSelectedRecipe(recipe); }}
                                className="group bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 cursor-pointer hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
                                
                                {/* DELETE BUTTON (Top Right) */}
                                <button 
                                    onClick={(e) => handleDelete(e, recipe._id)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg z-10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/10 p-3 rounded-xl text-pink-400"><ChefHat size={24} /></div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{recipe.recipeName}</h3>
                                
                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2"><Beaker size={14} className="text-purple-400"/> Yields: <span className="text-white font-bold">{recipe.outputYield} {recipe.yieldUnit}</span></div>
                                    <div className="flex items-center gap-2"><FileText size={14} className="text-emerald-400"/> Items: <span className="text-white font-bold">{recipe.ingredients?.length || 0}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {!isLoading && recipes.length > 0 && (
                     <div className="flex justify-end gap-2 mt-6">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronLeft/></button>
                        <span className="p-2 text-white font-medium">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronRight/></button>
                    </div>
                )}
            </div>

            {/* --- MODAL (VIEW / EDIT) --- */}
            {selectedRecipe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-[#0f0a1f]/90 backdrop-blur-sm print:bg-white" onClick={() => setSelectedRecipe(null)}></div>
                    
                    <div className="relative w-full max-w-2xl bg-[#1a103c] border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 print:bg-white print:text-black print:border-none print:w-full print:max-w-none">
                        
                        {/* --- VIEW MODE --- */}
                        {!isEditing ? (
                            <>
                                <div className="flex justify-between items-start p-8 border-b border-white/10 print:border-black/10">
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-2 print:text-black">{selectedRecipe.recipeName}</h2>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 print:border-black print:text-black print:bg-transparent">
                                                Yield: {selectedRecipe.outputYield} {selectedRecipe.yieldUnit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 print:hidden">
                                        <button onClick={() => window.print()} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full"><Printer size={20} /></button>
                                        <button onClick={startEditing} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full"><Edit2 size={20} /></button>
                                        <button onClick={() => setSelectedRecipe(null)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full"><X size={20} /></button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 print:text-black"><Beaker className="text-pink-500" size={18} /> Ingredients</h3>
                                        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 print:border-black/20 print:bg-transparent">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-white/5 text-slate-300 print:text-black print:bg-slate-100">
                                                    <tr><th className="p-4 font-semibold">Item Name</th><th className="p-4 font-semibold text-right">Quantity</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 print:divide-black/10">
                                                    {selectedRecipe.ingredients.map((ing, idx) => (
                                                        <tr key={idx} className="text-slate-300 print:text-black">
                                                            <td className="p-4">{ing.ingredientId?.name || <span className="text-red-400">Deleted Item</span>}</td>
                                                            <td className="p-4 text-right font-mono font-bold">{ing.quantity} {ing.ingredientId?.unit}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {selectedRecipe.instructions && (
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 print:text-black"><FileText className="text-emerald-500" size={18} /> Instructions</h3>
                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed print:text-black print:bg-transparent print:border-black/20">{selectedRecipe.instructions}</div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* --- EDIT MODE --- */
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Edit Recipe</h2>
                                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full text-white"><X size={20}/></button>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Name & Yield */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1">Recipe Name</label>
                                            <input name="recipeName" value={editForm.recipeName} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-slate-400 block mb-1">Yield</label>
                                                <input name="outputYield" type="number" value={editForm.outputYield} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none" />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-xs text-slate-400 block mb-1">Unit</label>
                                                <select name="yieldUnit" value={editForm.yieldUnit} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none">
                                                    <option>Ltr</option><option>Kg</option><option>Pcs</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ingredients List */}
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-2">Ingredients</label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {editForm.ingredients.map((ing, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <select 
                                                        value={ing.ingredientId} 
                                                        onChange={(e) => handleFormChange(e, idx, 'ingredientId')}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {allIngredients?.map(ai => (
                                                            <option key={ai._id} value={ai._id}>{ai.name} ({ai.unit})</option>
                                                        ))}
                                                    </select>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Qty" 
                                                        value={ing.quantity}
                                                        onChange={(e) => handleFormChange(e, idx, 'quantity')}
                                                        className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                                                    />
                                                    <button type="button" onClick={() => removeIngredientRow(idx)} className="text-red-400 hover:text-red-300"><MinusCircle/></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={addIngredientRow} className="mt-2 text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"><PlusCircle size={16}/> Add Ingredient</button>
                                    </div>

                                    {/* Instructions */}
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Instructions</label>
                                        <textarea name="instructions" value={editForm.instructions} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24 focus:border-pink-500 outline-none"></textarea>
                                    </div>

                                    <button onClick={handleSave} disabled={updateMutation.isPending} className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl mt-4 flex justify-center gap-2">
                                        {updateMutation.isPending ? 'Saving...' : <><Save size={20}/> Save Changes</>}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .fixed, .fixed * { visibility: visible; }
                    .fixed { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
                    ::-webkit-scrollbar { display: none; }
                    button { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default RecipeList;