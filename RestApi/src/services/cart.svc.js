'use strict'

const CartRepository = require('../models/repositories/cart.repo');
const ProductService = require('./product.svc');

const { toObjectIdMongo } = require('../utils');
const { BadRequestError } = require('../utils/error.response')


class CartService {
    static getCartById = async ({ id }) => {
        const foundCart = await CartRepository.findById({ id })
        if (!foundCart) throw new BadRequestError('cart not exisis')
        return foundCart
    }
    // "product": {"prod_id" ,"shop_id": ,"quantity": }
    static addToCart = async ({ usr_id, product }) => {
        const foundProduct = await ProductService.checkProductExist({
            prod_id: product.prod_id
        })
        const userId = toObjectIdMongo(usr_id)

        const productPayload = {
            ...product,
            prod_name: foundProduct.prod_name,
            prod_price: foundProduct.prod_price
        }

        const userCart = await CartRepository.findOne({
            filter: { cart_usr_id: userId, cart_state: active }
        })
        if (!userCart) {
            const newCart = await this.createUserCart({ userId, productPayload })
            return newCart
        }

        if (userCart.cart_products.length === 0) {
            const filter = { cart_usr_id: userId };
            const update = {
                cart_products: [productPayload],
                cart_count_product: 1,
            }
            const options = { new: true };
            const result = await CartRepository.findOneAndUpdate({ filter, update, options })

            return result
        }

        const updateCart = await this.updateCartQuantity({ userId, productPayload })
        return updateCart
    }

    static createUserCart = async ({ usr_id, productPayload }) => {
        const userId = toObjectIdMongo(usr_id)
        const payload = {
            cart_usr_id: userId,
            cart_products: [productPayload],
            cart_count_product: 1,
            cart_state: 'active'
        }

        const newCart = await CartRepository.create({ payload })
        return newCart
    }

    static updateCartQuantity = async ({ usr_id, productPayload }) => {
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
    static updateCart = async ({ usr_id, shop_order_ids }) => {
        const { prod_id, quantity, old_quantity } = shop_order_ids.products
        const shop_id = shop_order_ids.shop_id

        const foundProduct = await ProductService.checkProductExist({
            prod_id: product.prod_id
        })
        if (foundProduct.prod_shop.toString() !== shop_id) {
            throw new BadRequestError('Product does not belong to shop')
        }

        return await this.updateCartQuantity({
            usr_id: toObjectIdMongo(usr_id),
            productPayload: {
                prod_id: prod_id,
                quantity: quantity - old_quantity
            }
        })
    }

    static deleteUserCart = async ({ usr_id, prod_id }) => {
        const query = {
            cart_usr_id: toObjectIdMongo(usr_id),
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

    static getListUserCart = async ({ usr_id }) => {
        const filter = {
            cart_usr_id: toObjectIdMongo(usr_id),
            cart_state: 'active'
        }
        return await CartRepository.findOne({ filter })
    }
    static clearUserCart = async ({ usr_id }) => {
        const filter = {
            cart_usr_id: toObjectIdMongo(usr_id),
            cart_state: 'active'
        }
        console.log(await CartRepository.findOne({ filter }));
        const update = {
            $set: { cart_count_product: 0, cart_products: [] }
        }
        const options = { new: true };
        return await CartRepository.findOneAndUpdate({ filter, update, options })
    }

    static transferCartUserId = async ({ old_usr_id, new_usr_id, cart_id }) => {
        const filter = {
            _id: toObjectIdMongo(cart_id),
            cart_usr_id: toObjectIdMongo(old_usr_id),
            cart_state: 'active'
        }
        const update = {
            $set: { cart_usr_id: toObjectIdMongo(new_usr_id) }
        }
        const options = { new: true };
        return await CartRepository.findOneAndUpdate({ filter, update, options })
    }

    static completeCart = async ({ cart_id }) => {
        const filter = {
            _id: toObjectIdMongo(cart_id),
            cart_state: 'active'
        }
        const update = {
            $set: { cart_state: 'complete' }
        }
        const options = { new: true };
        return await CartRepository.findOneAndUpdate({ filter, update, options })
    }
}

module.exports = CartService