'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
    inven_prod_id: { type: Types.ObjectId, ref: 'product' },
    inven_location: { type: String, default: 'Unknown' },
    inven_stock: { type: Number, required: true },
    inven_shop_id: { type: Types.ObjectId, ref: 'shop' },
    // []
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, inventorySchema)
