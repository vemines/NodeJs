'use strict'

const model = require('../comment.model')

class CommentRepository {
    // productId, userId, content, parentCommentId = null
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static findById = async ({ comment_id, update, options }) => {
        return await model.findById(comment_id, update, options)
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

    static updateMany = async ({ filter, update, options }) => {
        return await model.updateMany(filter, update, options)
    }

    static deleteMany = async ({ filter, options }) => {
        return await model.deleteMany(filter, options)
    }
}

module.exports = CommentRepository