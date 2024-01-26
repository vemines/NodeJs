'use strict'

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/async.handler.util');
const ApiKeyController = require('../../controllers/api.key.contr');

router.post('/temporary', asyncHandler(ApiKeyController.createTempApiKey))

module.exports = router;