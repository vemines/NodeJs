'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'inject'
const COLLECTION_NAME = 'injects'

const injectSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, injectSchema)