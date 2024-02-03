'use strict'

const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'notify'
const COLLECTION_NAME = 'notifys'

var notifySchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'PROMOTION-001', 'SHOP-001'], required: true },
    noti_sender_id: { type: Types.ObjectId, required: true, ref: 'shop' },
    noti_received_id: { type: Types.ObjectId, required: true, ref: 'user' },
    noti_content: { type: String, required: true },
    noti_status: { type: Boolean, default: false },
    noti_options: { type: Object, default: {} },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, notifySchema)