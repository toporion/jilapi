const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNo: { type: String, required: true, unique: true }, // e.g., INV-8374
    
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            productName: { type: String }, 
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true }, // Selling Price at that moment
            totalPrice: { type: Number, required: true }, // Qty * Selling Price
            
            // Financials per item
            productionCost: { type: Number }, // How much it cost us to make
            profit: { type: Number } // (Selling Price - Cost) * Qty
        }
    ],

    totalAmount: { type: Number, required: true }, // Total Revenue
    totalProfit: { type: Number, default: 0 },     // Total Profit for this invoice
    
    paymentMethod: { type: String, default: 'Cash' },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }

}, { timestamps: true }); // timestamps handles the "Date" automatically

module.exports = mongoose.model('sales', saleSchema);