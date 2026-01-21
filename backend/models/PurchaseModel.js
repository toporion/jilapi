const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ingredients', required: true },
    ingredientName:{type:String,required:true},
    quantity: { type: Number, required: true },
    supplier: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now},
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    
},{timestamps:true})

const PurchaseModel = mongoose.model('purchases', purchaseSchema)
module.exports = PurchaseModel;