'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'suspicious_token'
const COLLECTION_NAME = 'suspicious_tokens'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    usr_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    usr_slug: { type: String, required: true, ref: 'User' },
    public_key: { type: String, required: true },
    private_key: { type: String, required: true },
    refresh_token: { type: String, required: true },
    access_token: { type: String, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);