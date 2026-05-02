const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if(!token){
            return res.json({ success: false, message: "No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

module.exports = protectRoute;