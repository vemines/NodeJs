'use strict'

const model = require('../cart.model')

class CartRepository {
    // "usr_id", "prod_id", "shop_id", "quantity", "prod_name", "prod_[price]"
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

module.exports = CartRepository