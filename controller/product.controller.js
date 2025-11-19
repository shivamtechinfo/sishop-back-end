const productModel = require('../model/product.model')
const { noContentResponse, createdResponse, serverErrorResponse, errorResponse, successResponse, updatedResponse, deletedResponse } = require('../utility/response')
const { createUniqueName } = require('../utility/helper')
const fs = require('fs')
const categoryModel = require('../model/category.model')
const brandModel = require('../model/brand.model')
const colorModel = require('../model/color.model')
const { log } = require('console')


async function saveFile(imageObj) {
    const imageName = createUniqueName(imageObj.name)
    const destination = 'public/images/product/' + imageName
    await imageObj.mv(destination)
    return imageName
}



const product = {
    async create(req, res) {
        try {
            // console.log(req.body);
            // console.log(req.files);
            // Save thumbnail
            const thumbnail = req.files?.thumbnail
                ? await saveFile(req.files.thumbnail)
                : null

            // Save multiple images
            const images = req.files?.images
                ? await Promise.all(
                    (Array.isArray(req.files.images)
                        ? req.files.images
                        : [req.files.images]
                    ).map((img) => saveFile(img))
                )
                : []

            // Create product
            await productModel.create({
                ...req.body,
                colors: req.body.colors ? JSON.parse(req.body.colors) : [],
                thumbnail,
                images
            })

            return res.status(201).json({ success: true, message: "Product created successfully" })
        } catch (error) {
            console.log(error);

            return serverErrorResponse(res)
        }
    },
    async read(req, res) {
        try {
            // console.log(req.query);
            const {categorySlug, brandSlug, colorSlug, min, max} = req.query
            console.log(categorySlug, brandSlug, colorSlug, "all three");
            
            const id = req.params.id
            const filterQuery = {}
            if(categorySlug) {
                const category = await categoryModel.findOne({slug : categorySlug})
                if(category) {
                    filterQuery.categoryId = category._id
                }
                // console.log(category);
            }
            // console.log(filterQuery);

              if(brandSlug) {
                const brand = await brandModel.findOne({slug : brandSlug})
                if(brand) {
                    filterQuery.brandId = brand._id
                }
                // console.log(category);
            }
            
               if(colorSlug) {
                const color = await colorModel.findOne({slug : colorSlug})
                if(color) {
                    filterQuery.colors = color._id
                    //colors == colorId kyoki database me colors ke name se save hai id
                }
                // console.log(category);
            }

             if(min && max) {
                filterQuery.finalPrice={
                    $gte: min,
                    $lte: max
                }
            }


            let product = null;
            if (id) {
                product = await productModel.findById(id)
            } else {
                product = await productModel.find(filterQuery).populate("colors");
            }

            if (!product) errorResponse(res, "product not found")
            return successResponse(res, "Product Found", product)
        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }
    },
    async status(req, res) {
        try {
            const { flag } = req.body
            const id = req.params.id;
            const product = await productModel.findById(id);
            if (!product) return noContentResponse(res);
            const updateKey = {};
            if (flag == 1) {
                updateKey.status = !product.status
            } else if (flag == 2) {
                updateKey.stock = !product.stock
            } else if (flag == 3) {
                updateKey.topSelling = !product.topSelling
            }


            await productModel.findByIdAndUpdate(
                id,
                {
                    $set: updateKey
                }
            )

            return updatedResponse(res)

        } catch (error) {
            return serverErrorResponse(res, error.errmsg)
        }

    }

}

module.exports = product


