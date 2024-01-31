'use strict'

const express = require('express');
const router = express.Router();

const AccessController = require('../../controllers/access.1.contr');

const { asyncHandler } = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

router.post('/signup', asyncHandler(AccessController.handleSignUp))
router.post('/signin', asyncHandler(AccessController.handleSignIn))
router.post('/signout', authenticationUser, asyncHandler(AccessController.handleSignOut))
router.post('/refresh-token', authenticationUser, asyncHandler(AccessController.handleRefreshToken))

module.exports = router;