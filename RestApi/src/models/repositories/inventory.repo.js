'use strict'

const model = require('../inventory.model')

class InventoryRepository {
    // inven_stock, inven_prod_id, inven_shop_id, inven_address, inven_address_city
    static create = async ({ payload }) => {
        return await model.create(payload)
    }
    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }
    static findByIdAndUpdate = async ({ filter, update, options }) => {
        return await model.findByIdAndUpdate(filter, update, options)
    }
}

module.exports = InventoryRepository