'use strict'

const redisPubSubService = require('../../services/redisPubSub.service')

class RedisPubishTest {
    test(productId, quantity) {
        const order = { productId, quantity }
        console.log('productId: ', productId);
        redisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new RedisPubishTest()
