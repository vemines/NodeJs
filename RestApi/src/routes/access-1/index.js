'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.1.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');
const router = express.Router();

// signup
router.post('/signup', asyncHandler(AccessController.handleSignUp))

// signin
router.post('/signin', asyncHandler(AccessController.handleSignIn))

// signout
router.post('/signout', authenticationUser, asyncHandler(AccessController.handleSignOut))

// refresh token
router.post('/refresh-token', authenticationUser, asyncHandler(AccessController.handleRefreshToken))

// create shop by user
router.post('/create-shop', authenticationUser, asyncHandler(AccessController.handleCreateShop))

// create shop by user
router.patch('/update-user-info', authenticationUser, asyncHandler(AccessController.handleUpdateUserInfo))

module.exports = router;