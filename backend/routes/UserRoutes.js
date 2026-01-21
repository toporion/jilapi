const { createUser, loginUser, getUsers, getuserById, updateRole } = require('../controllers/UserController')
const fileUploader = require('../middlewares/FileUploader')
const verifyToken = require('../middlewares/VerifyToken')

const route=require('express').Router()

route.post('/register',fileUploader.single('profileImage'),createUser)
route.post('/login',loginUser)
route.get('/users',verifyToken,getUsers)
route.get('/users/:id',verifyToken,getuserById)
route.put('/users_role/:id',verifyToken,updateRole)

module.exports=route;