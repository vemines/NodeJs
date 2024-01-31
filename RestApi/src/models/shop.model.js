'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'

const userSchema = new Schema({
    usr_slug: { type: String, required: true },  // usr_slug of user
    shop_slug: { type: String, required: true }, // id that show to user
    shop_name: { type: String, default: '' },
    shop_email: { type: String, required: true },
    shop_phone: { type: String, default: '' },
    shop_avatar: { type: String, default: '' },
    shop_address_city: { type: String, default: '' },
    shop_address: { type: String, default: '' },
    shop_role: { type: Schema.Types.ObjectId, ref: 'role' },
    shop_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema)