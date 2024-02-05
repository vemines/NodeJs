'use strict'

const model = require('../shop.model')

class ShopRepository {
    static find = async ({ filter, projection, options }) => {
        return await model.find(filter, projection, options)
    }

    static findById = async ({ id, projection, options }) => {
        return await model.findById(id, projection, options)
    }

    static findByIdAndUpdate = async ({ id, update, options }) => {
        return await model.findByIdAndUpdate(id, update, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ShopRepository