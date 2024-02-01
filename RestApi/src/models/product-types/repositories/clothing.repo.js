'use strict';

const model = require('../clothing.model');

class ClothingRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ClothingRepository