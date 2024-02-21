const express = require('express');
const router = express.Router();

router.use('/comment1', require('./comment1/comment1.route'))
router.use('/injections', require('./inject/inject.route'))
router.use('/hateoas', require('./hateoas/hateoas.route.js'))

module.exports = router;