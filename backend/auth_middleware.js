const jwttoken = require("jsonwebtoken")
const JWT_SECRET = require("./config")



const authMiddleware = (req,res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(403).json({
            message: "User unauthorized"
        });
    }
  

    const token = authHeader.split(" ")[1];
    
    try{
        const decoded = jwttoken.verify(token, JWT_SECRET);
        req.userId = decoded.user_id
        next();
    }

    catch{
        return res.status(403).json({
            message: "User unauthorized"
        });

    }

};

module.exports = {
    authMiddleware
}