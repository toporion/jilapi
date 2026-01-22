import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const ProductList = () => {
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null); 
    
    // Edit States
    const [tempPrice, setTempPrice] = useState(''); 
    const [tempFile, setTempFile] = useState(null); // To store the selected image
    const [previewUrl, setPreviewUrl] = useState(null); // To show preview before saving

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

    // 2. START EDITING
    const startEdit = (product) => {
        setEditingId(product._id);
        setTempPrice(product.sellingPrice || 0);
        setTempFile(null); // Reset file
        setPreviewUrl(product.image || null); // Set initial preview to current image
    };

    // 3. CANCEL EDITING
    const cancelEdit = () => {
        setEditingId(null);
        setTempPrice('');
        setTempFile(null);
        setPreviewUrl(null);
    };

    // 4. HANDLE FILE SELECTION
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create local preview URL
        }
    };

    // 5. SUBMIT UPDATE (Price + Image)
    const handleUpdateProduct = async (id) => {
        if (!tempPrice || parseFloat(tempPrice) < 0) return Swal.fire('Error', 'Invalid Price', 'error');

        try {
            // We must use FormData because we are sending a file
            const formData = new FormData();
            formData.append('sellingPrice', tempPrice);
            if (tempFile) {
                formData.append('image', tempFile);
            }

            // ⚠️ Using the new route we created: /product/update/:id
            const res = await axiosSecure.put(`/product/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                await queryClient.invalidateQueries(['products-list']);
                cancelEdit();
                
                const Toast = Swal.mixin({
                    toast: true, position: "top-end", showConfirmButton: false, timer: 3000,
                    background: '#1a103c', color: '#fff'
                });
                Toast.fire({ icon: "success", title: "Product Updated Successfully" });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Could not save changes' });
        }
    };

    // Filter logic
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
                    <p className="text-slate-400 text-sm mt-1">Set prices and upload marketing images for the menu.</p>
                </div>

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
                                <th className="p-6 font-semibold w-24">Image</th>
                                <th className="p-6 font-semibold">Product Details</th>
                                <th className="p-6 font-semibold">Stock</th>
                                <th className="p-6 font-semibold text-right">Cost</th>
                                <th className="p-6 font-semibold text-right">Selling Price</th>
                                <th className="p-6 font-semibold text-center">Margin</th>
                                <th className="p-6 font-semibold text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {filteredProducts.map((item) => {
                                const cost = item.productionCostPerUnit || 0;
                                const price = item.sellingPrice || 0;
                                const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
                                const isEditing = editingId === item._id;

                                return (
                                    <tr key={item._id} className={`group border-b border-white/5 last:border-none transition-colors ${isEditing ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                                        
                                        {/* 1. IMAGE COLUMN */}
                                        <td className="p-4">
                                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group/img">
                                                {isEditing ? (
                                                    <label className="cursor-pointer w-full h-full flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors">
                                                        {previewUrl ? (
                                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                                        ) : (
                                                            <ImageIcon className="text-white opacity-50" />
                                                        )}
                                                        <Upload size={20} className="text-white absolute z-10" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                ) : (
                                                    <img 
                                                        src={item.image || "https://via.placeholder.com/150?text=No+Img"} 
                                                        alt={item.productName} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        {/* 2. DETAILS */}
                                        <td className="p-6 font-bold text-white align-middle">
                                            {item.productName}
                                            <div className="text-xs text-slate-500 font-normal mt-1 flex items-center gap-1">
                                                From: {item.recipeId?.recipeName || 'N/A'}
                                                {isEditing && <span className="text-pink-400 ml-2 animate-pulse text-[10px] uppercase font-bold">Editing Mode</span>}
                                            </div>
                                        </td>

                                        {/* 3. STOCK */}
                                        <td className="p-6 align-middle">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.currentStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                <span className="text-white font-bold">{item.currentStock}</span>
                                                <span className="text-xs text-slate-500 uppercase">{item.unit}</span>
                                            </div>
                                        </td>

                                        {/* 4. COST */}
                                        <td className="p-6 text-right align-middle">
                                            <span className="text-slate-500 font-mono">${cost.toFixed(2)}</span>
                                        </td>

                                        {/* 5. SELLING PRICE (EDITABLE) */}
                                        <td className="p-6 text-right align-middle">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    <span className="text-pink-500 font-bold">$</span>
                                                    <input 
                                                        type="number" 
                                                        autoFocus
                                                        className="w-20 bg-[#0f0a1f] border border-pink-500 rounded-lg px-2 py-1 text-white text-right focus:outline-none font-bold"
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

                                        {/* 6. MARGIN */}
                                        <td className="p-6 text-center align-middle">
                                            {price > 0 ? (
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                                    margin > 30 ? 'text-emerald-400 bg-emerald-500/10' : 
                                                    margin > 0 ? 'text-yellow-400 bg-yellow-500/10' : 
                                                    'text-red-400 bg-red-500/10'
                                                }`}>
                                                    {margin.toFixed(0)}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </td>

                                        {/* 7. ACTIONS */}
                                        <td className="p-6 text-center align-middle">
                                            {isEditing ? (
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateProduct(item._id)}
                                                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
                                                        title="Save Changes"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={cancelEdit}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => startEdit(item)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                                    title="Edit Price & Image"
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
                            <p>No finished products found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;