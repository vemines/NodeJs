'use strict'

const productModel = require('../product.model')
const { Types } = require('mongoose')
const { BadRequestError, NotFoundError } = require('../../utils/error.response')
const { getSelectData, getUnSelectData } = require('../../utils')
const { toObjectIdMongo } = require('../../utils')

const queryProduct = async (query, limit, skip) => {
    return await productModel.find(query).
        populate('prod_shop', 'name email -_id') // get name and email and remove _id
        .sort({ updateAt: -1 })                     // take newest
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDrafts = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const findAllPublish = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}
/*
    expected search data with keysearch is
    {
        "_id": "65b6883ab78946c32ef6f6fb",
        "prod_name": "Quần Tây Nam Hàn Quốc KJ Ống Côn Cao Cấp Chất Vải Co Giãn Dày Dặn Form Slimfit Hàn Quốc KJ-Vua Quần Jeans",
        "prod_thumb": "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo1b08e8vmct74",
        "prod_price": 169000,
        "prod_quantity": 5,
        "prod_type": "Clothing",
        "prod_shop": {},
        "prod_attributes": {
            "brand": "KJ Vua Quần Jeans",
            "size": [
                "20",
                "24",
                "28"
            ],
            "material": "Cotton, Sợi tổng hợp",
            "made_in": "Việt Nam",
            "variations": [
                "Đen",
                "Xanh than"
            ]
        },
        "prod_ratings": [],
        "prod_ratingsAverage": 0,
        "createdAt": "2024-01-28T17:00:42.709Z",
        "updatedAt": "2024-01-28T17:01:43.083Z",
        "prod_slug": "quan-tay-nam-han-quoc-kj-ong-con-cao-cap-chat-vai-co-gian-day-dan-form-slimfit-han-quoc-kj-vua-quan-jeans",
        "__v": 0
}
*/
const searchProduct = async (keySearch) => {
    const regexSearch = new RegExp(keySearch)
    const results = await productModel.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results;
}

const publishProduct = async (prod_shop, prod_id) => {
    const holderProduct = await productModel.findById({
        _id: prod_id
    })
    if (!holderProduct) throw new NotFoundError("Product not found")

    holderProduct.isDraft = false
    holderProduct.isPublished = true
    const { modifiedCount } = await holderProduct.updateOne(holderProduct)
    return modifiedCount
}

const unPublishProduct = async (prod_shop, prod_id) => {
    const holderProduct = await productModel.findById({
        _id: prod_id
    })
    if (!holderProduct) throw new NotFoundError("Product not found")

    holderProduct.isDraft = true
    holderProduct.isPublished = false
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

const findProduct = async ({ prod_id, unSelect }) => {
    const product = await productModel
        .findById(prod_id)
        .select(getUnSelectData(unSelect))

    if (!product) throw new BadRequestError('Not found Product')

    return product
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

const getProductById = async ({ prod_id, select = [] }) => {
    return await productModel.findOne({
        _id: toObjectIdMongo(prod_id)
    })
        .select(getSelectData({ select: select }))
        .lean()
}

module.exports = {
    findAllDrafts,
    publishProduct,
    findAllPublish,
    unPublishProduct,
    searchProduct,
    findAllProducts,
    findProduct,
    updateProductById,
    checkProductByServer,
    getProductById,
}