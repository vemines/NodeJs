'use strict'

const model = require('../user.model')
const shopModel = require('../shop.model')
const { NotFoundError, InternalServerError, BadRequestError } = require('../../utils/error.response')
const { toObjectIdMongo, randomString } = require('../../utils')

class UserRepository {
    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    static findById = async ({ usr_id, projection, options }) => {
        return await model.findById(usr_id, projection, options)
    }
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static findByIdAndUpdate = async ({ usr_id, update, options }) => {
        return await model.findByIdAndUpdate(usr_id, update, options)
    }
}

module.exports = UserRepository