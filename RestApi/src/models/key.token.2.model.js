'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key_token2'
const COLLECTION_NAME = 'key_tokens2'

var keyTokenSchema = new Schema({
    usr_id: { type: Types.ObjectId, required: true, ref: 'User' },
    usr_slug: { type: String, required: true, ref: 'User' },
    public_key: { type: String, required: true },
    refresh_token: { type: String, default: "" },
    // []
    refresh_tokens_used: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);