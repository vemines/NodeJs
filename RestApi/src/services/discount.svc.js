'use strict'

const ProductService = require('./product.svc')
const DiscountRepository = require('../models/repositories/discount.repo')
const { NotFoundError, BadRequestError } = require('../utils/error.response')
const { toObjectIdMongo, getSelectData } = require('../utils')


class DiscountService {
    /*  f: foundDiscount         c: isCreate
        f true --- c true -> err already exists
        f false --- c true -> return;
        f true --- c false -> foundDiscount
        f false --- c false -> err not found
    */
    static checkDiscountExists = async ({ discount_code, discount_shop_id, isCreate = false }) => {
        const foundDiscount = await DiscountRepository.findOne({
            filter: {
                discount_code,
                discount_shop_id: toObjectIdMongo(discount_shop_id)
            }
        })
        if (foundDiscount && isCreate) {
            throw new BadRequestError('Discount already exists')
        } else if (!foundDiscount && isCreate) {
            return;
        } else if (!foundDiscount && !isCreate) {
            throw new NotFoundError("Discount not found")
        } return foundDiscount

    }
    static async createDiscountCode({ payload }) {
        const {
            code, start_date, end_date, is_active,
            shop_id, min_order_value, prod_ids, applies_to,
            name, description, type, value, max_value, max_uses, uses_count,
            max_uses_per_user, uses_used
        } = payload

        if (!(new Date() < new Date(start_date) && new Date() < new Date(end_date))) {
            throw new BadRequestError('discount start/end date must after now')
        }
        if (new Date(end_date) <= new Date(start_date)) {
            throw new BadRequestError('start date must be before end date')
        }
        // check exist before create
        await this.checkDiscountExists({ discount_code: code, dicount_shop_id: shop_id, isCreate: true })
        const payloadDiscount = {
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: uses_used,
            discount_shop_id: shop_id,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_prod_ids: applies_to == 'all' ? [] : prod_ids
        }
        const newDiscount = await DiscountRepository.create({ payload: payloadDiscount })
        return newDiscount
    }

    static async updateDiscountCode() {

    }

    static async getAllProductsForDiscountCode({
        code, shop_id, limit = 50, page = 1
    }) {
        const foundDiscount = await this.checkDiscountExists({
            discount_code: code,
            discount_shop_id: shop_id
        })

        const { discount_applies_to, discount_prod_ids } = foundDiscount

        let prods
        const skip = (page - 1) * limit
        if (discount_applies_to == 'all') {
            prods = await ProductService.getAllProduct({
                filter: {
                    prod_shop: toObjectIdMongo(shop_id),
                    prod_is_published: true
                },
                // convert String to number
                limit: +limit,
                skip,
                sort: 'ctime',
                select: ["prod_name", "prod_slug"]
            })
        }

        if (discount_applies_to == 'specific') {
            prods = await ProductService.getAllProduct({
                filter: {
                    _id: { $in: discount_prod_ids },
                    prod_is_published: true
                },
                limit: +limit,
                skip,
                sort: 'ctime',
                select: ["prod_name", "prod_slug"]
            })
        }
        return prods
    }

    static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
        const skip = (page - 1) * limit
        const discounts = await DiscountRepository.find({
            filter: {
                discount_shop_id: toObjectIdMongo(shop_id),
                discount_is_active: true,
            },
            limit: +limit,
            skip,
            projection: getSelectData({ fields: ['discount_name', 'discount_code'] }),
        })
        return { ...discounts, test: "test" }
    }

    static async getDiscountAmount({ code, usr_id, shop_id, prods }) {
        const foundDiscount = await this.checkDiscountExists({
            discount_code: code,
            discount_shop_id: shop_id
        })

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new BadRequestError('discount expired')
        if (!discount_max_uses) throw new BadRequestError('discount are out')
        if (new Date() > new Date(discount_start_date) || new Date(discount_end_date) < new Date()) {
            throw new BadRequestError('discount are out 2')
        }
        //... others validator


        // check minimum value
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total of cart
            totalOrder = await Promise.all(prods.map(async (prod) => {
                const foundProduct = await ProductService.getOneProduct({
                    filter: { _id: prod.prod_id }
                });
                return prod.quantity * foundProduct.prod_price;
            })).then((prices) => prices.reduce((acc, price) => acc + price, 0));

            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError('discount require minium order value')
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_users_used.find(x => x.usr_id == usr_id)
            if (userUsedDiscount) throw new BadRequestError('discount being used for this user')
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder: totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ code, shop_id }) {
        const deletedDiscount = await DiscountRepository.findOneAndDelete({
            filter: {
                dicount_code: code,
                discount_shop_id: toObjectIdMongo(shop_id),
            }
        })
        return deletedDiscount
    }

    static async cancelUseDiscontCodeUser({ code, shop_id, usr_id }) {
        const foundDiscount = await this.checkDiscountExists({
            filter: {
                dicount_code: code,
                discount_shop_id: toObjectIdMongo(shop_id),
            }
        })

        const result = await foundDiscount.update({
            $pull: {
                discount_users_used: usr_id
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountService