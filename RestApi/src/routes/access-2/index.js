'use strict'

const express = require('express');
const accessController = require('../../controllers/access.2.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authentication2 } = require('../../middlewares/auth.midware');
const router = express.Router();

// signup
router.post('/signup', asyncHandler(accessController.handleSignUp))

// signin
router.post('/signin', asyncHandler(accessController.handleSignIn))

// middleware check auth
router.use(authentication2)

// signout
router.post('/signout', asyncHandler(accessController.handleSignOut))

// refresh token
router.post('/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router;