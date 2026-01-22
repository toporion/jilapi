const IngredientModel = require("../models/IngredientModel")
const RecipeModel = require("../models/RecipeModel")

const addRecipe = async (req, res) => {
    try {
        const { recipeName, outputYield, yieldUnit, ingredients, instructions } = req.body
        const recipe = await RecipeModel.findOne({ recipeName })
        if (recipe) {
            return res.status(403).json({
                success: false, message: "recipe already exist"
            })
        }
        const newRecipe = new RecipeModel({
            recipeName,
            outputYield,
            yieldUnit,
            
            ingredients,
            instructions,
            createdBy: req.user.id
        })
        await newRecipe.save()
        res.status(200).json({
            success: true,
            message: "Successfully create recipe",
            data: newRecipe
        })

    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })

    }
}

const getRecipes = async (req, res) => {
    try {
        let { page, limit, search } = req.query
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const skip = (page - 1) * limit

        let searchCriteria = {}
        if (search) {
            searchCriteria = {
                $or: [{ recipeName: { $regex: search, $options: "i" } }]
            }
        }
        const totalRecipes = await RecipeModel.countDocuments(searchCriteria)
        
        // 👇 CHANGED HERE: Added .populate()
        const recipes = await RecipeModel.find(searchCriteria)
            .populate('ingredients.ingredientId', 'name unit itemCode') // Get name and unit from Ingredient Model
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        const totalPages = Math.ceil(totalRecipes / limit)
        res.status(200).json({
            success: true,
            message: "recipe fetch successfully",
            data: {
                totalRecipes,
                totalPages,
                currentPage: page,
                recipes
            }
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
}

// ✅ NEW: Update Recipe
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { recipeName, outputYield, yieldUnit, ingredients, instructions } = req.body;

        // Check uniqueness excluding current ID
        const existing = await RecipeModel.findOne({ recipeName, _id: { $ne: id } });
        if (existing) {
            return res.status(403).json({ success: false, message: "Recipe name already exists" });
        }

        const updatedRecipe = await RecipeModel.findByIdAndUpdate(
            id,
            { recipeName, outputYield, yieldUnit, ingredients, instructions },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Recipe updated", data: updatedRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating recipe" });
    }
};

// ✅ NEW: Delete Recipe
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        await RecipeModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting recipe" });
    }
};
module.exports = { addRecipe,getRecipes,deleteRecipe,updateRecipe }