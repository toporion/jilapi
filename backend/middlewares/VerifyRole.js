

const verifyRole=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden: You don't have enough permission to access this resource"})
        }
        next()
    }
}

module.exports=verifyRole;