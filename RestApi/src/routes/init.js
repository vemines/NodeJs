'use strict'

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/async.handler.util');
// const NameController = require('../../controllers/name.contr');

router.post('/', asyncHandler())

module.exports = router;