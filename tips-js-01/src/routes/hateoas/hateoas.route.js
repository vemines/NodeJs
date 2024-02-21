'use strict'

const express = require('express')
const router = express.Router()

router.get('/user/111', (req, res, next) => {
    res.json({
        status: 'success',
        user: {
            userId: 111,
            name: 'anonystick',
            links: { feeds_url: 'http://localhost:3000/feeds/111' }
        }
    })
})
router.get('/feeds/111', (req, res, next) => {
    res.json({
        status: 'success',
        feeds: [{
            feedId: 1,
            title: 'title 01',
            like: 3,
            links: { likes_url: 'http://localhost:5000/likes/1' },
        }, {
            feedId: 2,
            title: 'title 02',
            like: 4,
            Links: { likes_url: 'http://localhost:5000/likes/2' }
        }]
    })
})

router.post('/feeds/likes/1', (req, res, next) => {
    res.json({
        feedId: 1,
        title: 'title 01',
        like: 4,
    })
})

module.exports = router