'use strict'

const model = require('../cart.model')
const { getProductById } = require('./product.repo')
const { Types } = require('mongoose')

class CartRepository {

    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }
}

const deleteUserCart = async (usr_id, prod_id) => {
    const query = {
        cart_usr_id: usr_id,
        cart_state: 'active',
        cart_products: { $elemMatch: { prod_id } }
    }
    const updateSet = {
        $pull: {
            cart_products: { prod_id }
        },
        $inc: { cart_count_product: -1 }
    }

    return await model.updateOne(query, updateSet)
}

const getListUserCart = async (usr_id) => {
    return await model.findOne({
        cart_usr_id: +usr_id
    }).lean()
}



const findCartById = async (cartId) => {
    return await model.findOne({ _id: new Types.ObjectId(cartId), cart_state: 'active' }).lean()
}

const checkProductByServer = async (products) => {
    return Promise.all(products.map(async product => {
        const foundProduct = await getProductById({ prod_id: product.prod_id })
        if (foundProduct) {
            return {
                price: foundProduct.prod_price,
                quantity: foundProduct.prod_quantity,
                productId: foundProduct._id
            }
        }
    }))
}


module.exports = {
    CartRepository,
    deleteUserCart,
    getListUserCart,
    findCartById,
    checkProductByServer
}