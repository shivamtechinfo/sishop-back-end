const adminModel = require('../model/admin.model')
const { noContentResponse, createdResponse, serverErrorResponse, errorResponse, successResponse, deletedResponse, updatedResponse } = require('../utility/response')
var jwt = require('jsonwebtoken');

const admin = {

    async login(req, res) {
        try {
            // console.log(req.body);
             console.log("Login Request Body:", req.body);
            const { email, password } = req.body;
            const admin = await adminModel.findOne({ email: email });
            if (!admin) return errorResponse(res, "Admin not found")
            if (password !== admin.password) return errorResponse(res, "Password not match")

            //add jwt function jo token ko create karega
            const token = jwt.sign({
                id: admin._id,
                email: admin.email
            }, process.env.TOKEN_SECRET_KEY, { expiresIn: '7d' });
            res.cookie('admin_token', token, {
                maxAge: 7 * 24 * 60 * 60, // 1 hour
                httpOnly: false,    // Not accessible by JS
                secure: false,    // Only sent over HTTPS
                samesite: 'strict'    // CSRF protection
            });
            return successResponse(res,  "Admin login")

        } catch (error) {
            return serverErrorResponse(res, error.message);
        }
    }


}

module.exports = admin
