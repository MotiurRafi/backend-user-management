const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next)=>{
    const token = req.headers['authorization']

    if(!token){
        return res.status(401).json('No token provided');
    }
    jwt.verify(token,'secret_key',(err,decoded)=>{
        if(err){
            return res.status(401).json('Token is not valid')
        }
        req.userId = decoded.id
        next()
    })
}