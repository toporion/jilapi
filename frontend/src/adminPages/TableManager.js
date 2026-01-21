
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { Plus,Printer, Lock, LayoutGrid, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const TableManager = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    
    // FETCH TABLES
    const { data: tables, isLoading } = useQuery({
        queryKey: ['tables-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tables');
            return res.data?.data || [];
        }
    });

    // ADD TABLE HANDLER
    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.post('/table/add', {
                tableNo: Number(data.tableNo),
                passcode: data.passcode
            });

            if (res.data.success) {
                Swal.fire({ icon: 'success', title: 'Table Added', timer: 1500, showConfirmButton: false, background: '#1a103c', color: '#fff' });
                reset();
                queryClient.invalidateQueries(['tables-list']);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to add table' });
        }
    };

    // PRINT HELPER
    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="text-white text-center mt-20"><Loader className="animate-spin mx-auto"/> Loading Tables...</div>;

    return (
        <div className="space-y-8">
            
            {/* --- HEADER --- */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <LayoutGrid className="text-pink-500" /> Table Management
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Create tables and print QR codes for customers.</p>
                </div>
                <button 
                    onClick={handlePrint}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 transition-colors print:hidden"
                >
                    <Printer size={18} /> Print All QRs
                </button>
            </div>

            {/* --- ADD NEW TABLE FORM (Hidden when printing) --- */}
            <div className="bg-[#1a103c]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl print:hidden">
                <h3 className="text-lg font-bold text-white mb-6">Add New Table</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                    
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-bold text-slate-300 ml-1">Table Number</label>
                        <input 
                            {...register("tableNo", { required: true })}
                            type="number" 
                            placeholder="e.g. 1" 
                            className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-bold text-slate-300 ml-1">Secret Passcode</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                {...register("passcode", { required: true })}
                                type="text" 
                                placeholder="e.g. 1234" 
                                className="w-full bg-[#0f0a1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>
                    </div>

                    <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2">
                        <Plus size={20} /> Add Table
                    </button>
                </form>
            </div>

            {/* --- QR GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-3 print:gap-8">
                {tables.map((table) => (
                    <div key={table._id} className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center border-4 border-[#1a103c] relative group break-inside-avoid">
                        
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-black text-[#1a103c] uppercase tracking-wider">Table {table.tableNo}</h3>
                            <p className="text-xs font-bold text-slate-500">Scan to Order</p>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-2 rounded-lg">
                            {/* NOTE: This URL points to your Frontend Customer Page */}
                            <QRCode 
                                value={`${window.location.origin}/menu/table/${table.tableNo}`} 
                                size={140}
                                level="H" 
                            />
                        </div>

                        {/* Footer Info */}
                        <div className="mt-4 w-full bg-slate-100 py-2 rounded-lg border border-slate-200">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Passcode</p>
                            <p className="text-xl font-mono font-black text-[#1a103c] tracking-widest">{table.passcode}</p>
                        </div>

                        {/* Instructions */}
                        <p className="mt-3 text-[10px] text-slate-400 max-w-[150px] leading-tight print:hidden">
                            Print this and stick it on Table {table.tableNo}.
                        </p>

                    </div>
                ))}
            </div>

            {/* Print Styles (Hidden in normal view) */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:grid-cols-3 {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr) !important;
                        visibility: visible !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .break-inside-avoid {
                        page-break-inside: avoid;
                        visibility: visible !important;
                    }
                    .break-inside-avoid * {
                        visibility: visible !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default TableManager;