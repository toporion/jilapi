const IngredientModel = require("../models/IngredientModel")
const PurchaseModel = require("../models/PurchaseModel")

const addIngredient = async (req, res) => {
    try {
        const { itemCode } = req.body
        const ingredient = await IngredientModel.findOne({ itemCode })
        if (ingredient) {
            return res.status(403).json({
                success: false, message: "ingredient already exist"
            })

        }
        const image = req.file ? req.file.path : null
        const newIngredient = new IngredientModel({
            ...req.body,
            image,
            createdBy: req.user.id,
            currentStock: 0

        })
        await newIngredient.save()
        res.status(200).json({
            success: true,
            message: "Successfully create ingredient",
            data: newIngredient
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })

    }
}
const getIngredients = async (req, res) => {
    try {
        let { page, limit, search } = req.query
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10
        const skip = (page - 1) * limit

        let searchCriteria = {}
        if (search) {
            searchCriteria = {
                $or: [{ name: { $regex: search, $options: "i" } }, { itemCode: { $regex: search, $options: "i" } }]
            }
        }
        const totalIngedients = await IngredientModel.countDocuments(searchCriteria)
        const ingredients = await IngredientModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
        const totalPages = Math.ceil(totalIngedients / limit)

        res.status(200).json({
            success: true,
            message: "ingredient fetch successfully",
            data: {
                totalIngedients,
                totalPages,
                currentPage: page,
                ingredients
            }
        })

    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
}
const getIngreDientById = async (req, res) => {
    try {
        const { id } = req.params
        const ingredient = await IngredientModel.findById(id)
        res.status(200).json({
            success: true,
            message: "ingredient fetch successfully",
            data: ingredient
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
}
const updateIngredient = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, category, unit, minStockAlert, itemCode } = req.body
        const ingredient = await IngredientModel.findOne({ itemCode })
        if (ingredient) {
            return res.status(403).json({
                success: false, message: "ingredient already exist"
            })

        }
        let updateData = {
            name,
            category,
            unit,
            minStockAlert,
            itemCode
        }
        if (req.file) {
            updateData.image = req.file.path

        }
        const updatedIngredient = await IngredientModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "ingredient update successfully",
            data: updatedIngredient
        })

    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
}

const purchaseIngredient = async (req, res) => {
    try {
        const { ingredientId, quantity, supplier, unitPrice } = req.body
        const ingredient = await IngredientModel.findById(ingredientId)
        if (!ingredient) {
            return res.status(404).json({
                success: false, message: "ingredient not found"
            })}

            const totalPrice = quantity * unitPrice
            const newPurchase=new PurchaseModel({
                ingredientId:ingredient._id,
                ingredientName:ingredient.name,
                quantity,
                supplier,
                unitPrice,
                totalPrice,
                createdBy:req.user.id
            })
            await newPurchase.save()

            const oldTotalValue=ingredient.currentStock*ingredient.avgCostPerUnit
            const newTotalStock=ingredient.currentStock+Number(quantity)
            const newAvgCost=(oldTotalValue+totalPrice)/newTotalStock

            ingredient.currentStock=newTotalStock
            ingredient.avgCostPerUnit=newAvgCost
            await ingredient.save()
            res.status(200).json({
                success:true,
                message:"ingredient purchase successfully",
                currentStock:ingredient.currentStock,
                avgCostPerUnit:ingredient.avgCostPerUnit,
                data:newPurchase
            })
            
            
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"

        })
    }
}
module.exports = { addIngredient, getIngredients, getIngreDientById, updateIngredient,purchaseIngredient };