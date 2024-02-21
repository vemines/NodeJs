'use strict'

const model = require('../inject.model')

class InjectRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }

    static findOne = async ({ filter }) => {
        return await model.findOne(filter)
    }

}

module.exports = InjectRepository