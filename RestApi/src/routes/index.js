const express = require('express');
const router = express.Router();

const { apikey, permission } = require('../middlewares/auth.midware');
const { asyncHandler } = require('../utils/async.handler.util');

router.use('/v1/api/api-key', require('./api-key/api.key.route'))

router.use(asyncHandler(apikey))
router.use(asyncHandler(permission("akp00001")))

router.use('/v1/api/order', require('./order/order.route'))
router.use('/v1/api/discount', require('./discount/discount.route'))
router.use('/v1/api/comment', require('./comment/comment.route'))
router.use('/v1/api/upload', require('./upload/upload.route'))
router.use('/v1/api/cart', require('./cart/cart.route'))
router.use('/v1/api/product', require('./product/product.route'))
router.use('/v1/api/user', require('./user/user.route'))
router.use('/v1/api/access-1', require('./access-1/access.1.route'))
router.use('/v1/api/access-2', require('./access-2/access.2.route'))
router.use('/v1/api/shop', require('./shop/shop.route'))

module.exports = router;