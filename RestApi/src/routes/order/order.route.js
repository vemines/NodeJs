'use strict'

const express = require('express');
const router = express.Router();

const OrderController = require('../../controllers/order.contr');

const { asyncHandler } = require('../../utils/async.handler.util');
// const { authenticationUser} = require('../../middlewares/auth.midware');

router.post('/review-order', asyncHandler(OrderController.handleOrderReview))
// router.post('/checkout', authenticationOrder, asyncHandler(OrderController.handleCreateShop))

module.exports = router;