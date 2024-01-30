'use strict';

const model = require('../../product-types/electronic.model');

class ElectronicRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ElectronicRepository