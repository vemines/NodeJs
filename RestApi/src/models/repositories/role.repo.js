'use strict'

const model = require('../role.model')

class RoleRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static findOne = async ({ filter, projection, optionss }) => {
        return await model.findOne(filter, projection, optionss)
    }

    static aggregate = async ({ pipeline = [], options }) => {
        return await model.aggregate(pipeline, options)
    }

    static find = async ({ filter, projection, options, sort, skip, limit }) => {
        let query = model.find(filter, projection, options)
        if (skip !== undefined) query = query.skip(skip)
        if (limit !== undefined) query = query.limit(limit)
        if (sort !== undefined) query = query.sort(sort)
        return query.exec()
    }
}

module.exports = RoleRepository