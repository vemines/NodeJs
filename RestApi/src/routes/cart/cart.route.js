'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.contr')
const { asyncHandler } = require('../../utils/async.handler.util');

const router = express.Router()

router.post('/add-product', asyncHandler(CartController.handleAddToCart))
router.post('/update-cart', asyncHandler(CartController.handleUpdateCart))
router.delete('/delete-product', asyncHandler(CartController.handleDeleteProduct))

router.delete('/clear', asyncHandler(CartController.handleClearCart))
router.get('/detail', asyncHandler(CartController.handleGetListCart))

module.exports = router