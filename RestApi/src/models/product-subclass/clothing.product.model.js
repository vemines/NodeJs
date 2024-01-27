'use strict'

const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'clothing'
const COLLECTION_NAME = 'clothings'

// Declare the Schema of the Mongo model
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, clothingSchema);