
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, Bell, ChefHat } from 'lucide-react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const KitchenOrders = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // 1. FETCH LIVE ORDERS (Auto-Refresh every 5 seconds)
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['live-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/table/orders/live');
            return res.data?.data || [];
        },
        refetchInterval: 5000 // <--- THE MAGIC: Auto-refresh every 5s
    });

    // 2. HANDLE STATUS CHANGE
    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await axiosSecure.put('/table/order/status', { orderId, status: newStatus });
            if (res.data.success) {
                // Determine color for toast
                const color = newStatus === 'Confirmed' ? 'success' : 'info';
                Swal.fire({
                    icon: color,
                    title: `Order ${newStatus}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
                queryClient.invalidateQueries(['live-orders']);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not update status' });
        }
    };

    if (isLoading) return <div className="text-white text-center mt-20">Loading Orders...</div>;

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ChefHat className="text-pink-500" /> Kitchen Monitor
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Live feed from customer tables.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 animate-pulse">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs font-bold uppercase">Live Feed Active</span>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p>No active orders right now.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div 
                            key={order._id} 
                            className={`
                                relative p-6 rounded-3xl border-2 transition-all duration-300
                                ${order.status === 'Pending' 
                                    ? 'bg-[#1a103c]/80 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                                    : 'bg-[#1a103c]/40 border-emerald-500/30 opacity-80 hover:opacity-100'}
                            `}
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Table {order.tableNo}</h3>
                                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Clock size={12}/> 
                                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <span className={`
                                    px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                                    ${order.status === 'Pending' ? 'bg-orange-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}
                                `}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs">
                                                {item.quantity}x
                                            </span>
                                            <span className="text-slate-200">{item.productName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-auto">
                                {order.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => updateStatus(order._id, 'Confirmed')}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <CheckCircle size={18} /> Accept
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(order._id, 'Cancelled')}
                                            className="px-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-colors"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-emerald-400 text-sm font-bold bg-emerald-500/5 py-3 rounded-xl border border-emerald-500/20">
                                        ✓ Sent to POS for Payment
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KitchenOrders;