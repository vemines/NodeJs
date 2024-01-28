const express = require('express');
const router = express.Router();
const { apikey, permission } = require('../middlewares/auth.midware');
const { asyncHandler } = require('../utils/async.handler.util');

router.use('/v1/api/api-key', require('./api-key'))

router.use(asyncHandler(apikey))
router.use(asyncHandler(permission("akp00001")))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/access-1', require('./access-1'))
router.use('/v1/api/access-2', require('./access-2'))
router.use('/v1/api/shop', require('./shop'))

module.exports = router;