'use strict'

const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'resource'
const COLLECTION_NAME = 'resources'

const resourceSchema = new Schema({
    src_name: { type: String, required: true },     // profile
    src_slug: { type: String, required: true },     // 000001 show for user
    src_description: { type: String, default: '' },
    src_created_by: { type: Types.ObjectId, required: true, ref: 'user' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, resourceSchema)