'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, enum: ['fixed_amount', 'percentage'], default: 'fixed_amount' },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // max uses able
    discount_uses_count: { type: Number, required: true }, // total uses count
    // []
    discount_users_used: { type: Array, default: [] }, // total user use this code
    discount_max_uses_per_user: { type: Number, required: true }, // allow user use this code (times)
    discount_min_order_value: { type: Number, required: true }, // min price apply code
    discount_shop_id: { type: Types.ObjectId, ref: 'shop' },
    discount_max_value: { type: Number, required: true }, // max price discount reduce
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    // []
    discount_prod_ids: { type: Array, default: [] } // if speccific need list productId
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema)
