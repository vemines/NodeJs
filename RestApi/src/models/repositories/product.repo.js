'use strict'

const model = require('../product.model')
const { Types } = require('mongoose')
const { BadRequestError, NotFoundError } = require('../../utils/error.response')
const { getSelectData, getUnSelectData } = require('../../utils')
const { toObjectIdMongo } = require('../../utils')

class ProductRepository {
    static find = async ({ filter, projection, options }) => {
        return await model.find(filter, projection, options)
    }

    static findByIdAndUpdate = async ({ prod_id, update, options }) => {
        return await model.findByIdAndUpdate(prod_id, update, options)
    }
    static findById = async ({ prod_id, projection, options }) => {
        return await model.findById(prod_id, projection, options)
    }

    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

const queryProduct = async (query, limit, skip) => {
    return await productModel.find(query)
        .populate('prod_shop', 'name email -_id')  // get name and email and remove _id
        .sort({ score: { $meta: 'textScore' } })  // take newest
        .lean()
        .exec()
}

const findAllDrafts = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const findAllPublish = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const searchProduct = async (keySearch) => {
    const regexSearch = new RegExp(keySearch)
    const results = await productModel.find({
        prod_is_published: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })    // score is special feature of $text search
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results;
}

const publishProduct = async (prod_shop, prod_id) => {
    const holderProduct = await productModel.findById({
        _id: prod_id
    })
    if (!holderProduct) throw new NotFoundError("Product not found")

    holderProduct.prod_is_draft = false
    holderProduct.prod_is_published = true
    const { modifiedCount } = await holderProduct.updateOne(holderProduct)
    return modifiedCount
}

const unPublishProduct = async (prod_shop, prod_id) => {
    const holderProduct = await productModel.findById({
        _id: prod_id
    })
    if (!holderProduct) throw new NotFoundError("Product not found")

    holderProduct.prod_is_draft = true
    holderProduct.prod_is_published = false
    const { modifiedCount } = await holderProduct.updateOne(holderProduct)
    return modifiedCount
}

const findAllProducts = async (limit, sort, page, filter, select) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await productModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData({ select: select }))
        .lean()

    return products
}

const findProduct = async ({ prod_id, unSelect = {} }) => {
    const product = await productModel.findById(prod_id)
        .select(getUnSelectData(unSelect))

    if (!product) throw new BadRequestError('Not found Product')

    return product
}

const findProductByUser = async ({ prod_id }) => {
    return await productModel.findOne({ _id: toObjectIdMongo(prod_id), prod_is_published: true })
}

const updateProductById = async ({
    prod_id,
    bodyUpdate,
    model,
}) => {
    return await model.findByIdAndUpdate(prod_id, bodyUpdate, { new: true })
}


const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await findProduct({ prod_id: product.prod_id })
        if (foundProduct) {
            return {
                price: foundProduct.prod_price,
                quantity: foundProduct.quantity,
                producId: foundProduct.prod_id
            }
        }
    }))
}

module.exports = {
    ProductRepository,
    queryProduct,
    findAllDrafts,
    findAllPublish,
    searchProduct,
    publishProduct,
    unPublishProduct,
    findAllProducts,
    findProduct,
    findProductByUser,
    updateProductById,
    checkProductByServer
}
