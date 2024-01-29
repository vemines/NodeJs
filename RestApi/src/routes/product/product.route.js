'use strict'

const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.contr');
const { asyncHandler } = require('../../utils/async.handler.util');


router.post('/search/:keySearch', asyncHandler(ProductController.handleSearchProdctByUser))
router.get('/list', asyncHandler(ProductController.handleFindAllProductsByUser))
router.get('/detail/:productId', asyncHandler(ProductController.handleProductDetailByUser))

module.exports = router;