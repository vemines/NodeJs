'use strict'

const express = require('express');
const router = express.Router();

const AccessController = require('../../controllers/access.2.contr');

const { asyncHandler } = require('../../utils/async.handler.util');
const { authentication2 } = require('../../middlewares/auth.midware');

router.post('/signup', asyncHandler(AccessController.handleSignUp))
router.post('/signin', asyncHandler(AccessController.handleSignIn))
router.post('/signout', authentication2, asyncHandler(AccessController.handleSignOut))
router.post('/refresh-token', authentication2, asyncHandler(AccessController.handleRefreshToken))

module.exports = router;