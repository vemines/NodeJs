'use strict'

const model = require('../product.model')

class ProductRepository {
    static find = async ({ filter, projection, options, sort, skip, limit }) => {
        let query = model.find(filter, projection, options)
        if (skip !== undefined) query = query.skip(skip)
        if (limit !== undefined) query = query.limit(limit)
        if (sort !== undefined) query = query.sort(sort)
        return await query.exec()
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }

    static findByIdAndUpdate = async ({ prod_id, update, options }) => {
        return await model.findByIdAndUpdate(prod_id, update, options)
    }
    static findById = async ({ prod_id, projection, options }) => {
        return await model.findById(prod_id, projection, options)
    }

    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }
    // "prod_name", "prod_slug": slugify(prod_name, { lower: true }), "prod_thumb", "prod_price",
    // "prod_type", "prod_shop", "prod_attributes" {BASE ON PRODUCT TYPE MODEL}, "prod_quantity" 
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ProductRepository
