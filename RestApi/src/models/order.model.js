'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const OrderSchema = new Schema({
    order_usr_id: { type: Types.ObjectId, required: true, ref: 'user' },
    order_checkout: { type: Object, default: {} },  // { totalPrice, totalApplyDiscount, feeShip }
    order_shipping: { type: Object, default: {} },  // {"address", "address_city"}
    order_payment: { type: Object, default: {} },   // {}
    // []
    order_prods: { type: Array, required: true },   // { "price", "quantity", "productId"}
    order_discounts: { type: Array, default: [] },
    // Datetime-randomString
    order_trackingNumber: { type: String, default: '' },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, OrderSchema)