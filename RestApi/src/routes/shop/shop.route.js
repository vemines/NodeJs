'use strict'

const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.contr');
const { asyncHandler } = require('../../utils/async.handler.util');
const { authenticationUser, authenticationShop } = require('../../middlewares/auth.midware');


router.post('/create-product',
    authenticationUser,
    authenticationShop,
    asyncHandler(ProductController.handleCreateProductByShop)
)
router.patch('/update-product/:productId',
    authenticationUser, authenticationShop,
    asyncHandler(ProductController.handleUpdateProductByShop)
)
router.post('/publish-product/:productId',
    authenticationUser, authenticationShop,
    asyncHandler(ProductController.handlePublishProductByShop)
)
router.post('/unPublish-product/:productId',
    authenticationUser, authenticationShop,
    asyncHandler(ProductController.handleUnPublishProductByShop)
)
router.get('/drafts/all',
    authenticationUser, authenticationShop,
    asyncHandler(ProductController.handleGetAllDraftsByShop)
)
router.get('/published/all',
    authenticationUser, authenticationShop,
    asyncHandler(ProductController.handleGetAllPublishByShop)
)

module.exports = router;