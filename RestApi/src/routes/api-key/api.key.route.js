'use strict'

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/async.handler.util');
const ApiKeyController = require('../../controllers/api.key.contr');
const { apikey, permission } = require('../../middlewares/auth.midware');

router.post('/create', asyncHandler(ApiKeyController.handleCreateNewApiKey))

router.post(
    '/addPermission',
    apikey,
    permission("akp00002"),
    asyncHandler(ApiKeyController.handleAddPermissionApiKey)
)

router.post(
    '/removePermission',
    apikey,
    permission("akp00002"),
    asyncHandler(ApiKeyController.handleRemovePermissionApiKey)
)

module.exports = router;