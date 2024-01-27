'use strict'
const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'electronic'
const COLLECTION_NAME = 'electronics'

// Declare the Schema of the Mongo model
const electronicSchema = new Schema({
    manufactor: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, electronicSchema);