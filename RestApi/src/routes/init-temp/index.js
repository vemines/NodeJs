'use strict'

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/async.handler.util');
const InitTempController = require('../../controllers/init.temp.contr');

router.post('/temporary', asyncHandler(InitTempController.functionName))

module.exports = router;

