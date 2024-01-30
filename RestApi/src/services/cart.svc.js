'use strict'

const cartModel = require('../models/cart.model');
const { CartRepository } = require('../models/repositories/cart.repo');
const { ProductRepository } = require('../models/repositories/product.repo');

const { findProductByUser, ProductRepository } = require('../models/repositories/product.repo');
const { toObjectIdMongo } = require('../utils');
const { NotFoundError, BadRequestError } = require('../utils/error.response')


class CartService {
    // "product": {"prod_id" ,"shop_id": ,"quantity": }
    static async addToCart({ usr_id, product }) {
        const foundProduct = await ProductRepository.find({
            filter: { prod_id: toObjectIdMongo(product.prod_id), prod_is_published: true }
        })
        if (!foundProduct) throw new NotFoundError('Product not found')

        const productData = {
            ...product,
            prod_name: foundProduct.prod_name,
            prod_price: foundProduct.prod_price
        }

        const userCart = await CartRepository.findOne({
            filter: { cart_usr_id: usr_id, 'cart_products.prod_id': product.prod_id }
        })
        if (!userCart) {
            const newCart = await this.createUserCart({ usr_id, productData })
            return newCart
        }

        const updateCart = await this.updateUserCartQuantity({ usr_id, productData })
        return updateCart
    }

    static async createUserCart({ usr_id, productData }) {
        const payload = {
            cart_usr_id: usr_id,
            cart_products: [productData],
            cart_count_product: 1,
            cart_state: 'active'
        }

        const newCart = await CartRepository.create({ payload })
        return newCart
    }

    static async updateUserCartQuantity({ usr_id, productData }) {
        const { prod_id, quantity } = productData
        const filter = {
            cart_usr_id: usr_id,
            'cart_products.prod_id': prod_id,
            cart_state: 'active'
        }
        const update = { $inc: { 'cart_products.$.quantity': quantity } }
        const options = { upsert: true, new: true };

        return await CartRepository.findOneAndUpdate(filter, update, options)
    }

    // 'shop_order_ids': { 'products' : { 'quantity': ,'price': ,'shop_id': ,'old_quantity': ,'prod_id': ,} 'version', }
    static async updateCart({ usr_id, shop_order_id }) {
        const { prod_id, quantity, old_quantity } = shop_order_id.product
        const shop_id = shop_order_id.shop_id

        const foundProduct = await ProductRepository.find({
            filter: { prod_id: toObjectIdMongo(product.prod_id), prod_is_published: true }
        })
        if (!foundProduct) throw new NotFoundError('product not found')

        if (foundProduct.prod_shop.toString() !== shop_id) {
            throw new BadRequestError('Product does not belong to shop')
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
        const update = {
            $pull: { cart_products: { prod_id } },
            $inc: { cart_count_product: -1 }
        }
        const options = { upsert: true, new: true };

        const updateCart = CartRepository.updateOne({ query, update, options })
        return updateCart
    }

    static async getListUserCart({ usr_id }) {
        const filter = {
            cart_usr_id: usr_id,
            cart_state: 'active'
        }
        return await CartRepository.findOne({ filter })
    }
    static async clearUserCart({ usr_id }) {
        const filter = {
            cart_usr_id: usr_id,
            cart_state: 'active'
        }
        const update = {
            $set: { cart_count_product: 0, cart_products: [] }
        }
        const options = { upsert: true, new: true };
        return await CartRepository.findOneAndUpdate(filter, update, options)
    }
}

module.exports = CartService