'use strict'

const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.contr');

const asyncHandler = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

router.patch('/update-user-info', authenticationUser, asyncHandler(UserController.handleUpdateUserInfo))
router.post('/create-shop', authenticationUser, asyncHandler(UserController.handleCreateShop))

module.exports = router;