'use strict'

const model = require('../comment1.model')

class CommentRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static find = async ({ filter, projection, options, limit, skip, sort }) => {
        let query = model.find(filter, projection, options)
        if (skip !== undefined) query = query.skip(skip)
        if (limit !== undefined) query = query.limit(limit)
        if (sort !== undefined) query = query.sort(sort)
        return await query.exec()
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
}

module.exports = CommentRepository