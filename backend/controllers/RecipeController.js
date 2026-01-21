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
        const recipes = await RecipeModel.find(searchCriteria)
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
module.exports = { addRecipe,getRecipes }