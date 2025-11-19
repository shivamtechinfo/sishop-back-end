const categoryRouter = require('express').Router()
const {create, read, deleteById, status, update} = require('../controller/category.controller')
const fileupload = require('express-fileupload')

categoryRouter.post('/create',fileupload({createParentPath: true}), create)
categoryRouter.get('/:id?', read)
categoryRouter.delete('/delete/:id', deleteById)
categoryRouter.patch('/status/:id', status)
categoryRouter.put('/update/:id', fileupload({createParentPath: true}),  update)

module.exports = categoryRouter
