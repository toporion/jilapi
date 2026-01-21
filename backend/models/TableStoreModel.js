const mongoose = require('mongoose');

const tableStoreSchema = new mongoose.Schema({
    tableNo: { type: Number, required: true, unique: true }, // e.g., 1, 2, 3...
    passcode: { type: String, required: true }, // e.g., "5592"
    
    // We can generate the QR URL dynamically, but storing it helps with printing later
    qrCodeUrl: { type: String }, 
    
    isActive: { type: Boolean, default: true } // If a table is broken, you can disable it
}, { timestamps: true });

module.exports = mongoose.model('tableStores', tableStoreSchema);