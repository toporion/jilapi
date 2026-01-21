import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Image as ImageIcon, Box, Tag, Hash, AlertTriangle, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const AddIngredient = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const axiosSecure = UseAxiosSecure();

    // Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

   const onSubmit = async (data) => {
        console.log("1. Starting Submission...", data); // Debug Log
        // setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('itemCode', data.itemCode);
            formData.append('category', data.category);
            formData.append('unit', data.unit);
            formData.append('minStockAlert', data.minStockAlert);
            
            // Safety Check: Only append image if user selected one
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            // 2. Sending Request
            const res = await axiosSecure.post('add_ingredient', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("3. Server Response:", res.data); // See exactly what backend sends

            // 3. Handle Success
            if (res.data.insertedId || res.data.success) { 
                // Checks for 'success' boolean OR MongoDB 'insertedId' just in case
                
                await Swal.fire({
                    title: "Added!",
                    text: `${data.name} has been created.`,
                    icon: "success",
                    background: '#1a103c',
                    color: '#fff',
                    confirmButtonColor: "#db2777"
                });
                
                reset(); // Clear form
                setPreview(null); // Clear image preview
                setLoading(false); // Stop loading
            } else {
                // Backend returned 200 OK, but success was false
                Swal.fire({
                    title: "Warning",
                    text: res.data.message || "Saved, but success flag was missing.",
                    icon: "warning",
                    background: '#1a103c',
                    color: '#fff'
                });
            }

        } catch (error) {
            console.error("4. Error Catch:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to add ingredient",
                icon: "error",
                background: '#1a103c',
                color: '#fff'
            });
        } finally {
            // 5. THIS ALWAYS RUNS (Stops the loading)
            console.log("5. Stopping Loading Spinner");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Box className="text-pink-500" /> New Ingredient
                </h2>
                <p className="text-slate-400 text-sm mt-1">Define a new raw material for your inventory.</p>
            </div>

            {/* Form Card */}
            <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* --- LEFT COLUMN: INPUTS --- */}
                    <div className="space-y-5">
                        
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Item Name</label>
                            <div className="relative group">
                                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                                <input 
                                    {...register("name", { required: "Name is required" })}
                                    type="text" 
                                    placeholder="e.g., Full Cream Milk" 
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500/50 focus:outline-none transition-all"
                                />
                            </div>
                            {errors.name && <span className="text-red-400 text-xs ml-2">{errors.name.message}</span>}
                        </div>

                        {/* Item Code & Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Item Code</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                                    <input 
                                        {...register("itemCode", { required: "Required" })}
                                        type="text" 
                                        placeholder="ING-001" 
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Category</label>
                                <div className="relative group">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                    <select 
                                        {...register("category", { required: "Required" })}
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:border-purple-500/50 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Flavor">Flavor</option>
                                        <option value="Topping">Topping</option>
                                        <option value="Grosery">Grosery</option>
                                        <option value="Cone">Cone/Cup</option>
                                        <option value="Packaging">Packaging</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Unit & Alert Level */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Unit</label>
                                <select 
                                    {...register("unit", { required: "Required" })}
                                    className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:border-pink-500/50 focus:outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Select Unit...</option>
                                    <option value="LTR">Liter (LTR)</option>
                                    <option value="KG">Kilogram (KG)</option>
                                    <option value="GM">Gram (GM)</option>
                                    <option value="PCS">Pieces (PCS)</option>
                                    <option value="BOX">Box</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Low Stock Alert</label>
                                <div className="relative group">
                                    <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                    <input 
                                        {...register("minStockAlert", { required: true })}
                                        type="number" 
                                        defaultValue={5}
                                        className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: IMAGE UPLOAD --- */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-bold text-slate-300 ml-1">Product Image</label>
                        
                        <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-pink-500/50 transition-colors bg-[#0f0a1f]/50">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-slate-400" size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm">Click to upload image</p>
                                    <p className="text-slate-600 text-xs mt-2">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                {...register("image")}
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                        >
                            {loading ? <Loader className="animate-spin" /> : <><Save size={20} /> Save Ingredient</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddIngredient;