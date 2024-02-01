'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'inventory'
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema({
    inven_prod_id: { type: Types.ObjectId, ref: 'product' },
    inven_shop_id: { type: Types.ObjectId, ref: 'shop' },
    inven_address_city: { type: String, default: "" },  // use shop_address_city at example
    inven_address: { type: String, default: "" },       // use shop_address at example
    inven_stock: { type: Number, required: true },
    // []
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, inventorySchema)
