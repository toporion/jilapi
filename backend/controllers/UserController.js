const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(403).json({ success: false, message: "User already exist" })
        }

        const profileImage = req.file ? req.file.path : null;
        const hashedPassword = await bcrypt.hash(String(password), 10)
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword,
            profileImage
        })
        await newUser.save()
        res.status(200).json({
            success: true,
            message: "Successfully create user",
            data: newUser
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: true, message: "internal server error"
        })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(403).json({
                success: false, message: "user not exist"
            })
        }
        const isMatched = await bcrypt.compare(String(password), user.password)
        if (!isMatched) {
            res.status(403).json({ success: false, message: "password not matched" })
        }
        const jwtToken = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
            profileImage: user.profileImage
        }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).json({
            success: true,
            jwtToken,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: true, message: "internal server error"
        })
    }
}
const getUsers = async (req, res) => {
    try {
        let { search, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        let searchCriteria = {};
        if (search) {
            searchCriteria = {
                $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
            }
        }
        const totalUsers = await UserModel.countDocuments(searchCriteria);
        const users = await UserModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({
            success: true,
            message: "user fetch successfully",
            data:{
                totalUsers,
                totalPages,
                currentPage: page,
                users
            }
        })
    } catch (error) {
        console.log('see the error', error)
        res.status(500).json({
            success: false, message: "internal server error"
        })
    }
}

const getuserById=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await UserModel.findById(id)
        res.status(200).json({
            success:true,
            message:"user fetch successfully",
            data:user
        })


    }catch(error){
        console.log('see the error',error)
        res.status(500).json({
            success:false,message:"internal server error"
        })
    }
}

const updateRole=async(req,res)=>{
    try{
        const {id}=req.params
        const {role}=req.body
        const RoleUpdate=await UserModel.findByIdAndUpdate(
            id,
            {role},
            {new:true}

        )
        res.status(200).json({
            success:true,
            message:"user role update successfully",
            data:RoleUpdate
        })

    }catch(error){
        console.log('see the error',error)
        res.status(500).json({
            success:false,message:"internal server error"

        })
    }
}
module.exports = { createUser, loginUser, getUsers,getuserById,updateRole };