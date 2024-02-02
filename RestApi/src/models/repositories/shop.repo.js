'use strict'

const model = require('../shop.model')

class ShopRepository {
    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }

    static findById = async ({ id, projection, options }) => {
        return await model.findById(id, projection, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ShopRepository