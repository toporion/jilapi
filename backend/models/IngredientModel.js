// models/Ingredient.js
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    itemCode: { type: String, required: true, unique: true }, // e.g., ING-001
    category: { type: String, required: true }, // e.g., "Dairy", "Flavor", "Cone"
    
    // Inventory Data
    currentStock: { type: Number, default: 0 }, // The most important field
    unit: { type: String, required: true }, // e.g., "LTR", "KG", "PCS"
    minStockAlert: { type: Number, default: 5 }, // Alert when stock is low
    
    // Costing (Used for profit calculation)
    avgCostPerUnit: { type: Number, default: 0 }, 
    
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

module.exports = mongoose.model('ingredients', ingredientSchema);