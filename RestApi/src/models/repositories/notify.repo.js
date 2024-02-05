'use strict'

const model = require('../notify.model')

class NotifyRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static insertMany = async ({ payload }) => {
        return await model.insertMany(payload)
    }

    static find = async ({ filter, projection, options, sort, skip, limit }) => {
        let query = model.find(filter, projection, options)
        if (skip !== undefined) query = query.skip(skip)
        if (limit !== undefined) query = query.limit(limit)
        if (sort !== undefined) query = query.sort(sort)
        return query.exec()
    }

    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }
}

module.exports = NotifyRepository