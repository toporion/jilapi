const SalesModel = require("../models/SalesModel");
const IngredientModel = require("../models/IngredientModel");
// 👇 THIS IS THE FIX: Import the User Model so 'populate' works
const UserModel = require("../models/UserModel"); 

const getAdminStats = async (req, res) => {
    try {
        // 1. FINANCIAL STATS (Aggregated)
        const financials = await SalesModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalProfit: { $sum: "$totalProfit" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const stats = financials.length > 0 ? financials[0] : { totalRevenue: 0, totalProfit: 0, totalOrders: 0 };

        // 2. LOW STOCK ALERT
        const lowStockIngredients = await IngredientModel.countDocuments({ 
            $expr: { $lte: ["$currentStock", "$minStockAlert"] } 
        });

        // 3. GRAPH DATA: SALES LAST 7 DAYS
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailySales = await SalesModel.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } } 
        ]);

        // 4. TOP SELLING ITEMS
        const topSelling = await SalesModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productName",
                    count: { $sum: "$items.quantity" },
                    totalVal: { $sum: "$items.totalPrice" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 5. RECENT TRANSACTIONS
        const recentSales = await SalesModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('soldBy', 'name'); // This will work now because we imported UserModel

        res.status(200).json({
            success: true,
            data: {
                revenue: stats.totalRevenue || 0,
                profit: stats.totalProfit || 0,
                orders: stats.totalOrders || 0,
                lowStockCount: lowStockIngredients || 0,
                chartData: dailySales,
                topSelling,
                recentSales
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
};

module.exports = { getAdminStats };