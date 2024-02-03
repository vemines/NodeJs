'use strict'

const express = require('express');
const router = express.Router();

const NotifyController = require('../../controllers/notify.contr');

const { asyncHandler } = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');

router.get('/get-notifies', authenticationUser,
    asyncHandler(NotifyController.handleGetListNotiByUser))
router.post('/read-notify/:notify_id', authenticationUser,
    asyncHandler(NotifyController.handleReadNotifyByUser))

module.exports = router;