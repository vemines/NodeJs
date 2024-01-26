'use strict'

const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'InitTemp'
const COLLECTION_NAME = 'InitTemps'

// Declare the Schema of the Mongo model 
const initTempSchema = new Schema({
    name_field: { type: String, required: true, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, initTempSchema);
