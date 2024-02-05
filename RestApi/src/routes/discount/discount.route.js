'use strict'


const express = require('express')
const router = express.Router()

const DiscountController = require('../../controllers/discount.contr')

const asyncHandler = require('../../utils/async.handler.util');
const { authenticationUser, authenticationShop } = require('../../middlewares/auth.midware');

router.post('/create-discount', authenticationUser, authenticationShop,
    asyncHandler(DiscountController.handleCreateDiscountCode))
router.get('/list-discount-shop', authenticationUser, authenticationShop,
    asyncHandler(DiscountController.handleGetAllDiscountCodeByShop))

router.post('/amount', asyncHandler(DiscountController.handleGetDiscountAmount))
router.get('/list-product-code', asyncHandler(DiscountController.handleGetAllProductsForDiscountCode))


module.exports = router