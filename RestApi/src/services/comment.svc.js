'use strict'

const { Types } = require('mongoose')

const CommentRepository = require('../models/repositories/comment.repo')
const ProductService = require('../services/product.svc')

const { toObjectIdMongo } = require('../utils')
const { NotFoundError } = require('../utils/error.response')
class CommenntService {
    static createComment = async ({ payload }) => {
        const { prod_id, usr_id, content, comment_parent_id = null } = payload
        let rightValue
        if (comment_parent_id) {
            const parentComment = await CommentRepository.findById({ comment_id: comment_parent_id })
            if (!parentComment) throw new NotFoundError('parent comment not found')
            rightValue = parentComment.comment_right

            // updateMany comments
            let filter = {
                comment_prod_id: toObjectIdMongo(prod_id),
                comment_right: { $gte: rightValue }
            }
            let update = { $inc: { comment_right: 2 } }
            await CommentRepository.updateMany({ filter, update })

            filter = {
                comment_prod_id: toObjectIdMongo(prod_id),
                comment_left: { $gt: rightValue }
            }
            update = { $inc: { comment_left: 2 } }
            await CommentRepository.updateMany({ filter, update })
        } else {
            const filter = { comment_prod_id: toObjectIdMongo(prod_id) }
            const projection = 'comment_right'
            const options = { sort: { comment_right: -1 } }
            const maxRightValue = await CommentRepository.findOne({
                filter, projection, options
            })

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comemnt
        const commectPayload = {
            comment_prod_id: prod_id,
            comment_usr_id: usr_id,
            comment_content: content,
            comment_parent_id,
            comment_left: rightValue,
            comment_right: rightValue + 1
        }
        const comment = CommentRepository.create({ payload: commectPayload })

        return comment
    }

    static getCommentsByParentId = async ({
        prod_id,
        comment_parent_id = null,
        limit = 50, page = 1
    }) => {
        const skip = (page - 1) * limit
        const sort = { comment_left: 1 }
        const projection = {
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }

        if (comment_parent_id) {
            const parent = await CommentRepository.findById({ comment_id: comment_parent_id })
            if (!parent) throw new NotFoundError('Not found comment parent')
            const filter = {
                comment_prod_id: toObjectIdMongo(prod_id),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }

            const comments = await CommentRepository.find({
                filter, projection, limit, skip, sort
            })
            return comments
        }

        const filter = {
            comment_prod_id: toObjectIdMongo(prod_id),
            comment_parentId: comment_parent_id
        }

        const comments = await CommentRepository.find({ filter, projection, limit, skip, sort })

        return comments
    }



    //delete comments
    static async deleteComments({ comment_id, prod_id }) {
        const foundProduct = await ProductService.checkProductExist({
            prod_id
        })

        // define left and right of comment_id
        const comment = await CommentRepository.findById({ comment_id })
        if (!comment) throw new NotFoundError('Comment not found')

        // Find width for removal and update
        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        const width = rightValue - leftValue + 1;

        // delete child of comment_id
        let filter = {
            comment_prod_id: toObjectIdMongo(prod_id),
            comment_left: { $gte: leftValue, $lte: rightValue }
        }
        await CommentRepository.deleteMany({ filter })

        filter = {
            comment_prod_id: toObjectIdMongo(prod_id),
            comment_right: { $gt: rightValue }
        }
        let update = { $inc: { comment_right: -width } }
        //4. update other left/right value
        await CommentRepository.updateMany({ filter, update })

        filter = {
            comment_prod_id: toObjectIdMongo(prod_id),
            comment_left: { $gt: rightValue }
        }
        update = { $inc: { comment_left: -width } }
        await CommentRepository.updateMany({ filter, update })

        return true;
    }
}
module.exports = CommenntService