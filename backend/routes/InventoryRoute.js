const { addIngredient, getIngredients, getIngreDientById, purchaseIngredient, deleteIngredient, updateIngredient } = require('../controllers/InventoryController')
const { addRecipe, getRecipes, updateRecipe, deleteRecipe } = require('../controllers/RecipeController')
const { createSale } = require('../controllers/SalesController')
const fileUploader = require('../middlewares/FileUploader')
const verifyToken = require('../middlewares/VerifyToken')

const route=require('express').Router()


route.post('/add_ingredient',verifyToken, fileUploader.single('image'),addIngredient)
route.get('/ingredients',verifyToken,getIngredients)
route.get('/single_ingredient/:id',verifyToken,getIngreDientById)
// Buy Stock (e.g., Buying 50kg of Mango Pulp)
route.post('/ingredient/purchase', verifyToken, purchaseIngredient);
route.post('/recipe/add', verifyToken, addRecipe);
route.get('/recipes', verifyToken, getRecipes);
route.post('/sales/checkout', verifyToken, createSale);
route.delete('/delete_ingredient/:id', verifyToken, deleteIngredient);
route.put('/update_ingredient/:id', verifyToken, fileUploader.single('image'), updateIngredient);
route.put('/update_recipe/:id', verifyToken, updateRecipe);
route.delete('/delete_recipe/:id', verifyToken, deleteRecipe);

module.exports=route;