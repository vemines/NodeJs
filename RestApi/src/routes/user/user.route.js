'use strict'

const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.contr');

const asyncHandler = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

router.patch('/update-user-info', authenticationUser, asyncHandler(UserController.handleUpdateUserInfo))
router.post('/create-shop', authenticationUser, asyncHandler(UserController.handleCreateShop))
router.post('/subcribe-shop', authenticationUser, asyncHandler(UserController.handleSubcribeShop))
router.post('/unsubcribe-shop', authenticationUser, asyncHandler(UserController.handleUnSubcribeShop))
router.get('/get-notifys', authenticationUser, asyncHandler(UserController.handleGetNotifys))

module.exports = router;