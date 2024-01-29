'use strict'

const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model 
const inventorySchema = new Schema({
    inven_prod_id: { type: Types.ObjectId, ref: 'product' },
    inven_location: { type: String, default: 'Unknown' },
    inven_stock: { type: Number, required: true },
    inven_shop_id: { type: Types.ObjectId, ref: 'shop' },
    inven_reservations: { type: Array, default: [] }    // {cartId: ,stock: 1, createdOn:,}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema)
