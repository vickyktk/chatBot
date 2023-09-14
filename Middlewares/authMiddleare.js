const jwt = require('jsonwebtoken')
let mongoUser=require('../Model/user')

const verifyToken = async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get Token from headers
            token = req.headers.authorization.split(' ')[1]
            // Verify the token
            const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            req.user_id = decoded.id
            next();
        } catch (error) {
            return res.status(200).json({
                success:false,
                message:error.name
            })
        }
    }
    if(!token) {
        return res.status(200).json({
            success:false
        })
    }
}

module.exports = {
    verifyToken
}