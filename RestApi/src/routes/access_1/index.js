'use strict'

const express = require('express');
const accessController = require('../../controllers/access.1.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../utils/auth.util');
const router = express.Router();

// Signup
router.post('/access1/signup', asyncHandler(accessController.signUp))

// Login
router.post('/access1/login', asyncHandler(accessController.login))

router.use(authentication)

// Logout
router.post('/access1/logout', asyncHandler(accessController.logout))

// Refresh Token
router.post('/access1/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router;