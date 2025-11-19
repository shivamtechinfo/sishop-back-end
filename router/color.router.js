const colorRouter = require('express').Router();
const { create, read, deleteById, status } = require('../controller/color.controller');
const authMiddleware = require('../middleware/authMiddleware');

colorRouter.post('/create', authMiddleware, create)
colorRouter.get('/:id?', read);
colorRouter.delete('/delete/:id?', deleteById);
colorRouter.patch('/status/:id?', status);
module.exports = colorRouter;
