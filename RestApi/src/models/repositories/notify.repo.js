'use strict'

const model = require('../notify.model')

class NotifyRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static find = async ({ filter, projection, options }) => {
        return await model.find(filter, projection, options)
    }

    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }
}

module.exports = NotifyRepository