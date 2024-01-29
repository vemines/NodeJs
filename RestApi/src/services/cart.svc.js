'use strict'

const cartModel = require('../models/cart.model');

const { findProductByUser } = require('../models/repositories/product.repo')
const { NotFoundError, BadRequestError } = require('../utils/error.response')


class CartService {
    // "product": {"prod_id" ,"shop_id": ,"quantity": }
    static async addToCart({ usr_id, product }) {
        const foundProduct = await findProductByUser({ prod_id: product.prod_id })
        if (!foundProduct)
            throw new NotFoundError('Product not found')

        const productData = {
            ...product,
            prod_name: foundProduct.prod_name,
            prod_price: foundProduct.prod_price
        }

        const userCart = await cartModel.findOne({ cart_usr_id: usr_id, 'cart_products.prod_id': product.prod_id })
        if (!userCart) {
            return await this.addProductToCart(usr_id, productData)
        }

        return await this.updateUserCartQuantity({ usr_id, productData })
    }

    static async addProductToCart(usr_id, productData) {
        const query = { cart_usr_id: usr_id, cart_state: 'active' }

        const updateOrInsert = {
            $addToSet: { cart_products: productData },
            $inc: { cart_count_product: 1 }
        }
        const options = {
            upsert: true, new: true
        }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ usr_id, productData }) {
        const { prod_id, quantity } = productData
        const query = {
            cart_usr_id: usr_id,
            'cart_products.prod_id': prod_id,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = {
            upsert: true,
            new: true,
        }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    // 'shop_order_ids': { 'products' : { 'quantity': ,'price': ,'shop_id': ,'old_quantity': ,'prod_id': ,} 'version', }
    static async updateCart({ usr_id, shop_order_id }) {
        const { prod_id, quantity, old_quantity } = shop_order_id.product
        const shop_id = shop_order_id.shop_id

        const foundProduct = await findProductByUser({ prod_id: prod_id })
        if (!foundProduct)
            throw new NotFoundError('product not found')

        if (foundProduct.prod_shop.toString() !== shop_id) {
            throw new NotFoundError('Product does not belong to shop')
        }
        if (quantity === 0) {
            // delete product
        }

        return await this.updateUserCartQuantity({
            usr_id,
            productData: {
                prod_id: prod_id,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ usr_id, prod_id }) {
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

        const deleteCart = cartModel.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ usr_id }) {
        const query = {
            cart_usr_id: usr_id,
            cart_state: 'active'
        }
        console.log(query);
        return await cartModel.findOne(query)
    }
    static async clearUserCart({ usr_id }) {
        const query = {
            cart_usr_id: usr_id,
            cart_state: 'active'
        },
            update = {
                $set: {
                    cart_count_product: 0, cart_products: []
                }
            }
        return await cartModel.findOneAndUpdate(query, update, { new: true })
    }
}

module.exports = CartService