'use strict'

const express = require('express')
const router = express.Router()

const CommentController = require('../../controllers/comment1.contr')

const asyncHandler = require('../../utils/async.handler.util');

router.post('/create-comment', asyncHandler(CommentController.handleCreateComment))
router.get('/list-comments/:discuss_id', asyncHandler(CommentController.handleGetAllComments))
router.get('/get-comment/:slug', asyncHandler(CommentController.handleGetCommentWithSlug))

module.exports = router