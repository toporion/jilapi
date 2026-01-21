const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(403).json({success:false,message:"Invalid token"})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoded;
    next()
}

module.exports=verifyToken;
