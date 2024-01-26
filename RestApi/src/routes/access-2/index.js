'use strict'

const express = require('express');
const accessController = require('../../controllers/access.2.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authentication } = require('../../utils/auth.util');
const router = express.Router();

// Signup
router.post('/access2/signup', asyncHandler(accessController.signUp))

// Login
router.post('/access2/login', asyncHandler(accessController.login))

router.use(authentication)

// Logout
router.post('/access2/logout', asyncHandler(accessController.logout))

// Refresh Token
router.post('/access2/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router;