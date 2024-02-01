'use strict'

const CartRepository = require('../models/repositories/cart.repo');
const ProductService = require('./product.svc');

const { toObjectIdMongo } = require('../utils');
const { NotFoundError, BadRequestError } = require('../utils/error.response')


class CartService {
    // "product": {"prod_id" ,"shop_id": ,"quantity": }
    static async addToCart({ usr_id, product }) {
        const foundProduct = await ProductService.checkProductExist({
            prod_id: product.prod_id
        })

        const productPayload = {
            ...product,
            prod_name: foundProduct.prod_name,
            prod_price: foundProduct.prod_price
        }

        const userCart = await CartRepository.findOne({
            filter: { cart_usr_id: usr_id }
        })
        if (!userCart) {
            const newCart = await this.createUserCart({ usr_id, productPayload })
            return newCart
        }

        if (userCart.cart_products.length === 0) {
            const filter = { cart_usr_id: usr_id };
            const update = {
                cart_products: [productPayload],
                cart_count_product: 1,
            }
            const options = { new: true };
            const result = await CartRepository.findOneAndUpdate({ filter, update, options })

            return result
        }

        const updateCart = await this.updateUserCartQuantity({ usr_id, productPayload })
        return updateCart
    }

    static async createUserCart({ usr_id, productPayload }) {
        console.log("create");
        const payload = {
            cart_usr_id: usr_id,
            cart_products: [productPayload],
            cart_count_product: 1,
            cart_state: 'active'
        }

        const newCart = await CartRepository.create({ payload })
        return newCart
    }

    static async updateUserCartQuantity({ usr_id, productPayload }) {
        const { prod_id, quantity } = productPayload
        const filter = {
            cart_usr_id: usr_id,
            'cart_products.prod_id': prod_id,
            cart_state: 'active'
        }
        const update = { $inc: { 'cart_products.$.quantity': quantity } }
        const options = { new: true };

        return await CartRepository.findOneAndUpdate({ filter, update, options })
    }

    // 'shop_order_ids': { 'products' : { 'quantity': ,'old_quantity': ,'prod_id': ,} 'version', }
    static async updateCart({ usr_id, shop_order_ids }) {
        const { prod_id, quantity, old_quantity } = shop_order_ids.products
        const shop_id = shop_order_ids.shop_id

        const foundProduct = await ProductService.checkProductExist({
            prod_id: product.prod_id
        })
        if (foundProduct.prod_shop.toString() !== shop_id) {
            throw new BadRequestError('Product does not belong to shop')
        }

        return await this.updateUserCartQuantity({
            usr_id,
            productPayload: {
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
        const options = { new: true };

        const updateCart = CartRepository.findOneAndUpdate({ query, update, options })
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
        console.log(await CartRepository.findOne({ filter }));
        const update = {
            $set: { cart_count_product: 0, cart_products: [] }
        }
        const options = { new: true };
        return await CartRepository.findOneAndUpdate({ filter, update, options })
    }
}

module.exports = CartService