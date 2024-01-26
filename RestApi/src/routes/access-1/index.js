'use strict'

const express = require('express');
const accessController = require('../../controllers/access.1.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authentication } = require('../../utils/auth.util');
const router = express.Router();

// signup
router.post('/signup', asyncHandler(accessController.handleSignUp))

// signin
router.post('/signin', asyncHandler(accessController.handleSignIn))

// middleware check auth
router.use(authentication)

// signout
router.post('/signout', asyncHandler(accessController.handleSignOut))

// refresh token
router.post('/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router;