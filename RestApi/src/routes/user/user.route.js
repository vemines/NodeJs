'use strict'

const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

// create shop by user
router.patch('/update-user-info', authenticationUser, asyncHandler(UserController.handleUpdateUserInfo))

module.exports = router;