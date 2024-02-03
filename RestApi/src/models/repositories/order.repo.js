'use strict'

const model = require('../order.model')

class OrderRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = OrderRepository