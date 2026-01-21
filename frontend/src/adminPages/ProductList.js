import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, TrendingUp, Edit3, Save, Search,Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const ProductList = () => {
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null); // Track which row is being edited
    const [tempPrice, setTempPrice] = useState(''); // Store price while typing
    
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // 1. FETCH FINISHED PRODUCTS
    const { data: products, isLoading } = useQuery({
        queryKey: ['products-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data?.data || [];
        }
    });

    // 2. HANDLE PRICE UPDATE
    const handleUpdatePrice = async (id) => {
        if (!tempPrice || parseFloat(tempPrice) <= 0) return;

        try {
            const res = await axiosSecure.put(`/product/update_price/${id}`, { 
                sellingPrice: parseFloat(tempPrice) 
            });

            if (res.data.success) {
                await queryClient.invalidateQueries(['products-list']);
                setEditingId(null);
                const Toast = Swal.mixin({
                    toast: true, position: "top-end", showConfirmButton: false, timer: 3000,
                    background: '#1a103c', color: '#fff'
                });
                Toast.fire({ icon: "success", title: "Selling Price Updated" });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not update price' });
        }
    };

    // Helper to start editing
    const startEdit = (product) => {
        setEditingId(product._id);
        setTempPrice(product.sellingPrice || '');
    };

    // Helper: Filter logic
    const filteredProducts = products?.filter(p => 
        p.productName.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="text-pink-500" /> Finished Stock
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage production inventory and set selling prices.</p>
                </div>

                {/* Search */}
                <div className="relative group flex-1 md:w-64 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-all"
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-[#1a103c]/80 z-20 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400 bg-white/5">
                                <th className="p-6 font-semibold">Product Name</th>
                                <th className="p-6 font-semibold">Available Stock</th>
                                <th className="p-6 font-semibold text-right">Production Cost</th>
                                <th className="p-6 font-semibold text-right">Selling Price</th>
                                <th className="p-6 font-semibold text-center">Profit Margin</th>
                                <th className="p-6 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {filteredProducts.map((item) => {
                                const cost = item.productionCostPerUnit || 0;
                                const price = item.sellingPrice || 0;
                                const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

                                return (
                                    <tr key={item._id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                        
                                        {/* Name */}
                                        <td className="p-6 font-bold text-white">
                                            {item.productName}
                                            <div className="text-xs text-slate-500 font-normal mt-1">
                                                Based on: {item.recipeId?.recipeName || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Stock Level */}
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${item.currentStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                <span className="text-lg font-bold text-white">{item.currentStock}</span>
                                                <span className="text-xs text-slate-500 uppercase">{item.unit}</span>
                                            </div>
                                        </td>

                                        {/* Cost (Read Only) */}
                                        <td className="p-6 text-right">
                                            <span className="text-slate-400 font-mono">${cost.toFixed(2)}</span>
                                            <div className="text-[10px] text-slate-600">PER UNIT</div>
                                        </td>

                                        {/* Selling Price (Editable) */}
                                        <td className="p-6 text-right">
                                            {editingId === item._id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-pink-500 font-bold">$</span>
                                                    <input 
                                                        type="number" 
                                                        autoFocus
                                                        className="w-20 bg-[#0f0a1f] border border-pink-500 rounded-lg px-2 py-1 text-white text-right focus:outline-none"
                                                        value={tempPrice}
                                                        onChange={(e) => setTempPrice(e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="font-bold text-emerald-400 font-mono text-lg">
                                                    ${price.toFixed(2)}
                                                </div>
                                            )}
                                        </td>

                                        {/* Profit Margin (Auto Calc) */}
                                        <td className="p-6 text-center">
                                            {price > 0 ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    margin > 30 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                    margin > 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                    <TrendingUp size={12} className="inline mr-1" />
                                                    {margin.toFixed(0)}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-600 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-6 text-center">
                                            {editingId === item._id ? (
                                                <button 
                                                    onClick={() => handleUpdatePrice(item._id)}
                                                    className="p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-colors"
                                                    title="Save Price"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => startEdit(item)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                                    title="Edit Price"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && !isLoading && (
                        <div className="p-12 text-center text-slate-500">
                            <Filter size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No finished products found. Go to Production to make some!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;