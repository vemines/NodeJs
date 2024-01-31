'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const OrderSchema = new Schema({
    order_usr_id: { type: Number, required: true },
    order_checkout: { type: Object, default: {} }, // { totalPrice, totalApplyDiscount, feeShip }
    order_shipping: { type: Object, default: {} }, // {street, city,  state, country}
    order_payment: { type: Object, default: {} },
    // []
    order_products: { type: Array, required: true },
    // Datetime-1234-abcd
    order_trackingNumber: { type: String, default: '' },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, OrderSchema)