const colorModel = require('../model/color.model')
const { noContentResponse, createdResponse, serverErrorResponse, errorResponse, successResponse, updatedResponse, deletedResponse } = require('../utility/response')


const color = {
    async create(req, res) {
        try {
            const { name, slug, hexcode } = req.body
            if (!name || !slug || !hexcode) {
                return noContentResponse(res)
            }

            const existingItem = await colorModel.findOne({name})

            if (existingItem) {
                return serverErrorResponse(res, "color already created", 409)
            }
            const color = await colorModel.create({name, slug, hexcode})

            await color.save()
            return createdResponse(res, "color created successfully")

        } catch (error) {
            console.log(error);

            return serverErrorResponse(res)
        }
    },
    async read(req, res) {
        try {
            const id = req.params.id

            let color = null
            if (id) {
                color= await colorModel.findById(id)
            } else {
                color = await colorModel.find()
            }

            if (!color) errorResponse(res, "Color not found")
            return successResponse(res, "Color Found", color)

        } catch (error) {
            return serverErrorResponse(res, error.msg)
        }
    },
    async deleteById(req, res) {
        try {
            const id = req.params.id;
            const existingItem = await colorModel.findById(id);
          
            await colorModel.findByIdAndDelete(id)
            return deletedResponse(res)
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
    async status(req, res) {
        try {
            const id = req.params.id;
            const color = await colorModel.findById(id);
            await colorModel.findByIdAndUpdate(
                id,
                { $set: { status: !color.status } }
            )
            return updatedResponse(res, "Status Update")
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
 
}

module.exports = color
