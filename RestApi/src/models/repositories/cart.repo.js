const cartModel = require('../cart.model')
const { getProductById } = require('./product.repo')
const { Types } = require('mongoose')

'use strict'

const cartModel = require('../models/cart.model');
const { NotFoundError } = require('../utils/error.response')

class CartRepository {
    static async addToCart(usr_id, product) {
        // Your logic here
    }

    static async addProductToCart(usr_id, productData) {
        // Your logic here
    }

    static async updateUserCartQuantity(usr_id, productData) {
        // Your logic here
    }

    static async updateCart(usr_id, shop_order_id) {
        // Your logic here
    }

    static async deleteUserCart(usr_id, prod_id) {
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

        return await cartModel.updateOne(query, updateSet)
    }

    static async getListUserCart(usr_id) {
        return await cartModel.findOne({
            cart_usr_id: +usr_id
        }).lean()
    }
}

module.exports = CartRepository

const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: new Types.ObjectId(cartId), cart_state: 'active' }).lean()
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
    findCartById,
    checkProductByServer
}