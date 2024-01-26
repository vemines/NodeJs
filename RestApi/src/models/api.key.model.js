'use strict'

const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'apikey'
const COLLECTION_NAME = 'apikeys'

// Declare the Schema of the Mongo model 
const apiKeySchema = new Schema({
    key: { type: String, required: true, unique: true },
    accountId: { type: Types.ObjectId, required: true },
    status: { type: Boolean, default: true, },
    permissions: { type: [String], default: ['akp00001'], enum: ['akp00001', 'akp00002', 'akp00003'] },// Api key permissions
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
