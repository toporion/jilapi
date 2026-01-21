const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    recipeName: { type: String, required: true },
    outputYield: { type: Number, required: true },
    yieldUnit: { type: String, required: true },
    ingredients: [
        {
            ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ingredients', required: true },
            ingredientName: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ],
    instructions: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true })

const RecipeModel = mongoose.model('recipes', recipeSchema)
module.exports = RecipeModel;