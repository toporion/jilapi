const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'recipes', required: true },
    productName: { type: String, required: true },
    // inventory
    currentStock: { type: Number, default: 0 },
    unit: { type: String, required: true },
    minStockAlert: { type: Number, default: 5 },

    // Financials
    productionCostPerUnit: { type: Number, required: true },
    sellingPrice: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true })

const ProductionModel = mongoose.model('products', productSchema)
module.exports = ProductionModel;