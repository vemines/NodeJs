'use strict'

const { toObjectIdMongo } = require('../../utils')
const { ForbiddenError, UnAuthorizedError, InternalServerError } = require('../../utils/error.response')
const model = require('../key.token.2.model')
const suspiciousTokenModel = require('../suspicious.token.model')

class KeyToken2Repository {

    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = KeyToken2Repository