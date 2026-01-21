const TableStoreModel = require("../models/TableStoreModel");
const TableOrderModel = require("../models/TableOrderModel");
const ProductModel = require("../models/ProductModel");

// --- 1. ADMIN: SETUP TABLES ---
const addTable = async (req, res) => {
    try {
        const { tableNo, passcode } = req.body;

        // Check if table already exists
        const existing = await TableStoreModel.findOne({ tableNo });
        if (existing) return res.status(400).json({ success: false, message: "Table Number already exists" });

        const newTable = new TableStoreModel({ tableNo, passcode });
        await newTable.save();

        res.status(200).json({ success: true, message: "Table Created", data: newTable });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating table" });
    }
};

const getTables = async (req, res) => {
    try {
        const tables = await TableStoreModel.find().sort({ tableNo: 1 });
        res.status(200).json({ success: true, data: tables });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tables" });
    }
};

// --- 2. CUSTOMER: MENU ACCESS ---
const verifyPasscode = async (req, res) => {
    try {
        const { tableNo, passcode } = req.body;

        console.log("--- 🔍 VERIFY DEBUG ---");
        console.log("1. Incoming Request:", { tableNo, passcode });

        // Check if table exists
        const table = await TableStoreModel.findOne({ tableNo: tableNo });
        console.log("2. Database Found:", table);

        if (!table) {
            console.log("❌ Error: Table not found in DB");
            return res.status(401).json({ success: false, message: "Table not found" });
        }

        if (table.passcode !== passcode) {
            console.log(`❌ Error: Passcode mismatch. DB: '${table.passcode}' vs Input: '${passcode}'`);
            return res.status(401).json({ success: false, message: "Invalid Passcode" });
        }

        console.log("✅ Success: Access Granted");
        res.status(200).json({ success: true, message: "Access Granted", tableId: table._id });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const placeTableOrder = async (req, res) => {
    try {
        const { tableId, tableNo, items, customerNote } = req.body;

        // Calculate total again on backend for security
        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            if (product) {
                const lineTotal = product.sellingPrice * item.quantity;
                totalAmount += lineTotal;
                processedItems.push({
                    productId: product._id,
                    productName: product.productName,
                    quantity: item.quantity,
                    unitPrice: product.sellingPrice,
                    totalPrice: lineTotal
                });
            }
        }

        const newOrder = new TableOrderModel({
            tableId,
            tableNo,
            items: processedItems,
            totalAmount,
            customerNote,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(200).json({ success: true, message: "Order Sent to Kitchen", data: newOrder });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
};

// --- 3. STAFF: MANAGE ORDERS ---
const getLiveOrders = async (req, res) => {
    try {
        // Fetch orders that are NOT completed yet
        const orders = await TableOrderModel.find({ status: { $in: ['Pending', 'Confirmed'] } })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body; // e.g., status = 'Confirmed'
        await TableOrderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Order Updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// Add this function
const getPublicMenu = async (req, res) => {
    try {
        // Only fetch items that have Stock AND a Selling Price
        const menuItems = await ProductModel.find({
            currentStock: { $gt: 0 },
            sellingPrice: { $gt: 0 }
        }).select('productName sellingPrice unit currentStock');
        // .select() ensures we don't send "productionCost" to customers (Secret!)

        res.status(200).json({ success: true, data: menuItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching menu" });
    }
};

// Check status of a specific order
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await TableOrderModel.findById(orderId).select('status');
        
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        res.status(200).json({ success: true, status: order.status });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};

module.exports = { addTable, getTables, verifyPasscode, placeTableOrder, getLiveOrders, updateOrderStatus, getPublicMenu,getOrderStatus };