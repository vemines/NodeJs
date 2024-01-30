'use strict'

const model = require('../suspicious.token.model')

class SuspiciousRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = SuspiciousRepository