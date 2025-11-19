const productRouter = require('express').Router()
const {create, read, status} = require('../controller/product.controller')
const fileupload = require('express-fileupload')

productRouter.post('/create',fileupload({createParentPath: true}), create)
productRouter.get('/:id?', read)
productRouter.patch('/status/:id?', status)


module.exports = productRouter
