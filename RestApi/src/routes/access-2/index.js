'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.2.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authentication2 } = require('../../middlewares/auth.midware');
const router = express.Router();

// signup
router.post('/signup', asyncHandler(AccessController.handleSignUp))

// signin
router.post('/signin', asyncHandler(AccessController.handleSignIn))

// signout
router.post('/signout', authentication2, asyncHandler(AccessController.handleSignOut))

// refresh token
router.post('/refresh-token', authentication2, asyncHandler(AccessController.handleRefreshToken))

module.exports = router;