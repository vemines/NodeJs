'use strict'

const express = require('express')
const router = express.Router()

const InjectController = require('../../controllers/inject.contr')

const asyncHandler = require('../../utils/async.handler.util');

router.post('/create', asyncHandler(InjectController.handleCreateUser))
router.post('/login', asyncHandler(InjectController.handleLogin))
router.post('/login2', asyncHandler(InjectController.handleLogin2))

module.exports = router