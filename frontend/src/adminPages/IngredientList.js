import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
    Search, Plus, Package, AlertTriangle, ChevronLeft, ChevronRight, 
    MoreVertical, X, Calendar, Tag, BarChart3, Filter 
} from 'lucide-react';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const IngredientList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null); // For Modal
    const axiosSecure = UseAxiosSecure();

    // --- 1. FETCH ALL INGREDIENTS ---
    const { data: queryData, isLoading } = useQuery({
        queryKey: ['ingredients', search, page],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/ingredients', {
                params: { search, page, limit: 10 }
            });
            return data;
        },
        keepPreviousData: true
    });

    // --- 2. FETCH SINGLE INGREDIENT (For Modal) ---
    const { data: singleData, isLoading: isSingleLoading } = useQuery({
        queryKey: ['ingredient', selectedId],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`single_ingredient/${selectedId}`);
            return data;
        },
        enabled: !!selectedId // Only run when an ID is selected
    });

    const ingredients = queryData?.data?.ingredients || []; // Adjust based on your actual backend response structure
    const totalPages = queryData?.data?.totalPages || 1;
    const ingredientDetail = singleData?.data;

    // Helper: Determine stock color
    const getStockStatus = (current, min) => {
        if (current === 0) return { color: "bg-red-500", text: "text-red-500", label: "Out of Stock" };
        if (current <= min) return { color: "bg-yellow-500", text: "text-yellow-500", label: "Low Stock" };
        return { color: "bg-emerald-500", text: "text-emerald-500", label: "In Stock" };
    };

    return (
        <div className="space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="text-purple-500" /> Inventory
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage raw materials and stock levels.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search ingredients..." 
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    {/* Add Button */}
                    <Link to="/admin/add-ingredient">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm">
                            <Plus size={18} /> Add New
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-[#1a103c]/80 z-20 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400 bg-white/5">
                                <th className="p-6 font-semibold">Item Details</th>
                                <th className="p-6 font-semibold">Category</th>
                                <th className="p-6 font-semibold w-1/4">Stock Level</th>
                                <th className="p-6 font-semibold text-right">Unit Price</th>
                                <th className="p-6 font-semibold text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {ingredients.map((item) => {
                                const status = getStockStatus(item.currentStock, item.minStockAlert);
                                
                                return (
                                    <tr key={item._id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                        {/* Item Name & Image */}
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 p-1 border border-white/10">
                                                    <img 
                                                        src={item.image || "https://via.placeholder.com/50"} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{item.name}</h3>
                                                    <span className="text-xs text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">
                                                        {item.itemCode}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-slate-300 bg-white/5">
                                                {item.category}
                                            </span>
                                        </td>

                                        {/* Stock Level (Progress Bar) */}
                                        <td className="p-6">
                                            <div className="flex justify-between text-xs mb-1 font-bold">
                                                <span className={status.text}>{item.currentStock} {item.unit}</span>
                                                <span className="text-slate-500">{status.label}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                                {/* Calculate width roughly, capped at 100% */}
                                                <div 
                                                    className={`h-full ${status.color}`} 
                                                    style={{ width: `${Math.min((item.currentStock / 100) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>

                                        {/* Cost (Calculated Avg) */}
                                        <td className="p-6 text-right font-mono text-slate-300">
                                            ${item.avgCostPerUnit?.toFixed(2) || '0.00'}
                                        </td>

                                        {/* View Button */}
                                        <td className="p-6 text-center">
                                            <button 
                                                onClick={() => setSelectedId(item._id)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                     {/* Pagination */}
                     <div className="p-4 flex justify-end gap-2 border-t border-white/10">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronLeft/></button>
                        <span className="p-2 text-white font-medium">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 text-white"><ChevronRight/></button>
                    </div>

                    {ingredients.length === 0 && !isLoading && (
                        <div className="p-12 text-center text-slate-500">
                            <Filter size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No ingredients found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- DETAIL MODAL --- */}
            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0f0a1f]/80 backdrop-blur-sm" onClick={() => setSelectedId(null)}></div>
                    
                    <div className="relative w-full max-w-lg bg-[#1a103c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10">
                            <X size={20} />
                        </button>

                        {isSingleLoading || !ingredientDetail ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                {/* Modal Header Image */}
                                <div className="h-40 w-full bg-white/5 relative">
                                    <img 
                                        src={ingredientDetail.image || "https://via.placeholder.com/300"} 
                                        className="w-full h-full object-cover opacity-60" 
                                        alt="Header"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a103c] to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <h3 className="text-2xl font-bold text-white">{ingredientDetail.name}</h3>
                                        <span className="text-purple-400 font-mono text-sm">{ingredientDetail.itemCode}</span>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                                <BarChart3 size={14} /> Current Stock
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                {ingredientDetail.currentStock} <span className="text-sm font-normal text-slate-500">{ingredientDetail.unit}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                                <Tag size={14} /> Avg Cost
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                ${ingredientDetail.avgCostPerUnit?.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Details</h4>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Category</span>
                                            <span className="text-white">{ingredientDetail.category}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Created At</span>
                                            <span className="text-white">
                                                {new Date(ingredientDetail.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Alert Level</span>
                                            <span className="text-yellow-500 flex items-center gap-1">
                                                <AlertTriangle size={12} /> Below {ingredientDetail.minStockAlert} {ingredientDetail.unit}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors">
                                            Update Stock
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold transition-colors">
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientList;