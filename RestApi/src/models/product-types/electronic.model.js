'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'electronic'
const COLLECTION_NAME = 'electronics'

const electronicSchema = new Schema({
    manufactor: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Types.ObjectId, require: true, ref: 'shop' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, electronicSchema);