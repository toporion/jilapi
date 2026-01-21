const RecipeModel = require("../models/RecipeModel");
const IngredientModel = require("../models/IngredientModel");
const ProductModel = require("../models/ProductModel");

const produceIceCream = async (req, res) => {
    try {
        const { recipeId, quantityToMake } = req.body; // e.g., Make 20 Liters

        // 1. Get the Recipe
        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" });

        // 2. Calculate Batch Ratio
        // If Recipe makes 10L, and we want 20L, ratio is 2.
        const batchRatio = quantityToMake / recipe.outputYield;

        // 3. CHECK STOCK (Dry Run)
        // We assume we can make it, unless we find an ingredient missing
        let totalBatchCost = 0;

        for (const item of recipe.ingredients) {
            const requiredQty = item.quantity * batchRatio;
            const ingredientInDb = await IngredientModel.findById(item.ingredientId);

            if (!ingredientInDb || ingredientInDb.currentStock < requiredQty) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Not enough stock for ${item.ingredientName}. Required: ${requiredQty}, Available: ${ingredientInDb?.currentStock || 0}` 
                });
            }
            
            // Calculate cost for this ingredient part
            totalBatchCost += (requiredQty * ingredientInDb.avgCostPerUnit);
        }

        // 4. IF STOCK IS OK -> DEDUCT INGREDIENTS
        for (const item of recipe.ingredients) {
            const requiredQty = item.quantity * batchRatio;
            await IngredientModel.findByIdAndUpdate(item.ingredientId, {
                $inc: { currentStock: -requiredQty }
            });
        }

        // 5. ADD TO FINISHED PRODUCT STOCK
        let product = await ProductModel.findOne({ recipeId });
        
        // If this is the first time making this ice cream, create the product entry
        if (!product) {
            product = new ProductModel({
                recipeId: recipe._id,
                productName: recipe.recipeName,
                unit: recipe.yieldUnit,
                currentStock: 0,
                productionCostPerUnit: 0,
                createdBy: req.user.id
            });
        }

        // Weighted Average Cost Calculation for the Finished Product
        const newProductionCost = totalBatchCost; // Cost of this specific batch
        const oldTotalValue = product.currentStock * product.productionCostPerUnit;
        
        const newTotalStock = product.currentStock + Number(quantityToMake);
        const newAvgCost = (oldTotalValue + newProductionCost) / newTotalStock;

        product.currentStock = newTotalStock;
        product.productionCostPerUnit = newAvgCost;

        await product.save();

        res.status(200).json({
            success: true,
            message: `Successfully produced ${quantityToMake} ${recipe.yieldUnit} of ${recipe.recipeName}`,
            data: product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error during production" });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().populate('recipeId', 'recipeName');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateSellingPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { sellingPrice } = req.body;

        await ProductModel.findByIdAndUpdate(id, { sellingPrice });
        res.status(200).json({ success: true, message: "Price updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating price" });
    }
};

module.exports = { produceIceCream, getProducts,updateSellingPrice };