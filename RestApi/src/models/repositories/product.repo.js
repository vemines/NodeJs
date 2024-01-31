'use strict'

const model = require('../product.model')
const { Types } = require('mongoose')
const { BadRequestError, NotFoundError } = require('../../utils/error.response')
const { getSelectData, getUnSelectData } = require('../../utils')
const { toObjectIdMongo } = require('../../utils')

class ProductRepository {
    static find = async ({ filter, projection, options, sort, skip, limit }) => {
        return await model.find(filter, projection, options).sort(sort).skip(skip).limit(limit).exec()
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

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ProductRepository
