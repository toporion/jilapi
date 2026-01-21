import React from 'react';
import { useQuery } from '@tanstack/react-query';
// Added 'Package' to the imports below
import { TrendingUp,ShoppingCart, DollarSign, AlertTriangle, Loader, BarChart3, Calendar, Package } from 'lucide-react';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

const AdminHome = () => {
    const axiosSecure = UseAxiosSecure();

    // FETCH REAL STATS
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/stats');
            return res.data?.data;
        }
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white">
                <Loader className="animate-spin mb-4 text-pink-500" size={48} />
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    // 1. CARDS CONFIGURATION
    const statsCards = [
        { 
            label: 'Total Revenue', 
            value: `$${(stats?.revenue || 0).toFixed(2)}`, 
            color: 'from-pink-500 to-rose-500', 
            icon: <DollarSign size={20}/> 
        },
        { 
            label: 'Total Profit', 
            value: `$${(stats?.profit || 0).toFixed(2)}`, 
            color: 'from-emerald-500 to-teal-500', 
            icon: <TrendingUp size={20}/> 
        },
        { 
            label: 'Total Orders', 
            value: stats?.orders || 0, 
            color: 'from-purple-500 to-indigo-500', 
            icon: <ShoppingCart size={20}/> 
        },
        { 
            label: 'Low Stock Alerts', 
            value: stats?.lowStockCount || 0, 
            color: (stats?.lowStockCount || 0) > 0 ? 'from-orange-500 to-red-500' : 'from-blue-500 to-cyan-500', 
            icon: <AlertTriangle size={20}/>,
            isAlert: (stats?.lowStockCount || 0) > 0
        },
    ];

    // 2. GRAPH DATA PREPARATION
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0]; 
            const found = stats?.chartData?.find(item => item._id === dateStr);
            days.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }), 
                amount: found ? found.dailyRevenue : 0
            });
        }
        return days;
    };
    
    const chartData = getLast7Days();
    const maxGraphVal = Math.max(...chartData.map(d => d.amount), 100); 
    const maxItemSales = stats?.topSelling?.[0]?.count || 1;

    return (
        <div className="space-y-6">
            
            {/* --- TOP ROW: STATS CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {statsCards.map((stat, i) => (
                    <div key={i} className="relative overflow-hidden bg-[#1a103c]/40 backdrop-blur-md border border-white/5 p-5 rounded-3xl group hover:bg-[#1a103c]/60 transition-all duration-300">
                        <div className={`absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br ${stat.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            {stat.isAlert && (
                                <span className="flex items-center text-xs font-bold px-2 py-1 rounded-full border text-red-400 border-red-500/20 bg-red-500/10 animate-pulse">
                                    Attention
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* --- MIDDLE ROW: GRAPH & TOP ITEMS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. WEEKLY SALES GRAPH */}
                <div className="lg:col-span-2 bg-[#1a103c]/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 className="text-pink-500"/> Revenue Trend
                            </h3>
                            <p className="text-slate-400 text-xs">Last 7 Days Performance</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                            <Calendar size={12}/> This Week
                        </div>
                    </div>
                    
                    <div className="flex items-end justify-between h-48 gap-3 px-2">
                        {chartData.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative w-full h-full flex items-end justify-center">
                                    <div 
                                        style={{ height: `${(day.amount / maxGraphVal) * 100}%` }} 
                                        className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-pink-600/50 to-pink-500 group-hover:from-cyan-600/50 group-hover:to-cyan-400 transition-all duration-500 relative min-h-[4px]"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            ${day.amount}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 font-bold group-hover:text-white transition-colors">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. TOP SELLING PRODUCTS */}
                <div className="lg:col-span-1 bg-[#1a103c]/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 text-white">🏆 Best Sellers</h3>
                    <div className="space-y-5 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {stats?.topSelling?.length > 0 ? (
                            stats.topSelling.map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between text-sm mb-2 text-white">
                                        <span className="font-bold line-clamp-1">{item._id}</span>
                                        <span className="text-slate-400 text-xs">{item.count} Sold</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000" 
                                            style={{ width: `${(item.count / maxItemSales) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right mt-1">
                                        <span className="text-xs text-emerald-400 font-mono">+${item.totalVal.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                                {/* Error was here, Package is now imported */}
                                <Package size={32} className="mb-2 opacity-20"/>
                                <p>No sales data yet</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- BOTTOM ROW: RECENT ORDERS TABLE --- */}
            <div className="bg-[#1a103c]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Invoices</h3>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                                <th className="p-4">Invoice No</th>
                                <th className="p-4">Sold By</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-right">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {stats?.recentSales?.map((sale) => (
                                <tr key={sale._id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                    <td className="p-4 text-pink-400 font-mono">{sale.invoiceNo}</td>
                                    <td className="p-4 flex items-center gap-2 text-white">
                                        <div className="w-6 h-6 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">
                                            {sale.soldBy?.name?.[0] || 'U'}
                                        </div>
                                        <span>{sale.soldBy?.name || 'Unknown'}</span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-xs">
                                        {new Date(sale.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right font-bold text-white">
                                        ${sale.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right font-bold text-emerald-400">
                                        +${(sale.totalProfit || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                             {(!stats?.recentSales || stats.recentSales.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
            </div>
        </div>
    );
};

export default AdminHome;