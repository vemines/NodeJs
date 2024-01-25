const express = require('express');
const router = express.Router();

router.get('/checkstatus', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

router.use('/v1/api/access1', require('./access_1'))
router.use('/v1/api/access2', require('./access_2'))

module.exports = router;