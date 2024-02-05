'use strict'

const express = require('express');
const router = express.Router();

const CommentController = require('../../controllers/comment.contr');

const asyncHandler = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

router.post('/add-comment', authenticationUser, asyncHandler(CommentController.handleCreateComment))
router.delete('/delete-comment', authenticationUser, asyncHandler(CommentController.handleDeleteComment))
router.get('/get-comment', asyncHandler(CommentController.handleGetCommentByParentId))

module.exports = router;