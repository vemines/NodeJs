'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'clothing'
const COLLECTION_NAME = 'clothings'

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: Array, default: [] },
    material: String,
    variations: { type: Array, default: [] },
    make_in: String,
    prod_shop: { type: Schema.Types.ObjectId, require: true, ref: 'shop' }, // for find clothing product in shop
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, clothingSchema);