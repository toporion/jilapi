const mongoose = require('mongoose');

const tableOrderSchema = new mongoose.Schema({
    // Link to the specific table
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'tableStores', required: true },
    tableNo: { type: Number, required: true }, // Snapshot for easier reading
    
    // The items they want
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            productName: { type: String },
            quantity: { type: Number, required: true, default: 1 },
            unitPrice: { type: Number }, // Price shown on menu
            totalPrice: { type: Number }
        }
    ],

    totalAmount: { type: Number, required: true },
    
    // The Lifecycle of the order
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },

    customerNote: { type: String } // e.g., "No peanuts please"

}, { timestamps: true });

module.exports = mongoose.model('TableOrder', tableOrderSchema);