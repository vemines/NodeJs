'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key_token1'
const COLLECTION_NAME = 'key_tokens1'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    usr_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    usr_slug: { type: String, required: true, ref: 'User' },
    public_key: { type: String, required: true },
    private_key: { type: String, required: true },
    refresh_token: { type: String, default: "" },
    refresh_tokens_used: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,

});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);