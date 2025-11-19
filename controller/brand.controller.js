const brandModel = require('../model/brand.model')
const { noContentResponse, createdResponse, serverErrorResponse, errorResponse, successResponse, updatedResponse, deletedResponse } = require('../utility/response')
const { createUniqueName } = require('../utility/helper')
const fs = require('fs')

const brand = {
    async create(req, res) {
        try {
            // console.log(req.body);
            // console.log(req.files);
            const brandImg = req.files.image

            const { name, slug } = req.body
            if (!name || !slug) {
                return noContentResponse(res)
            }

            const existingItem = await brandModel.findOne({
                name
            })

            if (existingItem) {
                return serverErrorResponse(res, "Brand already created", 409)
            }

            const image = createUniqueName(brandImg.name)

            const destination = 'public/images/brand/' + image

            brandImg.mv(
                destination,
                async (error) => {
                    if (error) {
                        return errorResponse(res, "File not found")
                    } else {
                        const brand = await brandModel.create({
                            name,
                            slug,
                            image
                        })

                        await brand.save()
                        return createdResponse(res, "brand created successfully")
                    }
                }
            )

            // const category = await categoryModel.create({
            //     name,
            //     slug
            // })

            // await category.save()
            // return createdResponse(res, "category created successfully")

        } catch (error) {
            console.log(error);

            return serverErrorResponse(res)
        }
    },
    async read(req, res) {
        try {
            const id = req.params.id

            let brand = null
            if (id) {
                brand = await brandModel.findById(id)
            } else {
                brand = await brandModel.find()
            }

            if (!brand) errorResponse(res, "Brand not found")
            return successResponse(res, "Brand Found", brand)

        } catch (error) {
            return serverErrorResponse(res, error.msg)
        }
    },
    async deleteById(req, res) {
        try {
            const id = req.params.id;
            const existingItem = await brandModel.findById(id);
            if (existingItem) {
                fs.unlinkSync(`public/images/brand/${existingItem.image}`)
            }
            await brandModel.findByIdAndDelete(id)
            return deletedResponse(res)
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
}

module.exports = brand
