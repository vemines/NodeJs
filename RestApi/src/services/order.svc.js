
const CartService = require('./cart.svc')
const ProductService = require('./product.svc')
const DiscountService = require('./discount.svc')
// const OrderService = require('../models/order.model')

const { NotFoundError, BadRequestError } = require('../utils/error.response')
// const { acquireLock, releaseLock } = require('./redis.svc')

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
            console.log(foundProduct);
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
                checkout_order.discount_amount += discount
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

    static orderByUser = async ({
        shop_order_ids,
        cart_id,
        usr_id,
        userAddress = {},
        userPayment = {}
    }) => {
        const { checkout_order, shop_order_ids_new } = await this.orderReview({
            shop_order_ids,
            cart_id,
            usr_id,
        })

        // check exceeding inventory
        const products = shop_order_ids_new.flatMap(order => order.item_products)

        const acquireProduct = []
        for (const productItem of products) {
            const { prod_id, quantity } = productItem
            const keyLock = await acquireProduct(prod_id, quantity, cart_id)
            acquireProduct.push(keyLock ? true : false)

            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        if (acquireProduct.some(x => !x)) {
            throw new BadRequestError('some product is updated, please update cart')
        }

        const newOrder = await orderModel.create({
            order_usr_id: usr_id,
            order_checkout: checkout_order,
            order_shipping: userAddress,
            order_payment: userPayment,
            order_products: shop_order_ids_new
        })

        if (newOrder) {
            // remove product in cart
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