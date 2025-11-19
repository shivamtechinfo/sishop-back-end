const categoryModel = require('../model/category.model')
const { noContentResponse, createdResponse, serverErrorResponse, errorResponse, successResponse, updatedResponse, deletedResponse } = require('../utility/response')
const { createUniqueName } = require('../utility/helper')
const productModel = require('../model/product.model')
const fs = require('fs')

const category = {
    async create(req, res) {
        try {
            // console.log(req.body);
            // console.log(req.files);
            const categoryImg = req.files.image

            const { name, slug } = req.body
            if (!name || !slug) {
                return noContentResponse(res)
            }

            const existingItem = await categoryModel.findOne({
                name
            })

            if (existingItem) {
                return serverErrorResponse(res, "Category already created", 409)
            }

            const image = createUniqueName(categoryImg.name)

            const destination = 'public/images/category/' + image

            categoryImg.mv(
                destination,
                async (error) => {
                    if (error) {
                        return errorResponse(res, "File not found")
                    } else {
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image
                        })

                        await category.save()
                        return createdResponse(res, "category created successfully")
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

            let category = null
            if (id) {
                category = await categoryModel.findById(id)
            } else {
                category = await categoryModel.find()
                const data = await Promise.all(
                    category.map(
                        async (cat) => {
                            const productCount = await productModel.countDocuments({
                                categoryId:
                                    cat._id
                            });

                            return {
                                ...cat.toObject(),
                                productCount
                            }
                        }
                    )
                )

                return successResponse(res, "Category Found", data)
            }

            if (!category) errorResponse(res, "Category not found")
            return successResponse(res, "Category Found", category)

        } catch (error) {
            return serverErrorResponse(res, error.msg)
        }
    },
    async deleteById(req, res) {
        try {
            const id = req.params.id;
            console.log(id);

            const existingCat = await categoryModel.findById(id);
            if (existingCat) {
                fs.unlinkSync(`public/images/category/${existingCat.image}`)
            }
            await categoryModel.findByIdAndDelete(id)
            return deletedResponse(res)
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
    async status(req, res) {
        try {
            const id = req.params.id;
            const category = await categoryModel.findById(id);
            await categoryModel.findByIdAndUpdate(
                id,
                { $set: { status: !category.status } }
            )
            return updatedResponse(res, "Status Update")
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
    async update(req, res) {
        try {
            const id = req.params.id
            const categoryImg = req.files.image
            console.log(categoryImg, "categoryImg")
            console.log(req.body);



            const { name, slug } = req.body

            const existingItem = await categoryModel.findById(id)
            console.log(existingItem);

            if (!existingItem) {
                return serverErrorResponse(res, "Category not found", 409)
            }

            const update = {}
            if (name) update.name = name
            if (slug) update.slug = slug

            if (categoryImg) {
                const image = createUniqueName(categoryImg.name)
                const destination = 'public/images/category/' + image
                categoryImg.mv(
                    destination,
                    async (error) => {
                        if (error) {
                            return errorResponse(res, "File not found")
                        } else {
                            fs.unlinkSync(`public/images/category/${existingItem.image}`)
                            console.log(update);

                            update.image = image
                            await categoryModel.findByIdAndUpdate(
                                id,
                                { $set: update }
                            )


                            return updatedResponse(res, "category updated successfully")
                        }
                    }
                )
            }




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


}

module.exports = category
