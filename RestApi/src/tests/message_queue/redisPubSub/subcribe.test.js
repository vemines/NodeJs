'use strict'

const redisPubSubService = require('../../../services/redisPubSub.service')
class RedisSubcribeTest {
    constructor() {
        redisPubSubService.subcribe('purchase_events', (channel, message) => {
            console.log('Received message:', message)
            test(message)
        })
    }
    static test(productId, quantity) {
        console.log(`[0001]: Updated inventory for Product ID ${productId}: Quantity ${quantity}`);
    }
}

module.exports = new RedisSubcribeTest()