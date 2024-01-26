'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key_token2'
const COLLECTION_NAME = 'key_tokens2'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    publicKey: { type: String, required: true },
    refreshToken: { type: String, required: true },
    refreshTokensUsed: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,

});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);