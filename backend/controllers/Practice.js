const IngredientModel = require("../models/IngredientModel")
const PurchaseModel = require("../models/PurchaseModel")


const purchaseIngreDient = async (req, res) => {
    try {
        const { ingredientId, quantity, supplier, unitPrice } = req.body
        const ingredient = await IngredientModel.findById(ingredientId)
        if(!ingredient){
            return res.status(404).json({
                success:false,message:"ingredient not found"
            })
        }
        const totalPrice=quantity*unitPrice
        const newPurchase =new PurchaseModel({
            ingredientId:ingredient._id,
            ingredientName:ingredient.name,
            quantity,
            supplier,
            unitPrice,
            totalPrice,
            createdBy:req.user.id

        })
        await newPurchase.save()
        const oldTotalValue = ingredient.currentStock * ingredient.avgCostPerUnit
        const newTotalStock = ingredient.currentStock + Number(quantity)
        const newAvgCost = (oldTotalValue + totalPrice) / newTotalStock

        ingredient.currentStock = newTotalStock
        ingredient.avgCostPerUnit = newAvgCost
        await ingredient.save()
        res.status(200).json({
            success: true,
            message: "ingredient purchase successfully",
            currentStock: ingredient.currentStock,
            avgCostPerUnit: ingredient.avgCostPerUnit,
            data: newPurchase
        })
   
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
    module.exports = { purchaseIngreDient }
}