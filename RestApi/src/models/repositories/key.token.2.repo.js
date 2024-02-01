'use strict'

const model = require('../key.token.2.model')

class KeyToken2Repository {

    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    // "usr_id", "usr_slug", "refresh_token", "public_key"
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = KeyToken2Repository