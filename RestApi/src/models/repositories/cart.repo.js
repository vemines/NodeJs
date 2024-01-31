'use strict'

const model = require('../cart.model')
const { getProductById } = require('./product.repo')
const { Types } = require('mongoose')

class CartRepository {

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