const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin','staff'], default: 'user' },
    profileImage: { type: String },
    status: { type: String, enum: ['active', 'inactive','terminated'], default: 'active' }
}, { timestamps: true })

const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel;
