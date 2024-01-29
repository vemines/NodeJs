'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
    cart_state: { type: String, required: true, enum: ['active', 'completed', 'failded', 'pending'], default: 'active' },
    cart_products: { type: Array, required: true, default: [] }, // { productId ,shopId ,quantity, price }
    cart_count_product: { type: Number, default: 0 },   // total products in cart
    cart_usr_id: { type: String, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, cartSchema)