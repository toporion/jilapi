const ProductModel = require("../models/ProductModel");
const SalesModel = require("../models/SalesModel");

const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        // 1. Generate Invoice Number (Random 6 digits)
        const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
        
        let grandTotal = 0;
        let totalInvoiceProfit = 0;
        const processedItems = [];

        // 2. LOOP THROUGH ITEMS TO CHECK STOCK & CALCULATE PROFIT
        for (const item of items) {
            const product = await ProductModel.findById(item.productId);
            
            // Check if product exists and has stock
            if (!product || product.currentStock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock Error: Not enough ${product?.productName || 'item'} available.` 
                });
            }

            // --- FINANCIAL MATH ---
            // A. Revenue
            const itemTotalPrice = item.quantity * item.unitPrice;
            
            // B. Cost (From the Product we produced earlier)
            const itemCost = product.productionCostPerUnit * item.quantity;
            
            // C. Profit
            const itemProfit = itemTotalPrice - itemCost;

            grandTotal += itemTotalPrice;
            totalInvoiceProfit += itemProfit;

            processedItems.push({
                productId: item.productId,
                productName: product.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: itemTotalPrice,
                productionCost: itemCost,
                profit: itemProfit
            });
        }

        // 3. EXECUTE SALE (Deduct Stock)
        for (const item of processedItems) {
            await ProductModel.findByIdAndUpdate(item.productId, {
                $inc: { currentStock: -item.quantity }
            });
        }

        // 4. SAVE THE SALES LOG
        const newSale = new SalesModel({
            invoiceNo,
            items: processedItems,
            totalAmount: grandTotal,
            totalProfit: totalInvoiceProfit, // <--- SAVING PROFIT HERE
            paymentMethod: paymentMethod || 'Cash',
            soldBy: req.user.id
        });

        await newSale.save();

        res.status(200).json({
            success: true,
            message: "Sale completed successfully",
            invoiceNo,
            data: newSale
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error processing sale" });
    }
};

module.exports = { createSale };