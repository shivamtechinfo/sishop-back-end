const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utility/response');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return errorResponse(res, 'No token provided, authorization denied', 401)
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return errorResponse(res, 'Token is not valid', 401)
    }
};

module.exports = authMiddleware;
