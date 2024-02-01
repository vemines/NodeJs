
'use strict';

const { SuccessResponse } = require('../utils/success.response');
const CommenntService = require('../services/comment.svc')

class CommentController {
    static handleCreateComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommenntService.createComment({ payload: req.body })
        }).send(res)
    }

    static handleDeleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete success',
            metadata: await CommenntService.deleteComments(req.body)
        }).send(res)
    }

    static handleGetCommentByParentId = async (req, res, next) => {
        new SuccessResponse({
            metadata: await CommenntService.getCommentsByParentId({
                prod_id: req.query.prod_id,
                comment_parent_id: req.query.comment_parent_id,
            })
        }).send(res)
    }
}
module.exports = CommentController