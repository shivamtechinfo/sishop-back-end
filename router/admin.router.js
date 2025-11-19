const adminRouter = require('express').Router();
const { login } = require('../controller/admin.controller');

adminRouter.post('/login', login)

module.exports = adminRouter
