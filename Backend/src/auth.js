const jwt = require('jsonwebtoken');
const User = require("../model/user");

const protect = async (req, res,next) => {
    let token;

    try {
        //format: {Bearer token}
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // get the token
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_Secret);

            req.user = await User.findById(decoded.id).select('-password');
         
        } else {
            return res.status(401).json({ message: 'Not authorized, Missing token' });
        }
        //pass to the next middleware/route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { protect };
