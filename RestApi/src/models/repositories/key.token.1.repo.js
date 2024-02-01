'use strict'

const model = require('../key.token.1.model')

class KeyToken1Repository {

    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    // "usr_id", "usr_slug", "refresh_token", "public_key", "private_key"
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = KeyToken1Repository