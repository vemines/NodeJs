'use strict'

const CommentRepository = require('../models/repositories/comment1.repo')

const { getUnSelectData } = require('../utils')
const { NotFoundError } = require('../utils/error.response')

class CommentService {
    static createComment = async ({
        discuss_id, text,
        parent_slug, slug,
        author,
    }) => {
        const posted = new Date()
        let full_slug = `${posted.toISOString()}:${slug}`
        if (parent_slug) {
            const foundComment = await CommentRepository.findOne({ filter: { discuss_id, slug: parent_slug } })
            if (foundComment) {
                full_slug = `${foundComment.full_slug}/${full_slug}`
                slug = `${foundComment.slug}/${slug}`
            }
        }
        const payload = {
            discuss_id,
            text,
            parent_slug,
            slug,
            author,
            posted,
            full_slug,
        }
        return await CommentRepository.create({ payload })
    }

    static getComments = async ({ discuss_id, limit = 50, page = 1 }) => {
        const skip = (page - 1) * limit
        const projection = getUnSelectData({ fields: ["_id", "createdAt", "updatedAt", "__v"] })
        const filter = { discuss_id }
        const sort = { full_slug: 1 }

        const comments = await CommentRepository.find({ filter, projection, skip, limit, sort })
        return comments
    }

    static getCommentBySlug = async ({ comment_slug }) => {
        const filter = { slug: RegExp(comment_slug, 'i') }
        const projection = getUnSelectData({ fields: ["_id", "createdAt", "updatedAt", "__v"] })

        const comment = await CommentRepository.find({ filter, projection })
        return comment
    }
}

module.exports = CommentService