'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.contr')
const { asyncHandler } = require('../../utils/async.handler.util');

const router = express.Router()

router.post('/add-product', asyncHandler(CartController.handleAddToCart))
router.post('/update-cart', asyncHandler(CartController.handleUpdateCart))
router.delete('/remove-product', asyncHandler(CartController.handleRemoveProduct))

router.delete('/clear-cart', asyncHandler(CartController.handleClearCart))
router.get('/detail-cart', asyncHandler(CartController.handleGetListCart))

module.exports = router