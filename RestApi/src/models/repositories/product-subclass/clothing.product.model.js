'use strict'
const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'clothing'
const COLLECTION_NAME = 'clothings'

// Declare the Schema of the Mongo model
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: Array, default: [] },
    material: String,
    made_in: String,
    variations: { type: Array, default: [] },
    shop_slug: { String, require: true },
    shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, clothingSchema);