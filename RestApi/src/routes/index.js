const express = require('express');
const router = express.Router();



router.use('/v1/api/api-key', require('./api-key'))
router.use('/v1/api/access-1', require('./access-1'))
router.use('/v1/api/access-2', require('./access-2'))

module.exports = router;