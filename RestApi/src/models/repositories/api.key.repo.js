'use strict'

const model = require('../api.key.model')


class ApiKeyRepository {
    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }

    //  projection { field: 1 / 0 } 0 for exclude field and default if not declaire
    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
}

module.exports = ApiKeyRepository