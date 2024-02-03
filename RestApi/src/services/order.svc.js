
const CartService = require('./cart.svc')
const UserService = require('./user.svc')
const ProductService = require('./product.svc')
const DiscountService = require('./discount.svc')

const OrderRepository = require('../models/repositories/order.repo')
const RedisService = require('./redis.svc')

const { BadRequestError } = require('../utils/error.response')


class CheckoutSerivce {
    static async orderReview({ payload }) {
        const { cart_id, usr_id, shop_order_ids } = payload
        // check cart id exist
        const foundCart = await CartService.getCartById({ id: cart_id })

        const checkout_order = {
            totalPrice: 0,
            feeShop: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shop_id, shop_discounts, item_products } = shop_order_ids[i]

            const foundProduct = await ProductService.checkProductsCheckout({ products: item_products })
            // check is some product not found
            if (foundProduct.some(x => !x)) {
                throw new BadRequestError('order wrong')
            }

            // total price order
            const checkoutPrice = foundProduct
                .reduce((acc, product) => acc + (product.quantity * product.prod_price), 0)

            checkout_order.totalPrice += checkoutPrice

            const item_checkout = {
                shop_id,
                shop_discounts,
                price_raw: checkoutPrice,
                price_apply_discount: checkoutPrice,
                item_products: foundProduct
            }
            // check discount valid
            if (shop_discounts.length > 0) {
                const { discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].code,
                    usr_id,
                    shop_id,
                    prods: foundProduct
                })
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    item_checkout.price_apply_discount = checkoutPrice - discount
                }
            }
            checkout_order.totalCheckout += item_checkout.price_apply_discount
            shop_order_ids_new.push({
                item_checkout
            })
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static createOrder = async ({ payload }) => {
        const {
            shop_order_ids, cart_id, usr_id, payment = {}
        } = payload
        const { usr_address = {}, usr_address_city = {} } = await UserService.findUserById({ usr_id })

        const { checkout_order, shop_order_ids_new } = await this.orderReview({
            payload: {
                cart_id,
                usr_id,
                shop_order_ids,
            }
        })

        // check exceeding inventory
        const acquireProduct = []
        const itemCheckout = shop_order_ids_new.flatMap(order => order.item_checkout)
        for (let i = 0; i < itemCheckout.length; i++) {
            const shop_id = itemCheckout[i].shop_id
            // const checkoutProducts = itemCheckout[i].flatMap(checkout => checkout.item_products)
            const checkoutProducts = Array.isArray(itemCheckout[i])
                ? itemCheckout[i].flatMap(checkout => checkout.item_products)
                : itemCheckout[i].item_products
            for (const checkout of checkoutProducts) {
                const { prod_id, quantity } = checkout
                await ProductService.checkProductExist({
                    prod_id,
                })
                const keyLock = await RedisService.acquireLockOrder({ prod_id, quantity, shop_id })
                acquireProduct.push(keyLock ? true : false)
                if (keyLock) {
                    // after 5s it auto expired, 50ms * 10 is check time comment releaseLock for testing
                    await RedisService.releaseLockOrder(keyLock)
                }
            }
        }
        // if 1 items is fail in reservationInventory warn user
        if (acquireProduct.some(x => !x)) {
            // make sure you uncomment await RedisService.releaseLockOrder(keyLock)
            throw new BadRequestError('some product is updated, please update cart')
        }
        const payloadOrder = {
            order_usr_id: usr_id,
            order_checkout: checkout_order,
            order_shipping: usr_address + usr_address_city,
            order_payment: payment,
            order_products: shop_order_ids_new
        }
        const newOrder = await OrderRepository.create({
            payload: payloadOrder
        })

        if (newOrder) {
            CartService.completeCart({ cart_id })
        }
        return newOrder
    }

    // query order [user]
    static async getOrdersByUser({ usr_id }) { }

    // query one order by id
    static async getOneOrderById() { }

    // cancel order [user]
    static async cancelOrderById() { }

    // update [shop]
    static async updateOrderStatusByShop() { }
}

module.exports = CheckoutSerivce