'use strict'

const { model, Schema, Types } = require('mongoose');
const { db1 } = require('./mongo.db');

const DOCUMENT_NAME = 'comment1'
const COLLECTION_NAME = 'comments1'

const commentSchema = new Schema({
    fields_name: { type: String, required: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = db1.model(DOCUMENT_NAME, commentSchema)