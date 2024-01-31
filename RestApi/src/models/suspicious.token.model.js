'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'suspicious_token'
const COLLECTION_NAME = 'suspicious_tokens'

var keyTokenSchema = new Schema({
    usr_id: { type: Types.ObjectId, required: true, ref: 'User' },
    usr_slug: { type: String, required: true, ref: 'User' },
    public_key: { type: String, required: true },
    private_key: { type: String, default: "" }, // required: true when access-1 remove when access-2
    refresh_token: { type: String, required: true },
    access_token: { type: String, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);