'use strict';

const model = require('../../product-types/clothing.model');

class ClothingRepository {
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

module.exports = ClothingRepository