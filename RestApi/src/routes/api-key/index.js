'use strict'

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/async.handler.util');
const ApiKeyController = require('../../controllers/api.key.contr');

router.post('/create', asyncHandler(ApiKeyController.createNewApiKey))

module.exports = router;