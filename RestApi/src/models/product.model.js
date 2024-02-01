'use strict'

const { model, Schema, Types } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    prod_name: { type: String, required: true },
    prod_thumb: { type: String, required: true },
    prod_slug: String,
    prod_description: String,
    prod_price: { type: Number, required: true },
    prod_quantity: { type: Number, required: true },
    prod_type: { type: String, required: true, enum: ['Electronic', 'Clothing'] },
    prod_shop: { type: Types.ObjectId, ref: 'shop' },
    prod_attributes: { type: Schema.Types.Mixed, required: true },
    // []
    prod_ratings: { type: Array, default: [] },
    prod_ratingsAverage: {
        type: Number, default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.345 => 4.3
        set: (val) => Math.round(val * 10) / 10
    },
    // []
    prod_variations: { type: Array, default: [] },
    prod_is_draft: { type: Boolean, default: true, index: true, select: false },
    prod_is_published: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

// Create index for product for search by prod_slug
productSchema.index({ prod_slug: 'text' })

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.prod_slug = slugify(this.prod_name, { lower: true })
    next()
})

module.exports = model(DOCUMENT_NAME, productSchema)

