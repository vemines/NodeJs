'use strict'

const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'api_key'
const COLLECTION_NAME = 'api_keys'

// Declare the Schema of the Mongo model 
const apiKeySchema = new Schema({
    key: { type: String, required: true, unique: true },
    usr_id: { type: String, default: "" },
    ip_address: { type: String, required: true },
    status: { type: Boolean, default: true, },
    permissions: { type: [String], default: ['akp00001'], enum: ['akp00001', 'akp00002', 'akp00003'] },// Api key permissions
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
