const jwt = require("jsonwebtoken");

module.exports = (res, req, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "crackable_secret");
        next()
    }
    catch(error){
        res.status(401).json({
            message:"Auth is failed"
        })
    }
}