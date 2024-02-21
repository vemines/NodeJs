'use strict';

const { SuccessResponse } = require('../utils/success.response');
const CommentService = require('../services/comment1.svc')

class CommentController {
    static handleCreateComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'description of function',
            metadata: await CommentService.createComment({ ...req.body })
        }).send(res)
    }

    static handleGetAllComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'description of function',
            metadata: await CommentService.getComments({ discuss_id: req.params.discuss_id })
        }).send(res)
    }

    static handleGetCommentWithSlug = async (req, res, next) => {
        new SuccessResponse({
            message: 'description of function',
            metadata: await CommentService.getCommentBySlug({ comment_slug: req.params.slug })
        }).send(res)
    }
}

module.exports = CommentController